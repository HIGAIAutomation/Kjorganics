const express = require("express");
const UserModel = require("../model/User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const {client}=require("../config/redisconfig")


const genrateToken=(userid)=>{
  const accessToken=jwt.sign({userid},process.env.HASHPASSWORD,{
    expiresIn:"15m"
  });

  const refreshToken=jwt.sign({userid},process.env.HASHPASSWORD,{
    expiresIn:"7d"
  });

  return {accessToken, refreshToken};

}

const SetAccessToken = async (userID, accessToken) => {
  await client.set(`access:${userID}`, accessToken, { ex: 900 }); // 15 minutes TTL
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
      const {accessToken,refreshToken}=genrateToken(savedUser._id);
      console.log(accessToken,refreshToken);

      SetAccessToken(savedUser._id,accessToken);

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
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports={Login,editUser,RegisterUser};