const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginController(req, res) {
  try {
    const { email, username, password } = req.body;

    // ✅ validation
    if (!password || (!email && !username)) {
      return res.status(400).json({
        message: "Email/Username and password required",
      });
    }

    // ✅ find user
    const user = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // ✅ JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}


 async function registerController(req, res) {
  try {
    const { email, username, password, bio, profileImage } = req.body;

    // ✅ validation
    if (!email || !username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ check existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // 🔥 bcrypt hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
      bio,
      profileImage,
    });

    // ✅ JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // production me true
    });

    // ✅ response (no password!)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
    registerController, 
    loginController
}