import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '../themed-text';

import { useRouter } from 'expo-router';

type HeaderAction = {
  title: string;
  icon: React.ReactNode;
  route?: '/add';
  bgColor: string;
  text: string;
};

const actions: HeaderAction[] = [
  {
    title: 'Add Funds',
    icon: <AntDesign name="plus" size={16} color="#0762d1" />,
    route: '/add',
    bgColor: '#60A5FA',
    text: '#0762d1',
  },
  {
    title: 'Notes',
    icon: <AntDesign name="money-collect" size={16} color="#7875c2" />,
    route: undefined,
    bgColor: '#312E81',
    text: '#7875c2',
  },
  {
    title: 'Analysis',
    icon: <AntDesign name="bar-chart" size={16} color="#fff" />,
    route: undefined,
    bgColor: '#0F172A',
    text: '#fff',
  },
];

export default function HeaderButtonSection() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => action.route ? router.push(action.route) : undefined}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: action.bgColor, opacity: pressed ? 0.7 : 1 },
            ]}
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
    flexDirection:'row',
    alignItems:'center',
    marginBottom: 8,
    minHeight: 56,
    // backgroundColor: '#020817',
    // paddingVertical: 6,
  },

  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',

    height:40,
    // width:40,
    // paddingVertical: 10,
    paddingHorizontal: Spacing.three,

    borderRadius: 16,
    marginRight: 10,

    // shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
