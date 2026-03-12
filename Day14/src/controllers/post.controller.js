const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");
const mongoose = require("mongoose");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});


// CREATE POST
async function createPostController(req, res) {
  try {

    const userId = req.user.id;

    // File check
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    // Upload image to ImageKit
    const uploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
      folder: "Posts"
    });

    // Save post
    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: uploadedFile.url,
      user: userId
    });

    return res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}



// GET ALL POSTS OF LOGGED IN USER
async function getPostControllers(req, res) {
  try {

    const userId = req.user.id;

    const posts = await postModel.find({ user: userId });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}



// GET POST DETAILS
async function getPostDetails(req, res) {
  try {

    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const isValidUser = post.user.toString() === userId;

    if (!isValidUser) {
      return res.status(403).json({
        message: "You are not authorized to view this post"
      });
    }

    return res.status(200).json({
      message: "Post details fetched successfully",
      post
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}

async function likePostController(req, res) {
  try {

    const username = req.user.username;
    const postId = req.params.postId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post id"
      });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const alreadyLiked = await likeModel.findOne({
      post: postId,
      user: username
    });

    if (alreadyLiked) {
      return res.status(400).json({
        message: "You already liked this post"
      });
    }

    const like = await likeModel.create({
      post: postId,
      user: username
    });

    res.status(200).json({
      message: "Post liked successfully",
      like
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}
module.exports = {
  createPostController,
  getPostControllers,
  getPostDetails,
  likePostController
};