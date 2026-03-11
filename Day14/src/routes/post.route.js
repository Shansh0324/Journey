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

postRouter.post("/", upload.single("image"), postController.createPostController);

/**
 * GET /api/posts/{protected}
 */

postRouter.get("/",postController.getPostControllers);

/**
 * GET /api/posts/details/:postId
 * returns details of a specific post by ID
 * also check whether the post belonsg to the user that is requesting 
 */

postRouter.get("/details/:postId", postController.getPostDetails);

module.exports = postRouter;