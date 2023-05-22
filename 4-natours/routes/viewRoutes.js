const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require('../controllers/viewsController');
const {
  protect,
  isLoggedIn,
} = require('../controllers/authenticationController');

const router = express.Router();

router.get('/me', protect, getAccount);

router.use(isLoggedIn);
router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);
router.get('/login', getLoginForm);

module.exports = router;
