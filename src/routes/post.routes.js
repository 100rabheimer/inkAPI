const express = require('express');
const router = express.Router();

const controller = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth');

router.post("/", authenticate, controller.createPost);
router.get("/", controller.getPost);
router.get("/:id", controller.getPostById);
router.post("/:id/comments", authenticate, controller.createComment);
router.post("/:id/like", authenticate, controller.likePost);
router.delete("/:id", authenticate, controller.deletePost);

module.exports = router;