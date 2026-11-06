const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/blogController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { upload, processUploadedFile } = require('../middleware/uploadMiddleware');

// Dedicated image upload route
router.post('/upload-image', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const imageUrl = await processUploadedFile(req, req.file);
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    next(error);
  }
});

// Stats & lists
router.get('/trending', getTrendingBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/my-posts', protect, getMyPosts);
router.get('/stats/dashboard', protect, getDashboardStats);

// Main blog routes
router.route('/')
  .get(getBlogs)
  .post(protect, upload.single('coverImage'), createBlog);

router.route('/:id')
  .put(protect, upload.single('coverImage'), updateBlog)
  .delete(protect, deleteBlog);

router.post('/:id/like', protect, toggleLikeBlog);

// Single blog by slug/id (keep at bottom to avoid intercepting '/trending' etc.)
router.get('/:slug', optionalAuth, getBlogBySlug);

module.exports = router;

