const { getUserCookies, refreshToken } = require("../controller/User.Controller");

const userMiddleware = async (req, res, next) => {
    try {
        const user = await getUserCookies(req);
        if (!user) {
            return res.status(401).json({
                message: "Not authenticated",
                called: "failed"
            });
        }
        req.user = user;
        next();
    } catch (e) {
        return res.status(500).json({
            message: "Not a Valid User",
            called: "failed"
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await getUserCookies(req);
        if (!user) {
            return res.status(401).json({
                message: "Not authenticated",
                called: "failed"
            });
        }
        if (user.access !== 'admin') {
            return res.status(403).json({
                message: "Not authorized. Admin access required",
                called: "failed"
            });
        }
        req.user = user;
        next();
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            called: "failed"
        });
    }
};

module.exports = {
    userMiddleware,
    isAdmin
};
