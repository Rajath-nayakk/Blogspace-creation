const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
  toggleBookmark,
  getBookmarks,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Bookmark routes
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:blogId', protect, toggleBookmark);

module.exports = router;
