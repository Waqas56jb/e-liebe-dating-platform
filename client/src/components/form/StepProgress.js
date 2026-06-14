import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

// Slim animated progress bar for the wizard (step N of total).
export default function StepProgress({ step, total }) {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? (step + 1) / total : 0;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [pct, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.rose,
  },
});
