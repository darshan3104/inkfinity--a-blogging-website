import express from "express";
import authMiddleware from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET /api/posts — Public, paginated, with optional auth for liked state
router.get('/', optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || '';
        const sort = req.query.sort || 'latest'; // latest | mostLiked | mostCommented

        const query = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        const total = await Post.countDocuments(query);

        // For mostLiked/mostCommented we use aggregation
        let posts;
        if (sort === 'mostLiked') {
            const agg = await Post.aggregate([
                { $match: query },
                { $addFields: { likeCount: { $size: '$likes' } } },
                { $sort: { likeCount: -1, createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                        pipeline: [{ $project: { name: 1, email: 1 } }],
                    },
                },
                { $unwind: { path: '$author', preserveNullAndEmpty: true } },
                { $project: { content: 0 } },
            ]);
            posts = agg;
        } else if (sort === 'mostCommented') {
            const agg = await Post.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'postId',
                        as: 'commentsArr',
                    },
                },
                { $addFields: { commentCount: { $size: '$commentsArr' }, likeCount: { $size: '$likes' } } },
                { $sort: { commentCount: -1, createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                        pipeline: [{ $project: { name: 1, email: 1 } }],
                    },
                },
                { $unwind: { path: '$author', preserveNullAndEmpty: true } },
                { $project: { content: 0, commentsArr: 0 } },
            ]);
            posts = agg;
        } else {
            const rawPosts = await Post.find(query)
                .populate('author', 'name email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-content')
                .lean();

            // Attach commentCount and likeCount
            const postIds = rawPosts.map((p) => p._id);
            const commentCounts = await Comment.aggregate([
                { $match: { postId: { $in: postIds } } },
                { $group: { _id: '$postId', count: { $sum: 1 } } },
            ]);
            const countMap = {};
            commentCounts.forEach((c) => { countMap[c._id.toString()] = c.count; });

            posts = rawPosts.map((p) => ({
                ...p,
                likeCount: p.likes ? p.likes.length : 0,
                commentCount: countMap[p._id.toString()] || 0,
            }));
        }

        // Attach likedByMe if user is authenticated
        const userId = req.user ? req.user.id : null;
        const postsWithMeta = posts.map((p) => ({
            ...p,
            likedByMe: userId
                ? (p.likes || []).some((l) => l.toString() === userId)
                : false,
        }));

        res.status(200).json({
            posts: postsWithMeta,
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
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email createdAt')
            .lean();
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        const commentCount = await Comment.countDocuments({ postId: post._id });
        const userId = req.user ? req.user.id : null;

        res.status(200).json({
            ...post,
            likeCount: post.likes ? post.likes.length : 0,
            commentCount,
            likedByMe: userId
                ? (post.likes || []).some((l) => l.toString() === userId)
                : false,
        });
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

// POST /api/posts/:id/like — Toggle like, Auth required
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        const userId = req.user.id;
        const alreadyLiked = post.likes.some((l) => l.toString() === userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter((l) => l.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            liked: !alreadyLiked,
            likeCount: post.likes.length,
        });
    } catch (err) {
        console.error('Like post error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;
