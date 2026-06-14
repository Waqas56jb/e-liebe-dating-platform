import React, { useRef, useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileCard from './ProfileCard';
import { colors, radius, typography, spacing } from '../../theme';
import { pick } from '../../utils/i18n';
import { HOME_STRINGS as H } from '../../constants/home';

const { width: SCREEN_W } = Dimensions.get('window');
const THRESHOLD = SCREEN_W * 0.16; // distance needed to commit a swipe
const VELOCITY = 0.3; // a quick flick commits even on a short drag

function Stamp({ label, color, style }) {
  return (
    <Animated.View style={[styles.stamp, { borderColor: color }, style]}>
      <Text style={[styles.stampText, { color }]}>{label}</Text>
    </Animated.View>
  );
}

// Imperative API: ref.swipeLeft() / swipeRight() / swipeUp()
const SwipeDeck = forwardRef(function SwipeDeck(
  { data, language, onSwipeLeft, onSwipeRight, onSwipeUp, onViewProfile, onCycle, onCardChange },
  ref
) {
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  // Report the current top card so the parent can render an ambient backdrop.
  useEffect(() => {
    onCardChange?.(data[index] || null);
  }, [index, data, onCardChange]);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-9deg', '0deg', '9deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = position.x.interpolate({ inputRange: [0, THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const superOpacity = position.y.interpolate({ inputRange: [-THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const nextScale = position.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  const advance = useCallback(() => {
    position.setValue({ x: 0, y: 0 });
    setIndex((i) => {
      const next = i + 1;
      // Loop back to the first profile so the deck never runs dry.
      if (next >= data.length) {
        onCycle?.();
        return 0;
      }
      return next;
    });
  }, [position, data.length, onCycle]);

  const forceSwipe = useCallback(
    (direction, speed = 0) => {
      const card = data[index];
      if (!card) return;
      const to =
        direction === 'up'
          ? { x: 0, y: -SCREEN_W * 1.6 }
          : { x: direction === 'right' ? SCREEN_W * 1.6 : -SCREEN_W * 1.6, y: 0 };
      // Faster exit when the user flicks hard; smooth easing otherwise.
      const duration = Math.max(140, 260 - Math.abs(speed) * 120);
      Animated.timing(position, {
        toValue: to,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        if (direction === 'right') onSwipeRight?.(card);
        else if (direction === 'left') onSwipeLeft?.(card);
        else onSwipeUp?.(card);
        advance();
      });
    },
    [data, index, position, onSwipeRight, onSwipeLeft, onSwipeUp, advance]
  );

  useImperativeHandle(ref, () => ({
    swipeLeft: () => forceSwipe('left'),
    swipeRight: () => forceSwipe('right'),
    swipeUp: () => forceSwipe('up'),
  }));

  const reset = useCallback(() => {
    // Snappy, lively return to centre.
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      tension: 90,
      useNativeDriver: false,
    }).start();
  }, [position]);

  // Always-current handlers so the once-created PanResponder never goes stale.
  const api = useRef({});
  api.current = { data, index, forceSwipe, reset, onViewProfile };

  const panResponder = useRef(
    PanResponder.create({
      // Grab quickly so dragging feels immediate and 1:1 with the finger.
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_, g) => {
        const { data: d, index: i, forceSwipe: swipe, reset: snapBack, onViewProfile: view } = api.current;
        // tap (no real movement) -> open profile
        if (Math.abs(g.dx) < 5 && Math.abs(g.dy) < 5) {
          const card = d[i];
          if (card) view?.(card);
          return;
        }
        const right = g.dx > THRESHOLD || (g.vx > VELOCITY && g.dx > 12);
        const left = g.dx < -THRESHOLD || (g.vx < -VELOCITY && g.dx < -12);
        const up = g.dy < -THRESHOLD || (g.vy < -VELOCITY && g.dy < -12);
        // Horizontal intent wins over vertical for a natural feel.
        if (right && Math.abs(g.dx) >= Math.abs(g.dy)) swipe('right', g.vx);
        else if (left && Math.abs(g.dx) >= Math.abs(g.dy)) swipe('left', g.vx);
        else if (up) swipe('up', g.vy);
        else snapBack();
      },
    })
  ).current;

  if (index >= data.length) {
    return (
      <View style={styles.empty}>
        <Ionicons name="sparkles" size={54} color={colors.rose} />
        <Text style={styles.emptyTitle}>{pick(H.emptyTitle, language)}</Text>
        <Text style={styles.emptySub}>{pick(H.emptySub, language)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.deck}>
      {data
        .map((item, i) => {
          if (i < index || i > index + 1) return null;

          if (i === index) {
            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.cardWrap,
                  { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
                ]}
                {...panResponder.panHandlers}
              >
                <Stamp label="LIKE" color={colors.success} style={[styles.like, { opacity: likeOpacity }]} />
                <Stamp label="NOPE" color={colors.danger} style={[styles.nope, { opacity: nopeOpacity }]} />
                <Stamp label="SUPER" color={colors.star} style={[styles.super, { opacity: superOpacity }]} />
                <ProfileCard profile={item} language={language} onInfo={() => onViewProfile?.(item)} />
              </Animated.View>
            );
          }

          return (
            <Animated.View key={item.id} style={[styles.cardWrap, { transform: [{ scale: nextScale }] }]}>
              <ProfileCard profile={item} language={language} onInfo={() => onViewProfile?.(item)} />
            </Animated.View>
          );
        })
        .reverse()}
    </View>
  );
});

const styles = StyleSheet.create({
  deck: { flex: 1 },
  cardWrap: { ...StyleSheet.absoluteFillObject },
  stamp: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
    borderWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stampText: { fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  like: { left: 24, transform: [{ rotate: '-18deg' }] },
  nope: { right: 24, transform: [{ rotate: '18deg' }] },
  super: { alignSelf: 'center', bottom: 90, top: undefined },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { ...typography.h2, color: colors.white, textAlign: 'center', marginTop: spacing.lg, lineHeight: 32 },
  emptySub: { ...typography.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: spacing.sm },
});

export default SwipeDeck;
