const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
const getCommentsByBlogId = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a blog
// @route   POST /api/comments/:blogId
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty',
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      blog: blogId,
    });

    await comment.populate('author', 'name username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty',
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Only the author can edit the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are only allowed to edit your own comment',
      });
    }

    comment.content = content.trim();
    await comment.save();
    await comment.populate('author', 'name username avatar');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Find the blog to check if user is the blog owner
    const blog = await Blog.findById(comment.blog);

    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isBlogAuthor = blog && blog.author.toString() === req.user._id.toString();

    // Author of comment OR owner of blog can delete the comment
    if (!isCommentAuthor && !isBlogAuthor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      commentId: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByBlogId,
  createComment,
  updateComment,
  deleteComment,
};

