import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const LOGO = require('../../../assets/logo.png');

// App logo (eLiebe lockup). The artwork is dark-on-light, so on dark screens
// render it inside a white "chip" for legibility (chip).
export default function Logo({ size = 40, chip = false, style }) {
  const img = <Image source={LOGO} style={{ width: size, height: size }} resizeMode="contain" />;
  if (!chip) return <View style={style}>{img}</View>;
  return (
    <View style={[styles.chip, { borderRadius: size * 0.3, padding: size * 0.1 }, style]}>{img}</View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
});
