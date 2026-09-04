import AntDesign from "@expo/vector-icons/AntDesign";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderSection from "@/components/headerSection/header";
import HeaderButtonSection from "@/components/headerSection/header-button-section";
import { HoldingCard } from "@/components/portfolio/holding-card";
import { PortfolioSummaryCard } from "@/components/portfolio/portfolio-summary-card";
import { SearchBar } from "@/components/portfolio/search-bar";
import { Holding } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontSizes, Radii, Spacing } from "@/constants/theme";
import { usePortfolio } from "@/context/PortfolioStore";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

const categories = [
  "All",
  "Stocks",
  "Crypto",
  "Options",
  "Mutual Funds",
  "ETFs",
];

const defaultHoldings: Holding[] = [];

export default function HomeScreen() {
  const { holdings, loadHoldings } = usePortfolio();
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statsExpanded, setStatsExpanded] = useState(true);
  const [showPortfolioValues, setShowPortfolioValues] = useState(true);
  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    loadHoldings();
  }, [loadHoldings]);

  useEffect(() => {
    if (holdings.length > 0) {
      setStatsExpanded(true);
    }
  }, [holdings.length]);

  const filteredHoldings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return holdings.filter((holding) => {
      const matchesTab = activeTab === "All" || holding.category === activeTab;
      const matchesSearch =
        !query ||
        holding.ticker.toLowerCase().includes(query) ||
        holding.name.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, holdings, searchQuery]);

  const stats = useMemo(() => {
    const invested = holdings.reduce(
      (sum, holding) => sum + holding.shares * holding.avgCost,
      0,
    );
    const market = holdings.reduce(
      (sum, holding) => sum + holding.shares * holding.currentPrice,
      0,
    );
    const profit = market - invested;
    const pct = invested > 0 ? (profit / invested) * 100 : 0;

    return [
      {
        title: "Total Portfolio Value",
        value: `$${market.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        title: "Total Invested",
        value: `$${invested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        title: "Total Profit",
        value: `${profit >= 0 ? "+" : ""}$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        borderColor: profit >= 0 ? "#22C55E" : "#F87171",
      },
      { title: "Profit %", value: `${pct.toFixed(2)}%` },
      { title: "Active Positions", value: `${holdings.length}` },
    ];
  }, [holdings]);

  const portfolioSummary = useMemo(() => {
    const invested = holdings.reduce(
      (sum, holding) => sum + holding.shares * holding.avgCost,
      0,
    );
    const market = holdings.reduce(
      (sum, holding) => sum + holding.shares * holding.currentPrice,
      0,
    );
    const profit = market - invested;
    const pct = invested > 0 ? (profit / invested) * 100 : 0;

    return {
      marketLabel: `$${market.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gainLabel: `${profit >= 0 ? "+" : ""}$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      percentLabel: `${profit >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
      gainColor: profit >= 0 ? "#22C55E" : "#F87171",
    };
  }, [holdings]);

  const statusText = searchQuery
    ? `${filteredHoldings.length} result${filteredHoldings.length === 1 ? "" : "s"}`
    : `Showing ${filteredHoldings.length} holding${filteredHoldings.length === 1 ? "" : "s"}`;

  const totalPortfolioValue = portfolioSummary.marketLabel;

  const listHeaderComponent = () => (
    <>
      <HeaderSection />
      <HeaderButtonSection />

      <PortfolioSummaryCard
        mainValue={totalPortfolioValue}
        metricA={{
          label: "Gain",
          value: portfolioSummary.gainLabel,
          color: portfolioSummary.gainColor,
        }}
        metricB={{
          label: "Return",
          value: portfolioSummary.percentLabel,
          color: portfolioSummary.gainColor,
        }}
        showValues={showPortfolioValues}
        onToggleVisibility={() => setShowPortfolioValues((prev) => !prev)}
        headerRight={
          <Pressable
            style={({ pressed }) => [
              styles.summaryToggle,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setStatsExpanded((prev) => !prev)}
          >
            <AntDesign
              name={statsExpanded ? "up" : "down"}
              size={18}
              color="#CBD5E1"
            />
          </Pressable>
        }
      />

      {/* {statsExpanded && (
        <View style={styles.statsPanel}>
          <PortfolioStats stats={stats} />
        </View>
      )} */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tabButton,
              category === activeTab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(category)}
          >
            <ThemedText
              style={[
                styles.tabText,
                category === activeTab && styles.activeTabText,
              ]}
            >
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <ThemedText style={styles.statusText}>{statusText}</ThemedText>
    </>
  );

  const listFooterComponent = () => (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => router.push("/add")}
      >
        <AntDesign name="plus" size={16} color="#0762d1" />
        <ThemedText style={styles.addLabel}>Add Position</ThemedText>
      </Pressable>
    </>
  );

  const fetchYahooJson = async (url: string) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }

      if (response.status === 429 || response.status >= 500) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        if (proxyResponse.ok) {
          return await proxyResponse.json();
        }
      }

      throw new Error(`Yahoo request failed with status ${response.status}`);
    } catch (error) {
      console.warn("Yahoo fetch failed", error);
      throw error;
    }
  };

  const fetchYahooQuotes = async (symbols: string[]) => {
    if (symbols.length === 0) {
      return new Map<string, { price: number; currency: string }>();
    }

    try {
      const BASE_URL = "http://192.168.1.42:8000/api"; // your Mac's local IP

      const url = `${BASE_URL}/quotes?symbols=${encodeURIComponent(symbols.join(","))}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch quotes: ${res.status}`);
      }

      const quotes = await res.json();
      const map = new Map<string, { price: number; currency: string }>();

      quotes.forEach((item: any) => {
        if (item.symbol) {
          map.set(item.symbol, {
            price: item.price ?? 0,
            currency: item.currency ?? "USD",
          });
        }
      });

      return map;
    } catch (error) {
      return new Map<string, { price: number; currency: string }>();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <FlatList
            data={filteredHoldings}
            keyExtractor={(item) => item.ticker}
            renderItem={({ item }) => <HoldingCard holding={item} />}
            ListHeaderComponent={listHeaderComponent}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ThemedView style={styles.emptyState}>
                <ThemedText>No holdings match your search.</ThemedText>
              </ThemedView>
            }
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => router.push("/add")}
          >
            <AntDesign name="plus" size={16} color="#0762d1" />
            <ThemedText style={styles.addLabel}>Add Position</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  filterContainer: {
    paddingVertical: Spacing.twoAndHalf,
    maxHeight: 60,
    marginBottom: Spacing.two,
  },
  filterContent: {
    alignItems: "center",
  },
  tabButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radii.round,
    marginRight: Spacing.two,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    color: "#CBD5E1",
    fontWeight: "600",
    fontSize: FontSizes.base,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  summaryCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.large,
    padding: Spacing.two,
    marginBottom: Spacing.oneAndHalf,
  },
  summaryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 14,
  },
  summaryTitle: {
    color: "#94A3B8",
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  summaryHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryToggle: {
    width: 40,
    height: 40,
    borderRadius: Radii.base,
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A121E",
  },
  summaryValue: {
    color: "#F8FAFC",
    fontSize: FontSizes.xxl,
    fontWeight: "800",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: "#94A3B8",
    fontSize: FontSizes.xs,
    marginBottom: Spacing.one,
  },
  summaryAmount: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  statsPanel: {
    marginBottom: Spacing.three,
    borderRadius: Radii.medium,
    paddingHorizontal: Spacing.one,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },
  statusText: {
    color: "#94A3B8",
    fontSize: FontSizes.base,
    marginBottom: Spacing.two,
  },
  listContent: {
    paddingBottom: Spacing.four,
  },
  emptyState: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.medium,
    padding: Spacing.four,
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: Radii.medium,
    backgroundColor: "#60A5FA",
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  addLabel: {
    marginLeft: Spacing.two,
    color: "#0762d1",
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  addScreen: {
    flex: 1,
    width: "100%",
  },
  addScreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 12,
  },
  addScreenTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  addFieldRow: {
    flexDirection: "row",
    marginBottom: Spacing.twoAndHalf,
  },
  addFieldGroup: {
    flex: 1,
    marginRight: Spacing.twoAndHalf,
  },
  addFieldLabel: {
    color: "#CBD5E1",
    fontSize: FontSizes.sm,
    marginBottom: Spacing.oneAndHalf,
  },
  addInput: {
    width: "100%",
    borderRadius: Radii.small,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    paddingHorizontal: Spacing.twoAndHalf,
    paddingVertical: Spacing.twoAndHalf,
    fontSize: FontSizes.base,
  },
  addNoteInput: {
    minHeight: 44,
    textAlignVertical: "top",
  },
});
