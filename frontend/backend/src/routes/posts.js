import express from "express";
import authMiddleware from '../middleware/auth.js';
import Post from '../models/Post.js';

// GET /api/posts — Public, paginated
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || '';

        const query = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-content'); // Exclude full content from list

        res.status(200).json({
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Get posts error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/posts/:id — Public, single post with full content
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email createdAt');
        if (!post) return res.status(404).json({ message: 'Post not found.' });
        res.status(200).json(post);
    } catch (err) {
        console.error('Get post error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/posts — Auth required
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, coverImage } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required.' });
        }

        const post = new Post({
            title,
            content,
            coverImage: coverImage || null,
            author: req.user.id,
        });

        await post.save();
        await post.populate('author', 'name email');

        res.status(201).json({ message: 'Post created successfully.', post });
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/posts/:id — Auth required, owner only
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this post.' });
        }

        const { title, content, coverImage } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (coverImage !== undefined) post.coverImage = coverImage;

        await post.save();
        await post.populate('author', 'name email');

        res.status(200).json({ message: 'Post updated successfully.', post });
    } catch (err) {
        console.error('Update post error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/posts/:id — Auth required, owner only
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;
