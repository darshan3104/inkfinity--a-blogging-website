const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// POST /api/comments — Auth required
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { postId, comment } = req.body;

        if (!postId || !comment) {
            return res.status(400).json({ message: 'Post ID and comment are required.' });
        }

        const newComment = new Comment({
            postId,
            userId: req.user.id,
            comment,
        });

        await newComment.save();
        await newComment.populate('userId', 'name email');

        res.status(201).json({ message: 'Comment added.', comment: newComment });
    } catch (err) {
        console.error('Add comment error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/comments/:postId — Public
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
