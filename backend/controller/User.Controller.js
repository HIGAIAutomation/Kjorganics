const UserModel = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../config/redisconfig");

const genrateToken = (userid) => {
  const accessToken = jwt.sign({ userid }, process.env.HASHPASSWORD, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userid }, process.env.REFRESHTOKEN, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const SetRefreshToken = async (userID, refreshToken) => {
  try {
    const multi = client.multi();
    multi.set(`refresh:${userID}`, refreshToken);
    multi.expire(`refresh:${userID}`, 7 * 24 * 60 * 60);
    await multi.exec();
    return true;
  } catch (error) {
    console.error("Redis SetRefreshToken error:", error);
    return false;
  }
};

const setCookies = async (res, accessToken) => {
  try {
    if (!res || typeof res.cookie !== "function") {
      console.error("Invalid response object or cookie function not available");
      return false;
    }
    res.cookie("accesstoken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expiresIn: "15m", // 15 minutes in milliseconds
    });
    return true;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return false;
  }
};

const getAccessToken = (req) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    const parsedCookies = cookies
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return parsedCookies.accesstoken || null;
  } catch (error) {
    console.error("Error parsing access token:", error);
    return null;
  }
};

const refreshToken = async (req, res) => {
  try {
    // console.log("in")
    const accessToken = getAccessToken(req);
    //  console.log(accessToken)
    if (!accessToken) {
      return res.status(401).send({
        success: false,
        message: "Access token missing. Please login again.",
      });
    }

    // Decode without verifying since token is expired
    const user = jwt.decode(accessToken, process.env.HASHPASSWORD);
    //console.log(user);

    if (!user || !user.userid) {
      return res.status(401).send({
        success: false,
        message: "Invalid token. Cannot decode user.",
      });
    }

    const refresh_token = await client.get(`refresh:${user.userid}`);

    if (!refresh_token) {
      return res.status(403).send({
        success: false,
        message: "Refresh token not found. Please login again.",
      });
    }

    // Now verify the refresh token
    try {
      jwt.verify(refresh_token, process.env.REFRESHTOKEN);
    } catch (err) {
      return res.status(403).send({
        success: false,
        message: "Invalid or expired refresh token. Please login again.",
      });
    }

    // Generate new access token
    const New_accessToken = jwt.sign(
      { userid: user.userid },
      process.env.HASHPASSWORD,
      {
        expiresIn: "15m",
      }
    );

    // Set new access token in cookie
    const cookieStatus = setCookies(res, New_accessToken);
    if (!cookieStatus) {
      return res.status(500).send({
        success: false,
        message: "Failed to set new access token in cookie.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "New access token was issued successfully.",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // 1. Check if user already exists
    const userExisting = await UserModel.findOne({ phone });
    if (userExisting) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    // 2. Hash the password
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create new user
    const newUser = new UserModel({
      name,
      phone,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    //genrate token
    const { accessToken, refreshToken } = genrateToken(savedUser._id);
    console.log("Tokens generated:", {
      accessToken: "exists",
      refreshToken: "exists",
    });

    const tokenSet = await SetRefreshToken(savedUser._id, refreshToken);
    if (!tokenSet) {
      console.log("issue with storing token in redis");
    }

    // setting cookies in the client browser
    await setCookies(res, accessToken);

    // 4. Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: savedUser.name,
        phone: savedUser.phone,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { name, userID, phone, address, email } = req.body;

    // 1. Check if user exists
    const checkUser = await UserModel.findById(userID);
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // 2. Update user data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { name, phone, address, email },
      { new: true, runValidators: true }
    );

    // 3. Check if update succeeded
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Could not update user. Try again later.",
      });
    }

    // 4. Respond with success
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error in editUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Try again later.",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1. Find user by phone
    const findUser = await UserModel.findOne({ phone });
    if (!findUser) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    // 3. Generate tokens and store in Redis
    const { accessToken, refreshToken } = genrateToken(findUser._id);

    // Store refresh token in Redis
    const tokenSetRedis = await SetRefreshToken(findUser._id, refreshToken);
    if (!tokenSetRedis) {
      return res.status(500).json({
        success: false,
        message: "Error storing refresh token",
      });
    }

    // Set access token in cookies
    const cookieSet = await setCookies(res, accessToken);
    if (!cookieSet) {
      return res.status(500).json({
        success: false,
        message: "Error setting cookie",
      });
    }

    // 4. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: findUser._id,
        name: findUser.name,
        phone: findUser.phone,
        access: findUser.access,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }

    try {
      console.log("Verifying token...");
      const decoded = jwt.verify(accessToken, process.env.HASHPASSWORD);
      const userID = decoded.userid;

      res.clearCookie("accesstoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      const deleted = await client.del(`refresh:${userID}`);
      console.log("Redis deletion result:", deleted);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);

      res.clearCookie("accesstoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.status(401).json({
        success: false,
        message:
          tokenError.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token",
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserCookies = async (req, res) => {
  try {
    const getUser = getAccessToken(req);
    const data = jwt.verify(getUser, process.env.HASHPASSWORD);
   
    const updatedUser = await UserModel.findOne({ _id: data.userid });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        email: updatedUser.email,
        access:updatedUser.access,
        cart:updatedUser.cart
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  Login,
  editUser,
  RegisterUser,
  logout,
  refreshToken,
  getUserCookies,
};
