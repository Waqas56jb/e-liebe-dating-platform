import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

// Animated page indicator: the active dot stretches into an elegant pill.
export default function Paginator({ data, scrollX, width }) {
  return (
    <View style={styles.row}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 28, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
});
