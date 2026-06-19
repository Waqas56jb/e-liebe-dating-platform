// Centralized error + 404 handlers.
function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  // Surface Supabase/PostgREST error shape when present
  const message = err.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'test') {
    console.error('[error]', status, message, err.details || '');
  }
  res.status(status).json({ error: message, details: err.details || undefined });
}

module.exports = { notFound, errorHandler };
