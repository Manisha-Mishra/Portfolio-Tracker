import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type StatItem = {
  title: string;
  value: string;
  borderColor?: string;
};

type PortfolioStatsProps = {
  stats: StatItem[];
};

export function PortfolioStats({ stats }: PortfolioStatsProps) {
  return (
    <ThemedView style={styles.statsContainer}>
      {stats.map((item) => (
        <ThemedView
          key={item.title}
          style={[
            styles.statCard,
            { borderColor: item.borderColor ?? "#1E293B" },
          ]}
        >
          <ThemedText style={styles.statTitle}>
            {item.title.toUpperCase()}
          </ThemedText>
          <ThemedText style={styles.statValue}>{item.value}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
    marginHorizontal: -3,
  },
  statCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: "#0F172A",
    margin: 3,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
});
