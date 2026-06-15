const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    authorName: { type: String, default: '' },
    authorRole: { type: String, default: '' },
    authorImage: { type: String, default: '' },
    tag: { type: String, default: 'TECHNOLOGY' },
    readTime: { type: String, default: '5 min read' },
    date: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.virtual('id').get(function () { return this._id.toString(); });
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = model('Blog', blogSchema);
