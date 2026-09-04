import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sampleFunds } from "@/components/portfolio/fund-data";
import { SearchBar } from "@/components/portfolio/search-bar";
import { Fund, Holding } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import DateNotePicker from "@/components/ui/date-note-picker";
import { Spacing } from "@/constants/theme";
import { usePortfolio } from "@/context/PortfolioStore";

export default function AddPositionScreen() {
  const router = useRouter();
  const { holdings, setHoldings } = usePortfolio();
  const [query, setQuery] = useState("");
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [mode, setMode] = useState<"Buy" | "Sell">("Buy");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [tradeDate, setTradeDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const results = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return sampleFunds.filter((fund) => {
      if (!lowerQuery) {
        return true;
      }
      return (
        fund.ticker.toLowerCase().includes(lowerQuery) ||
        fund.name.toLowerCase().includes(lowerQuery) ||
        fund.category.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query]);

  const handleSelectFund = (fund: Fund) => {
    setSelectedFund(fund);
    setIsFormModalVisible(true);
    setRate(fund.currentPrice.toString());
    setError("");
  };

  const handleCloseModal = () => {
    setIsFormModalVisible(false);
    setSelectedFund(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedFund) {
      setError("Please select a fund first.");
      return;
    }

    const qty = Math.max(1, Math.floor(Number(quantity) || 0));
    const rateValue = Number(rate) || selectedFund.currentPrice;
    const tradeDateValue =
      tradeDate.trim() || new Date().toISOString().slice(0, 10);

    if (qty <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (rateValue <= 0) {
      setError("Enter a valid price.");
      return;
    }

    const existing = holdings.find(
      (item) => item.ticker === selectedFund.ticker,
    );

    let updatedHoldings: Holding[] = [];

    if (mode === "Buy") {
      const newHolding: Holding = {
        ...selectedFund,
        shares: qty,
        avgCost: rateValue,
        currentPrice: selectedFund.currentPrice,
        note:
          notes.trim() || `Bought ${qty} @ ${rateValue} on ${tradeDateValue}`,
      };

      updatedHoldings = existing
        ? holdings.map((item) =>
            item.ticker === selectedFund.ticker
              ? {
                  ...item,
                  shares: item.shares + qty,
                  avgCost:
                    item.shares > 0
                      ? (item.shares * item.avgCost + qty * rateValue) /
                        (item.shares + qty)
                      : rateValue,
                  currentPrice: selectedFund.currentPrice,
                  note: notes.trim()
                    ? notes.trim()
                    : `Bought ${qty} @ ${rateValue} on ${tradeDateValue}`,
                }
              : item,
          )
        : [...holdings, newHolding];
    } else {
      if (!existing) {
        setError("No existing position to sell.");
        return;
      }

      if (qty > existing.shares) {
        setError(
          `Cannot sell ${qty} shares when you only own ${existing.shares}.`,
        );
        return;
      }

      const sellQty = qty;
      const remaining = existing.shares - sellQty;
      const sellNote =
        notes.trim() || `Sold ${sellQty} @ ${rateValue} on ${tradeDateValue}`;

      if (remaining > 0) {
        updatedHoldings = holdings.map((item) =>
          item.ticker === selectedFund.ticker
            ? {
                ...item,
                shares: remaining,
                currentPrice: selectedFund.currentPrice,
                note: sellNote,
              }
            : item,
        );
      } else {
        updatedHoldings = holdings.filter(
          (item) => item.ticker !== selectedFund.ticker,
        );
      }
    }

    await setHoldings(updatedHoldings);
    setIsFormModalVisible(false);
    setSelectedFund(null);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* <HeaderSection /> */}
        {/* <HeaderButtonSection /> */}

        <View style={styles.addScreenHeaderRow}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={20} color="#F8FAFC" />
          </Pressable>

          <View style={styles.addScreenHeaderText}>
            <ThemedText style={styles.title}>Add Position</ThemedText>
            <ThemedText style={styles.subtitle}>
              Buy or sell a holding, add quantity, rate, date, and optional
              notes.
            </ThemedText>
          </View>

          {/* <Pressable
            style={({ pressed }) => [
              styles.addFundsHeaderButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => router.push('/add')}
          >
            <AntDesign name="plus" size={16} color="#0762d1" />
            <ThemedText style={styles.addFundsHeaderLabel}>Add Funds</ThemedText>
          </Pressable> */}
        </View>

        <View style={styles.modeRow}>
          {(["Buy", "Sell"] as const).map((item) => (
            <Pressable
              key={item}
              style={({ pressed }) => [
                styles.modeButton,
                item === mode && styles.modeButtonActive,
                { opacity: pressed ? 0.75 : 1 },
              ]}
              onPress={() => setMode(item)}
            >
              <ThemedText
                style={item === mode ? styles.modeTextActive : styles.modeText}
              >
                {item}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search symbol, name, or category"
        />

        <View style={styles.contentArea}>
          <ScrollView
            style={styles.resultsContainer}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
          >
            {results.map((fund) => (
              <Pressable
                key={fund.ticker}
                style={[
                  styles.fundRow,
                  selectedFund?.ticker === fund.ticker && styles.fundRowSelected,
                ]}
                onPress={() => handleSelectFund(fund)}
              >
                <View>
                  <ThemedText style={styles.fundTicker}>{fund.ticker}</ThemedText>
                  <ThemedText style={styles.fundName}>{fund.name}</ThemedText>
                </View>
                <ThemedText style={styles.fundPrice}>
                  {fund.currentPrice > 0 ? `$${fund.currentPrice}` : "N/A"}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Modal
          visible={isFormModalVisible && !!selectedFund}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Add Position</ThemedText>
                <Pressable
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close add position form"
                >
                  <AntDesign name="close" size={18} color="#F8FAFC" />
                </Pressable>
              </View>

              <View style={styles.selectedCard}>
                <ThemedText style={styles.selectedTitle}>Selected Fund</ThemedText>
                <ThemedText style={styles.selectedName}>
                  {selectedFund?.name} • {selectedFund?.ticker}
                </ThemedText>
                <ThemedText style={styles.selectedMeta}>
                  {selectedFund?.category} • {selectedFund?.currency}
                </ThemedText>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Quantity</ThemedText>
                  <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="1"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Rate</ThemedText>
                  <TextInput
                    value={rate}
                    onChangeText={setRate}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder={selectedFund ? selectedFund.currentPrice.toString() : "0"}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.formRowSingle}>
                <DateNotePicker
                  value={tradeDate}
                  onChange={(date) => {
                    setTradeDate(date);
                  }}
                />
              </View>

              <View style={styles.formRowSingle}>
                <View style={styles.formGroupFull}>
                  <ThemedText style={styles.label}>Notes</ThemedText>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    style={[styles.input, styles.notesInput]}
                    placeholder="Optional note"
                    placeholderTextColor="#94A3B8"
                    multiline
                  />
                </View>
              </View>

              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={handleSubmit}
              >
                <ThemedText style={styles.saveButtonText}>Add Position</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  contentArea: {
    flex: 1,
  },
  addScreenHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  addScreenHeaderText: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  addFundsHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#60A5FA",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  addFundsHeaderLabel: {
    marginLeft: 8,
    color: "#0762d1",
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 18,
  },
  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 14,
    backgroundColor: "#0F172A",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  modeText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },
  modeTextActive: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  resultsContent: {
    paddingBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.72)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#020617",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.three,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  fundRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0F172A",
    marginBottom: 10,
  },
  fundRowSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#111D3A",
  },
  fundTicker: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  fundName: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  fundPrice: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#0F172A",
    marginBottom: 16,
  },
  selectedTitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 8,
  },
  selectedName: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  selectedMeta: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  formRowSingle: {
    marginBottom: 12,
  },
  formGroup: {
    flex: 1,
    marginRight: 10,
  },
  formGroupFull: {
    width: "100%",
  },
  label: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 44,
    textAlignVertical: "top",
  },
  footerActions: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 8,
  },
  errorText: {
    color: "#F87171",
    fontSize: 13,
    marginBottom: 12,
  },
  saveButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
});
