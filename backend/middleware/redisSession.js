const { client } = require("../config/redisconfig");

const SESSION_TTL = 900; // 15 minutes

// Middleware to update user's last activity
const trackUserActivity = async (req, res, next) => {
    try {
        if (req.user?._id) {
            const userId = req.user._id.toString();
            const sessionKey = `session:${userId}`;
            
            // Get existing session
            const existingSession = await client.get(sessionKey);
            const session = existingSession ? JSON.parse(existingSession) : {};
            
            // Update session
            session.lastActive = Date.now();
            session.path = req.path;
            session.method = req.method;
            
            // Store updated session
            await client.setEx(sessionKey, SESSION_TTL, JSON.stringify(session));
        }
    } catch (error) {
        console.error("Session tracking error:", error);
    }
    next();
};

// Middleware to check if user session is valid
const validateUserSession = async (req, res, next) => {
    try {
        // Allow login and register routes to bypass session validation
        if (req.path === '/login' || req.path === '/register') {
            return next();
        }
        if (req.user?._id) {
            const userId = req.user._id.toString();
            const sessionKey = `session:${userId}`;
            // Check if session exists
            const session = await client.get(sessionKey);
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }
            // Check if session is active
            const sessionData = JSON.parse(session);
            const lastActive = sessionData.lastActive;
            const inactiveTime = Date.now() - lastActive;
            if (inactiveTime > SESSION_TTL * 1000) {
                // Clean up expired session
                await client.del(sessionKey);
                return res.status(401).json({
                    success: false,
                    message: "Session timeout. Please login again."
                });
            }
        }
        next();
    } catch (error) {
        console.error("Session validation error:", error);
        next();
    }
};

// Middleware to cache user data
const cacheUserData = async (req, res, next) => {
    try {
        if (req.user?._id) {
            const userId = req.user._id.toString();
            const userKey = `user:${userId}`;
            
            // Check if user data is cached
            const cachedUser = await client.get(userKey);
            if (!cachedUser) {
                // Cache basic user data
                const userData = {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone,
                    access: req.user.access
                };
                await client.setEx(userKey, 3600, JSON.stringify(userData)); // Cache for 1 hour
            }
        }
    } catch (error) {
        console.error("User caching error:", error);
    }
    next();
};

module.exports = {
    trackUserActivity,
    validateUserSession,
    cacheUserData
};
