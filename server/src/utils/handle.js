// Unwrap a Supabase { data, error } result; throw a normalized HTTP error.
function unwrap({ data, error }, notFoundMsg) {
  if (error) {
    const e = new Error(error.message || 'Database error');
    // PGRST116 = no rows for .single()
    e.status = error.code === 'PGRST116' ? 404 : 400;
    e.details = error.details || error.hint || error.code;
    throw e;
  }
  if (notFoundMsg && (data === null || (Array.isArray(data) && data.length === 0))) {
    const e = new Error(notFoundMsg);
    e.status = 404;
    throw e;
  }
  return data;
}

module.exports = { unwrap };
