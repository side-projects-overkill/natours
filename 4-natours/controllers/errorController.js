const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate ${err.keyValue.name} Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el, index) => `${index + 1}) ${el.message}`)
    .join('. ');
  const message = `Found the follow error(s): ${errors}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleTokenExpiredError = () =>
  new AppError('Token expired. Please log in again.', 401);

const sendErrorForDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Show a website on error
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProduction = (err, req, res) => {
  // Operational error, trusted error
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Program error
    // Log error
    console.error(`Error ${new Date()}: ${err}`);
    // Send generic response
    return res.status(500).json({
      status: 'error',
      message: `Something went very wrong`,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorForDev(err, req, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      error = handleDuplicateErrorDB(err);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }

    return sendErrorProduction(error, res);
  }
};
