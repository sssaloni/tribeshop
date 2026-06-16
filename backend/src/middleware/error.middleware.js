// Global Error Handling Middleware

const errorHandler = (err, req, res, next) => {
  console.error('API Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle specific database errors (e.g. Postgres unique key violations)
  if (err.code === '23505') { // Unique constraint violation
    statusCode = 400;
    message = 'A resource with this identifier already exists.';
  }

  if (err.code === '23503') { // Foreign key constraint violation
    statusCode = 400;
    message = 'Reference integrity violation: related record not found.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
