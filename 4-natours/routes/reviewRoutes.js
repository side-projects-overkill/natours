const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController');
const {
  protect,
  restrictTo,
} = require('../controllers/authenticationController');

// Merge params
// POST /tour/23ab4c/review
const router = express.Router({
  mergeParams: true,
});

// Middleware runs in sequence (not sure though)
router.use(protect);
// All of the middleware would have protect automatically

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
