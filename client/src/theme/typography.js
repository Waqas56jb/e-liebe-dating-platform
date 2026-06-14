// Typography scale. Uses platform system fonts (no custom font binaries needed),
// with weights chosen for an elegant editorial feel.
import { Platform } from 'react-native';

const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
const sans = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fonts = { serif, sans };

export const typography = {
  display: { fontFamily: serif, fontSize: 44, fontWeight: '700', letterSpacing: 0.5 },
  h1: { fontFamily: serif, fontSize: 34, fontWeight: '700', letterSpacing: 0.3 },
  h2: { fontFamily: sans, fontSize: 26, fontWeight: '800' },
  title: { fontFamily: sans, fontSize: 20, fontWeight: '700' },
  body: { fontFamily: sans, fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyStrong: { fontFamily: sans, fontSize: 16, fontWeight: '600', lineHeight: 24 },
  caption: { fontFamily: sans, fontSize: 13, fontWeight: '500', letterSpacing: 0.4 },
  overline: { fontFamily: sans, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  button: { fontFamily: sans, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
};
