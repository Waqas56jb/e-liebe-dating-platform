// Deterministic, stable "compatibility" score per profile (mock).
// Same id always yields the same value in the 78–98 range — no Math.random
// so it doesn't flicker on re-render.
export function matchScore(id = '') {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return 78 + (h % 21); // 78..98
}
