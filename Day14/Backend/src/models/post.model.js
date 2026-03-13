const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
      trim: true, // ✅ extra clean data
    },
    imgUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ⚠️ FIX: capital & correct model name
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt auto
  }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
