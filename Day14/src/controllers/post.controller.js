const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
});

// CREATE POST
async function createPostController(req, res) {
  try {
    //  Token check
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //  File check
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image
    const uploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
      folder: "Posts", 
    });

    //  Save in DB
    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: uploadedFile.url,
      user: decoded.id,
    });

    //  Response
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getPostControllers(req, res){
  const token = req.cookies.token;

    if(!token){
    return res.status(401).json({
      message : "User not authenticated"
    })
  }

  let decoded = null;
  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.id;

  const posts = await postModel.find({user : userId})
  res.status(200).json({
    message : "Posts fetched successfully",
    posts
  })

}

async function getPostDetails(req, res) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "User not authenticated"
    });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }

  const userId = decoded.id;
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

  res.status(200).json({
    message: "Post details fetched successfully",
    post
  });

}

module.exports = {
  createPostController,
  getPostControllers,
  getPostDetails
};
