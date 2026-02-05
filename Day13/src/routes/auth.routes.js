const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post("/register", async (req, res) => {
  // Destructure the request body to get user details
  const { email, name, password } = req.body;

  const isUserAlreadyExits = await userModel.findOne({ email });

  if (isUserAlreadyExits) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    // { expiresIn: "1h" },
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
});

module.exports = authRouter;
