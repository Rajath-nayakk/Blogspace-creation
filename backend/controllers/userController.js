const User = require('../models/User');
const Blog = require('../models/Blog');
const { processUploadedFile } = require('../middleware/uploadMiddleware');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const postCount = await Blog.countDocuments({ author: user._id, status: 'published' });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        postCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, bio, avatar } = req.body;

    if (name) user.name = name.trim();
    if (typeof bio !== 'undefined') user.bio = bio.trim();

    // If an avatar file was uploaded via multipart/form-data
    if (req.file) {
      const avatarUrl = await processUploadedFile(req, req.file);
      user.avatar = avatarUrl;
    } else if (avatar) {
      user.avatar = avatar.trim();
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/users/:id/posts
// @access  Public
const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { author: req.params.id, status: 'published' };

    const total = await Blog.countDocuments(query);
    const posts = await Blog.find(query)
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular authors
// @route   GET /api/users/popular-authors
// @access  Public
const getPopularAuthors = async (req, res, next) => {
  try {
    // Find authors with the highest published blog counts
    const topAuthors = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$author', count: { $sum: 1 }, totalLikes: { $sum: { $size: '$likes' } } } },
      { $sort: { count: -1, totalLikes: -1 } },
      { $limit: 6 },
    ]);

    const authorIds = topAuthors.map((a) => a._id);
    const users = await User.find({ _id: { $in: authorIds } }).select('name username avatar bio');

    const result = users.map((user) => {
      const stats = topAuthors.find((a) => a._id.toString() === user._id.toString());
      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        postCount: stats ? stats.count : 0,
        totalLikes: stats ? stats.totalLikes : 0,
      };
    });

    res.json({
      success: true,
      authors: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateProfile,
  getUserPosts,
  getPopularAuthors,
};

