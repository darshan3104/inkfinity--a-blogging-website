import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        coverImage: {
            type: String, // base64 or URL
            default: null,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        excerpt: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Auto-generate excerpt from content (strip HTML)
postSchema.pre('save', function (next) {
    if (this.content) {
        const stripped = this.content.replace(/<[^>]+>/g, '');
        this.excerpt = stripped.substring(0, 160) + (stripped.length > 160 ? '...' : '');
    }
    next();
});

export default mongoose.model('Post', postSchema);
