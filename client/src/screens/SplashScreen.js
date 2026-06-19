import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, StatusBar, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/common/Logo';
import { useResponsive } from '../hooks/useResponsive';
import { colors, spacing, typography } from '../theme';

const BG = require('../../assets/splash.png');

const TAGLINE = {
  de: 'Wo aus Begegnungen echte Liebe wird.',
  en: 'Where encounters become real love.',
};

export default function SplashScreen({ language = 'de', onDone }) {
  const { scale } = useResponsive();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textRise = useRef(new Animated.Value(16)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
        Animated.timing(logoFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(textRise, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    const pulse = (v, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.3, duration: 450, useNativeDriver: true }),
        ])
      );
    const loop = Animated.parallel([pulse(dot1, 0), pulse(dot2, 150), pulse(dot3, 300)]);
    loop.start();

    const timer = setTimeout(() => onDone?.(), 2600);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(30,10,46,0.35)', 'rgba(30,10,46,0.55)', 'rgba(30,10,46,0.96)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={styles.center}>
        <Animated.View style={{ opacity: logoFade, transform: [{ scale: logoScale }] }}>
          <Logo size={scale(180)} withWordmark />
        </Animated.View>

        <Animated.Text
          style={[styles.tagline, { opacity: textFade, transform: [{ translateY: textRise }] }]}
        >
          {TAGLINE[language] ?? TAGLINE.de}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.footer, { opacity: textFade }]}>
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
        <Text style={styles.madeWith}>Made with ♥ in Deutschland</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: spacing.xl,
    fontStyle: 'italic',
    fontSize: 16,
    maxWidth: 300,
    lineHeight: 24,
  },
  footer: { position: 'absolute', bottom: 56, left: 0, right: 0, alignItems: 'center' },
  dots: { flexDirection: 'row', marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginHorizontal: 4 },
  madeWith: { ...typography.caption, color: 'rgba(255,255,255,0.6)', fontSize: 12 },
});
