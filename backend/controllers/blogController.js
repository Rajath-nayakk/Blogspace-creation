const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { processUploadedFile } = require('../middleware/uploadMiddleware');

// @desc    Get all published blogs (with search, category filter, sort, pagination)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const { search, category, sort, tag } = req.query;

    const query = { status: 'published' };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Search filter (title, description, content)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default latest
    if (sort === 'popular') {
      // Sort by likes array length or views
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name username avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Also get comment count for each post
    const blogsWithStats = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
          ...blog.toObject(),
          commentCount,
          likesCount: blog.likes ? blog.likes.length : 0,
        };
      })
    );

    res.json({
      success: true,
      count: blogsWithStats.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      blogs: blogsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:slug
// @access  Public (optional auth for isLiked)
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Check if slug is Mongo ObjectId or string slug
    let query = { slug };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const blog = await Blog.findOne(query).populate('author', 'name username avatar bio createdAt');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Increment views asynchronously
    blog.views = (blog.views || 0) + 1;
    await blog.save({ validateBeforeSave: false });

    // Check comment count
    const commentCount = await Comment.countDocuments({ blog: blog._id });

    // Check if current user liked this post
    let isLiked = false;
    if (req.user && blog.likes) {
      isLiked = blog.likes.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
    }

    // Get related articles (same category, excluding current post)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      status: 'published',
    })
      .populate('author', 'name username avatar')
      .select('title slug coverImage category readTime createdAt')
      .limit(3);

    res.json({
      success: true,
      blog: {
        ...blog.toObject(),
        commentCount,
        likesCount: blog.likes ? blog.likes.length : 0,
        isLiked,
      },
      relatedBlogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res, next) => {
  try {
    const { title, description, content, category, tags, status, coverImage } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, content, and category',
      });
    }

    let finalCoverImage = coverImage;
    if (req.file) {
      finalCoverImage = await processUploadedFile(req, req.file);
    }

    // Parse tags if sent as comma-separated or JSON string
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const blog = new Blog({
      title: title.trim(),
      description: description.trim(),
      content,
      category,
      tags: parsedTags,
      status: status || 'published',
      coverImage: finalCoverImage || undefined,
      author: req.user._id,
    });

    const savedBlog = await blog.save();
    await savedBlog.populate('author', 'name username avatar bio');

    res.status(201).json({
      success: true,
      message: savedBlog.status === 'draft' ? 'Draft saved successfully' : 'Blog published successfully',
      blog: savedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this blog post',
      });
    }

    const { title, description, content, category, tags, status, coverImage } = req.body;

    if (title) blog.title = title.trim();
    if (description) blog.description = description.trim();
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (status) blog.status = status;

    if (req.file) {
      blog.coverImage = await processUploadedFile(req, req.file);
    } else if (coverImage) {
      blog.coverImage = coverImage;
    }

    if (typeof tags !== 'undefined') {
      if (Array.isArray(tags)) {
        blog.tags = tags;
      } else if (typeof tags === 'string') {
        try {
          blog.tags = JSON.parse(tags);
        } catch (e) {
          blog.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    const updatedBlog = await blog.save();
    await updatedBlog.populate('author', 'name username avatar bio');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this blog post',
      });
    }

    // Delete all comments associated with this blog
    await Comment.deleteMany({ blog: blog._id });

    // Delete blog
    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog post and related comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own posts (both published and draft)
// @route   GET /api/blogs/my-posts
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { author: req.user._id };

    if (status && ['published', 'draft'].includes(status)) {
      query.status = status;
    }

    const posts = await Blog.find(query).sort({ updatedAt: -1 });

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ blog: post._id });
        return {
          ...post.toObject(),
          commentCount,
          likesCount: post.likes ? post.likes.length : 0,
        };
      })
    );

    res.json({
      success: true,
      count: postsWithCounts.length,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on blog post
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLikeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const userId = req.user._id.toString();
    const isLiked = blog.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      // Remove like
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Add like
      blog.likes.push(req.user._id);
    }

    await blog.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: blog.likes.length,
      message: isLiked ? 'Post unliked' : 'Post liked',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
const getTrendingBlogs = async (req, res, next) => {
  try {
    const trending = await Blog.find({ status: 'published' })
      .populate('author', 'name username avatar')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(6);

    const result = await Promise.all(
      trending.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
          ...blog.toObject(),
          commentCount,
          likesCount: blog.likes ? blog.likes.length : 0,
        };
      })
    );

    res.json({
      success: true,
      blogs: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
const getFeaturedBlogs = async (req, res, next) => {
  try {
    // Top 3 posts by views and likes
    const featured = await Blog.find({ status: 'published' })
      .populate('author', 'name username avatar bio')
      .sort({ createdAt: -1 })
      .limit(4);

    const result = await Promise.all(
      featured.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
          ...blog.toObject(),
          commentCount,
          likesCount: blog.likes ? blog.likes.length : 0,
        };
      })
    );

    res.json({
      success: true,
      blogs: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/blogs/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const authorId = req.user._id;

    const publishedCount = await Blog.countDocuments({ author: authorId, status: 'published' });
    const draftCount = await Blog.countDocuments({ author: authorId, status: 'draft' });

    // Get all user posts to aggregate likes & comments
    const userPosts = await Blog.find({ author: authorId });
    const postIds = userPosts.map((p) => p._id);

    const totalLikesReceived = userPosts.reduce((acc, curr) => acc + (curr.likes ? curr.likes.length : 0), 0);
    const totalCommentsReceived = await Comment.countDocuments({ blog: { $in: postIds } });

    // Recent posts
    const recentPosts = await Blog.find({ author: authorId })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalPublished: publishedCount,
        totalDrafts: draftCount,
        totalLikes: totalLikesReceived,
        totalComments: totalCommentsReceived,
      },
      recentPosts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyPosts,
  toggleLikeBlog,
  getTrendingBlogs,
  getFeaturedBlogs,
  getDashboardStats,
};

