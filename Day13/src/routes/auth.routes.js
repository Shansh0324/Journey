const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
const authRouter = express.Router();
const crypto = require("crypto");
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
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const user = await userModel.create({
    email,
    password: hash,
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


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;

  // Find user by email
  const user = await userModel.findOne({email});

  if(!user){
    return res.status(404).json({
      message : "User not found",
    })
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if(user.password !== hash){
    return res.status(401).json({
      message : "Invalid credentials",
    })
  }

  const token = jwt.sign({
    id : user._id,
  },process.env.JWT_SECRET)

  res.cookie("jwt_token", token);

  res.json({
    message : "Login successful",
    user,
    token,
  })

})

module.exports = authRouter;
