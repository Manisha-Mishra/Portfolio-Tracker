import React from "react";
import { FlatList, StyleSheet } from "react-native";

import { FundItem } from "@/components/portfolio/fund-item";
import { Fund } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type SearchResultsProps = {
  query: string;
  results: Fund[];
  onAddFund: (fund: Fund) => void;
};

export function SearchResults({
  query,
  results,
  onAddFund,
}: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <ThemedView style={styles.emptyState}>
        <ThemedText>
          Search for a fund or asset to add to your portfolio.
        </ThemedText>
      </ThemedView>
    );
  }

  if (results.length === 0) {
    return (
      <ThemedView style={styles.emptyState}>
        <ThemedText>No funds match "{query}".</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.ticker}
      renderItem={({ item }) => <FundItem fund={item} onAdd={onAddFund} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 12,
  },
  emptyState: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
  },
});
