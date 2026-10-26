/**
 * Centralized Express Error Handling Middleware.
 * Provides safe, structured JSON responses without leaking stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected internal server error occurred.';
  let errors = null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error. Please verify your input.';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle MongoDB duplicate key errors (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const keyPattern = err.keyPattern || {};

    if (keyPattern.email) {
      message = 'An account with this email address already exists. Please log in instead.';
    } else if (keyPattern.userId && keyPattern.date) {
      message = 'A record already exists for this date. You can edit your existing check-in.';
    } else {
      message = 'Duplicate record detected. Please verify your submission.';
    }
  }

  // Handle invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Requested resource not found or invalid ID provided.';
  }

  // Handle JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  // Handle rate limiter error
  if (err.status === 429) {
    statusCode = 429;
    message = err.message || 'Too many requests. Please slow down and try again later.';
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 Not Found route handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
