const express = require('express');
const router = express.Router();
const {
  getCommentsByBlogId,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:blogId', getCommentsByBlogId);
router.post('/:blogId', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;

