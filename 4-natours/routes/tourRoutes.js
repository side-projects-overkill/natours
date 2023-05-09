const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  topTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const {
  protect,
  restrictTo,
} = require('../controllers/authenticationController');

const router = express.Router();

// Alias route
router.route('/top-5-cheap').get(topTours, getAllTours);

// Stats route
router.route('/tour-stats').get(getTourStats);

// Monthly plan
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
