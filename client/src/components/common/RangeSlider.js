import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { colors } from '../../theme';

const THUMB = 28;

// Custom slider. Single thumb (dual=false, value/onChange) or
// dual thumb range (dual=true, low/high/onChange(low, high)).
export default function RangeSlider({
  min,
  max,
  step = 1,
  dual = false,
  value,
  low,
  high,
  onChange,
}) {
  const [width, setWidth] = useState(0);
  const start = useRef({ low: 0, high: 0, value: 0 }).current;

  const usable = Math.max(width - THUMB, 1);
  const toX = (v) => ((v - min) / (max - min)) * usable;
  const clampStep = (v, lo, hi) => {
    const stepped = Math.round(v / step) * step;
    return Math.min(Math.max(stepped, lo), hi);
  };

  const makeResponder = (which) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.low = low;
        start.high = high;
        start.value = value;
      },
      onPanResponderMove: (_, g) => {
        if (usable <= 0) return;
        const deltaVal = (g.dx / usable) * (max - min);
        if (!dual) {
          onChange(clampStep(start.value + deltaVal, min, max));
          return;
        }
        if (which === 'low') {
          onChange(clampStep(start.low + deltaVal, min, high - step), high);
        } else {
          onChange(low, clampStep(start.high + deltaVal, low + step, max));
        }
      },
    });

  const lowPR = useRef(makeResponder('low'));
  const highPR = useRef(makeResponder('high'));
  const singlePR = useRef(makeResponder('single'));
  // refresh closures each render so they read latest props
  lowPR.current = makeResponder('low');
  highPR.current = makeResponder('high');
  singlePR.current = makeResponder('single');

  const onLayout = useCallback((e) => setWidth(e.nativeEvent.layout.width), []);

  const fillLeft = dual ? toX(low) + THUMB / 2 : 0;
  const fillRight = dual ? toX(high) + THUMB / 2 : toX(value) + THUMB / 2;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={styles.track} />
      <View style={[styles.fill, { left: fillLeft, width: Math.max(fillRight - fillLeft, 0) }]} />

      {dual ? (
        <>
          <View style={[styles.thumb, { left: toX(low) }]} {...lowPR.current.panHandlers} />
          <View style={[styles.thumb, { left: toX(high) }]} {...highPR.current.panHandlers} />
        </>
      ) : (
        <View style={[styles.thumb, { left: toX(value) }]} {...singlePR.current.panHandlers} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: THUMB + 12, justifyContent: 'center' },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: THUMB / 2,
  },
  fill: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.rose,
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.rose,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
