const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: [true, "Username required"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default:
        "https://ik.imagekit.io/tsa6ygozi/gray-picture-person-with-gray-background_1197690-22.avif",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
