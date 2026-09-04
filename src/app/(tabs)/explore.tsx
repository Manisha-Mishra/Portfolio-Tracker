import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HoldingCard } from "@/components/portfolio/holding-card";
import { PortfolioChart } from "@/components/portfolio/portfolio-chart";
import { PortfolioSummaryCard } from "@/components/portfolio/portfolio-summary-card";
import { Holding } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontSizes, Radii, Spacing } from "@/constants/theme";
import { usePortfolio } from "@/context/PortfolioStore";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const { holdings, loadHoldings } = usePortfolio();
  const router = useRouter();

  useEffect(() => {
    loadHoldings();
  }, [loadHoldings]);

  const filteredHoldings = holdings;

  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.avgCost,
    0,
  );

  const totalMarketValue = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.currentPrice,
    0,
  );

  const totalGain = totalMarketValue - totalCost;
  const totalReturn = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const renderHolding = ({ item }: { item: Holding }) => (
    <HoldingCard holding={item} />
  );

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* <HeaderSection /> */}

          <View style={styles.topBar}>
            <View>
              <ThemedText type="subtitle">Portfolio</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Track your positions, returns, and allocation.
              </ThemedText>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
              onPress={() => loadHoldings()}
            >
              <AntDesign name="reload" size={18} color="#F8FAFC" />
            </Pressable>
          </View>

          <PortfolioSummaryCard
            mainValue={`₹${totalMarketValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            metricA={{
              label: "Gain / Loss",
              value: `${totalGain >= 0 ? "+" : ""}₹${totalGain.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}`,
              color: totalGain >= 0 ? "#22C55E" : "#F87171",
            }}
            metricB={{
              label: "Return",
              value: `${totalReturn.toFixed(2)}%`,
              color: totalReturn >= 0 ? "#22C55E" : "#F87171",
            }}
          />

          <PortfolioChart holdings={filteredHoldings} />

          <View style={styles.sectionRow}>
            <ThemedText style={styles.sectionTitle}>Holdings</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              {filteredHoldings.length} positions
            </ThemedText>
          </View>

          {filteredHoldings.length > 0 ? (
            <FlatList
              data={filteredHoldings}
              keyExtractor={(item) => item.ticker}
              renderItem={renderHolding}
              scrollEnabled={false}
              contentContainerStyle={styles.holdingsList}
            />
          ) : (
            <ThemedView style={styles.emptyState}>
              <ThemedText>No holdings match your search.</ThemedText>
              <ThemedText themeColor="textSecondary">
                Try a broader filter or add a position.
              </ThemedText>
            </ThemedView>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    // backgroundColor: "#020817",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#020817",
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  topBar: {
    marginTop: Spacing.four,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  subtitle: {
    color: "#94A3B8",
    marginTop: Spacing.one,
    fontSize: FontSizes.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.medium,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  pressed: {
    opacity: 0.7,
  },
  summaryPanel: {
    backgroundColor: "#0F172A",
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: "#1E293B",
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  summaryHeadingRow: {
    marginBottom: Spacing.four,
  },
  summaryHeading: {
    color: "#94A3B8",
    fontSize: FontSizes.sm,
    marginBottom: Spacing.one,
  },
  summaryAmount: {
    color: "#F8FAFC",
    fontSize: FontSizes.xxxl,
    fontWeight: "800",
  },
  summaryStatsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  summaryStatCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: Radii.medium,
    padding: Spacing.three,
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
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: FontSizes.xs,
  },
  holdingsList: {
    gap: Spacing.two,
  },
  emptyState: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.medium,
    padding: Spacing.four,
    alignItems: "center",
  },
});
