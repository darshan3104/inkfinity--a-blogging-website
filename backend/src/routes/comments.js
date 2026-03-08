import express from "express";
import Comment from "../models/Comment.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// POST /api/comments — Auth required
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, comment, parentId } = req.body;

    if (!postId || !comment) {
      return res
        .status(400)
        .json({ message: "Post ID and comment are required." });
    }

    const newComment = new Comment({
      postId,
      userId: req.user.id,
      comment,
      parentId: parentId || null,
    });

    await newComment.save();
    await newComment.populate("userId", "name email");

    res.status(201).json({
      message: "Comment added.",
      comment: newComment,
    });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/comments/:postId — Public, returns top-level + replies
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name email")
      .sort({ createdAt: 1 })
      .lean();

    // Nest replies under their parent
    const commentMap = {};
    const roots = [];

    comments.forEach((c) => {
      commentMap[c._id.toString()] = { ...c, replies: [] };
    });

    comments.forEach((c) => {
      if (c.parentId) {
        const parent = commentMap[c.parentId.toString()];
        if (parent) {
          parent.replies.push(commentMap[c._id.toString()]);
        } else {
          roots.push(commentMap[c._id.toString()]);
        }
      } else {
        roots.push(commentMap[c._id.toString()]);
      }
    });

    res.status(200).json(roots);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// DELETE /api/comments/:id — Auth required, owner only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment." });
    }

    // Also delete any replies to this comment
    await Comment.deleteMany({ parentId: comment._id });
    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted." });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;