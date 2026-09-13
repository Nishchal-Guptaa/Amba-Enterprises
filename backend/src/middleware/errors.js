export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, req, res, _next) {
  const status = Number(error.statusCode || error.status || 500);
  if (status >= 500) {
    console.error(`[API] ${req.method} ${req.path}`, error);
  }
  res.status(status).json({
    error:
      status >= 500 && !error.expose
        ? 'An unexpected server error occurred.'
        : error.message,
    code: error.code,
  });
}

