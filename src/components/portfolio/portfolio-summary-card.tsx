import AntDesign from "@expo/vector-icons/AntDesign";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FontSizes, Radii, Spacing } from "@/constants/theme";

type SummaryMetric = {
  label: string;
  value: string;
  color?: string;
};

type PortfolioSummaryCardProps = {
  title?: string;
  mainValue: string;
  metricA: SummaryMetric;
  metricB: SummaryMetric;
  headerRight?: ReactNode;
  showValues?: boolean;
  onToggleVisibility?: () => void;
};

export function PortfolioSummaryCard({
  title = "Portfolio Summary",
  mainValue,
  metricA,
  metricB,
  headerRight,
  showValues = true,
  onToggleVisibility,
}: PortfolioSummaryCardProps) {
  const maskedMainValue = showValues ? mainValue : "••••••";
  const maskedMetricA = showValues ? metricA.value : "••••";
  const maskedMetricB = showValues ? metricB.value : "••••";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.heading}>{title}</ThemedText>
        <View style={styles.headerActions}>
          {/* {headerRight ? (
            <View style={styles.headerRight}>{headerRight}</View>
          ) : null} */}
          {onToggleVisibility ? (
            <Pressable
              onPress={onToggleVisibility}
              style={styles.visibilityToggle}
              accessibilityRole="button"
              accessibilityLabel={
                showValues ? "Hide portfolio values" : "Show portfolio values"
              }
            >
              <AntDesign
                name={showValues ? "eye" : "eye-invisible"}
                size={16}
                color="#CBD5E1"
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ThemedText style={styles.amount}>{maskedMainValue}</ThemedText>

      <View style={styles.statsRow}>
        <View style={[styles.statItem, styles.statItemGap]}>
          <ThemedText style={styles.statLabel}>{metricA.label}</ThemedText>
          <ThemedText
            style={[
              styles.statValue,
              metricA.color ? { color: metricA.color } : null,
            ]}
          >
            {maskedMetricA}
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>{metricB.label}</ThemedText>
          <ThemedText
            style={[
              styles.statValue,
              metricB.color ? { color: metricB.color } : null,
            ]}
          >
            {maskedMetricB}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.large,
    padding: Spacing.two,
    marginBottom: Spacing.oneAndHalf,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    color: "#94A3B8",
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  visibilityToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0A121E",
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    color: "#F8FAFC",
    fontSize: FontSizes.xxl,
    fontWeight: "800",
    marginBottom: Spacing.three,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
  },
  statItemGap: {
    marginRight: Spacing.four,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: FontSizes.xs,
    marginBottom: Spacing.one,
  },
  statValue: {
    color: "#F8FAFC",
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
});
