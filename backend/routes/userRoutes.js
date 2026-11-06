const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  getUserPosts,
  getPopularAuthors,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/popular-authors', getPopularAuthors);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

module.exports = router;

