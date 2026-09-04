import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type Holding = {
  ticker: string;
  name: string;
  category: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  note?: string;
};

type HoldingCardProps = {
  holding: Holding;
};

export function HoldingCard({ holding }: HoldingCardProps) {
  const invested = holding.shares * holding.avgCost;
  const marketValue =
    holding.currentPrice > 0 ? holding.shares * holding.currentPrice : 0;
  const gain = marketValue - invested;
  const gainText =
    holding.currentPrice > 0
      ? `${gain >= 0 ? "+" : ""}$${gain.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "N/A";
  const gainColor = gain >= 0 ? "#22C55E" : "#F87171";
  const priceText =
    holding.currentPrice > 0 ? `$${holding.currentPrice.toFixed(2)}` : "N/A";

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.ticker}>{holding.ticker}</ThemedText>
        <ThemedText style={[styles.gain, { color: gainColor }]}>
          {gainText}
        </ThemedText>
      </View>
      <ThemedText style={styles.name}>{holding.name}</ThemedText>
      <View style={styles.row}>
        <ThemedText style={styles.label}>{holding.category}</ThemedText>
        <ThemedText style={styles.label}>Shares: {holding.shares}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText
          style={styles.small}
        >{`Avg: $${holding.avgCost.toFixed(2)}`}</ThemedText>
        <ThemedText style={styles.small}>{`Price: ${priceText}`}</ThemedText>
      </View>
      {holding.note ? (
        <ThemedText style={styles.note}>{holding.note}</ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    backgroundColor: "#0F172A",
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ticker: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  gain: {
    fontSize: 14,
    fontWeight: "700",
  },
  name: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 8,
  },
  label: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  small: {
    color: "#94A3B8",
    fontSize: 12,
  },
  note: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 6,
  },
});
