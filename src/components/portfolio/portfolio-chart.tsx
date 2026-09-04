import React from "react";
import { StyleSheet, View } from "react-native";

import { Holding } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type PortfolioChartProps = {
  holdings: Holding[];
};

const colors = ["#60A5FA", "#34D399", "#F59E0B", "#F87171", "#A855F7"];

export function PortfolioChart({ holdings }: PortfolioChartProps) {
  const totalValue = holdings.reduce(
    (sum, holding) => sum + holding.currentPrice * holding.shares,
    0,
  );

  if (!holdings.length) {
    return (
      <ThemedView style={styles.emptyWrapper}>
        <ThemedText style={styles.emptyTitle}>
          Portfolio analysis will appear here.
        </ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Search funds and add positions to see allocation and P/L.
        </ThemedText>
      </ThemedView>
    );
  }

  const sorted = [...holdings].sort(
    (a, b) => b.currentPrice * b.shares - a.currentPrice * a.shares,
  );
  const topHoldings = sorted.slice(0, 4);

  return (
    <ThemedView style={styles.chartCard}>
      <ThemedText style={styles.title}>Portfolio Allocation</ThemedText>
      <View style={styles.barBackground}>
        {topHoldings.map((holding, index) => {
          const value = holding.currentPrice * holding.shares;
          const width = totalValue
            ? `${Math.max(8, (value / totalValue) * 100)}%`
            : "0%";
          return (
            <View key={holding.ticker} style={styles.barRow}>
              <View
                style={[
                  styles.barFill,
                  // { width, backgroundColor: colors[index % colors.length] },
                ]}
              />
              <ThemedText style={styles.barLabel}>{holding.ticker}</ThemedText>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        {topHoldings.map((holding, index) => {
          const value = holding.currentPrice * holding.shares;
          const percent = totalValue ? (value / totalValue) * 100 : 0;
          return (
            <View key={holding.ticker} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors[index % colors.length] },
                ]}
              />
              <ThemedText style={styles.legendText}>
                {holding.ticker} • {percent.toFixed(1)}%
              </ThemedText>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  barBackground: {
    gap: 0,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
    borderRadius: 999,
    backgroundColor: "#111827",
    overflow: "hidden",
    marginBottom: 10,
  },
  barFill: {
    height: "100%",
  },
  barLabel: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "700",
  },
  legendRow: {
    marginTop: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  emptyWrapper: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#94A3B8",
    fontSize: 13,
  },
});
