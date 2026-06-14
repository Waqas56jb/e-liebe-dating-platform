import { useWindowDimensions } from 'react-native';

// Responsive helper: scales sizes against a 390pt reference width (iPhone 14),
// clamps for small phones and large tablets so layouts stay elegant everywhere.
const GUIDELINE_WIDTH = 390;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const shortest = Math.min(width, height);

  const scale = (size) => {
    const factor = shortest / GUIDELINE_WIDTH;
    const clamped = Math.max(0.85, Math.min(factor, 1.35));
    return Math.round(size * clamped);
  };

  return {
    width,
    height,
    isSmall: shortest < 360,
    isTablet: shortest >= 600,
    scale,
    wp: (pct) => (width * pct) / 100,
    hp: (pct) => (height * pct) / 100,
  };
}
