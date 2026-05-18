import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export default function HeaderSection() {
  return (
    <ThemedView style={styles.heroSection}>
      <Image style={styles.image} source={require('@/assets/images/portfolio-logo.png')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});
