import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Fund } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type FundItemProps = {
  fund: Fund;
  onAdd: (fund: Fund) => void;
};

export function FundItem({ fund, onAdd }: FundItemProps) {
  const priceText =
    fund.currentPrice > 0 ? `$${fund.currentPrice.toLocaleString()}` : "N/A";

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.ticker}>{fund.ticker}</ThemedText>
          <ThemedText style={styles.name}>{fund.name}</ThemedText>
        </View>
        <ThemedText style={styles.price}>{priceText}</ThemedText>
      </View>
      <View style={styles.bottomRow}>
        <ThemedText style={styles.category}>{fund.category}</ThemedText>
        <Pressable style={styles.button} onPress={() => onAdd(fund)}>
          <AntDesign name="plus" size={14} color="#0762d1" />
          <ThemedText style={styles.buttonText}>Add</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticker: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },
  price: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  category: {
    color: "#94A3B8",
    fontSize: 13,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#60A5FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buttonText: {
    marginLeft: 6,
    color: "#0762d1",
    fontWeight: "700",
  },
});
