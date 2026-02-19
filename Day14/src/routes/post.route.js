const express = require('express');
const postRouter = express.Router();
const postController = require("../controllers/post.controller")
const multer = require("multer");

const upload = multer({
    storage : multer.memoryStorage()
})
/**
 * POST /api/posts
 * Create a new post
 * Request body: { caption: String, imgUrl: String }
 * Response: { message: String, post: Object }
 * Errors:
 * - 400 Bad Request: Missing caption or imgUrl
 * - 401 Unauthorized: User not authenticated
 * - 500 Internal Server
 */

postRouter.post("/",upload.single("image") ,postController.createPostController);

module.exports = postRouter;