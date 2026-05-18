import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '../themed-text';

const actions = [
  {
    title: 'Add Funds',
    icon: <AntDesign name="plus" size={22} color="#000" />,
    onPress: () => undefined,
    bgColor: '#60A5FA',
    text: '#000',
  },
  {
    title: 'Notes',
    icon: <AntDesign name="money-collect" size={22} color="#fff" />,
    onPress: () => undefined,
    bgColor: '#312E81',
    text: '#fff',
  },
  {
    title: 'Analysis',
    icon: <AntDesign name="bar-chart" size={22} color="#fff" />,
    onPress: () => undefined,
    bgColor: '#0F172A',
    text: '#fff',
  },
];

export default function HeaderButtonSection() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {actions.map((action) => (
          <Pressable
            key={action.title}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            style={[styles.button, { backgroundColor: action.bgColor }]}
          >
            {action.icon}
            <ThemedText style={[styles.label, { color: action.text }]}> 
              {action.title}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginTop: 12,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  button: {
    minWidth: 132,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 2,
  },
  label: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
  },
});
