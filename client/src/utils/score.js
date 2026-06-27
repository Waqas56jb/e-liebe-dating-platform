// Real compatibility signal: how many interests two people actually share.
// No fabricated scores — derived purely from the signed-in user's interests
// and the candidate's interests (both come from Supabase).
export function sharedInterests(mine = [], theirs = []) {
  if (!mine.length || !theirs.length) return 0;
  const set = new Set(mine);
  return theirs.filter((slug) => set.has(slug)).length;
}
