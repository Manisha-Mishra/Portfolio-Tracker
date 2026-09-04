import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

import { ThemedView } from "@/components/themed-view";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search your investments...",
}: SearchBarProps) {
  return (
    <ThemedView style={styles.wrapper}>
      <AntDesign name="search" size={18} color="#94A3B8" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search text"
        >
          <AntDesign name="close" size={16} color="#94A3B8" />
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: "#94A3B8",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    marginBottom: 12,
  },
  input: {
    color: "#F8FAFC",
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  clearButton: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
