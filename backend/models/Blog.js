const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a short description'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Technology',
        'Programming',
        'Artificial Intelligence',
        'Cybersecurity',
        'Web Development',
        'Startups',
        'Productivity',
        'Lifestyle',
      ],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    readTime: {
      type: Number,
      default: 3,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate read time and slug before validate/save
blogSchema.pre('validate', async function () {
  if (this.title && (!this.slug || this.isModified('title'))) {
    let baseSlug = slugify(this.title);
    if (!baseSlug) baseSlug = 'article';
    let uniqueSlug = baseSlug;
    let count = 1;

    // Check if slug already exists
    while (await mongoose.models.Blog?.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
      count++;
      if (count > 10) break;
    }
    this.slug = uniqueSlug;
  }

  // Calculate read time (avg 200 words per minute)
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
});

module.exports = mongoose.model('Blog', blogSchema);
