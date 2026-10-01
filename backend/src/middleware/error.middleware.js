function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;

  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({
      message: status === 500 ? 'Internal server error' : error.message,
    });
  }

  return res.status(status).render('pages/error', {
    pageTitle: 'Something went wrong',
    status,
    message: status === 500 ? 'Internal server error' : error.message,
  });
}

module.exports = { notFound, errorHandler };
