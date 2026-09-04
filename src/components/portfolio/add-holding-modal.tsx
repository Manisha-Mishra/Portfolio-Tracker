import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { Fund, Holding } from "@/components/portfolio/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type AddHoldingModalProps = {
  visible: boolean;
  fund: Fund | null;
  onClose: () => void;
  onSave: (holding: Holding) => void;
};

export function AddHoldingModal({
  visible,
  fund,
  onClose,
  onSave,
}: AddHoldingModalProps) {
  const [shares, setShares] = useState("1");
  const [avgCost, setAvgCost] = useState(
    fund ? fund.currentPrice.toString() : "0",
  );

  const previewHolding = useMemo(() => {
    if (!fund) {
      return null;
    }
    const sharesNum = Number(shares) || 0;
    const avgCostNum = Number(avgCost) || fund.currentPrice;
    return {
      ...fund,
      shares: sharesNum,
      avgCost: avgCostNum,
      currentPrice: fund.currentPrice,
    } as Holding;
  }, [fund, shares, avgCost]);

  const canSave = !!fund && Number(shares) > 0 && Number(avgCost) > 0;

  const handleSave = () => {
    if (!fund || !canSave || !previewHolding) {
      return;
    }
    onSave(previewHolding);
    setShares("1");
    setAvgCost(fund.currentPrice.toString());
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <ThemedView style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            <ThemedText style={styles.title}>Add Position</ThemedText>
            {fund ? (
              <>
                <ThemedText style={styles.subTitle}>
                  {fund.ticker} · {fund.name}
                </ThemedText>
                <View style={styles.fieldRow}>
                  <ThemedText style={styles.fieldLabel}>Shares</ThemedText>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={shares}
                    onChangeText={setShares}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.fieldRow}>
                  <ThemedText style={styles.fieldLabel}>Avg Cost</ThemedText>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={avgCost}
                    onChangeText={setAvgCost}
                    placeholder={fund.currentPrice.toString()}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </>
            ) : (
              <ThemedText style={styles.subTitle}>No fund selected.</ThemedText>
            )}
          </ScrollView>
          <View style={styles.buttonsRow}>
            <Pressable style={styles.button} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                canSave ? styles.primaryButton : styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <ThemedText style={styles.primaryButtonText}>Add</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 20,
    backgroundColor: "#020817",
    borderWidth: 1,
    borderColor: "#1E293B",
    padding: 18,
  },
  content: {
    paddingBottom: 8,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  subTitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 10,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#F8FAFC",
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  buttonText: {
    color: "#94A3B8",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#60A5FA",
  },
  primaryButtonText: {
    color: "#0762d1",
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#1E293B",
  },
});
