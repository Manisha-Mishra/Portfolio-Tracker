import { ThemedText } from "@/components/themed-text";
import { FontSizes, Radii, Spacing } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function isValidYMD(y: number, m: number, d: number) {
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
    return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

export function DateNotePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  minYear = 1900,
  maxYear = new Date().getFullYear() + 10,
}: Props) {
  const [open, setOpen] = useState(false);
  const [year, month, day] = useMemo(() => {
    if (!value) return ["", "", ""]; // strings for TextInput
    const parts = value.split("-");
    return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
  }, [value]);

  const [y, setY] = useState<string>(String(year));
  const [m, setM] = useState<string>(String(month));
  const [d, setD] = useState<string>(String(day));
  const [error, setError] = useState<string | null>(null);
  const [pickerField, setPickerField] = useState<
    "year" | "month" | "day" | null
  >(null);

  const optionValues = useMemo(
    () => ({
      year: Array.from({ length: maxYear - minYear + 1 }, (_, index) =>
        String(minYear + index),
      ),
      month: Array.from({ length: 12 }, (_, index) => pad(index + 1)),
      day: Array.from({ length: 31 }, (_, index) => pad(index + 1)),
    }),
    [maxYear, minYear],
  );

  const openModal = () => {
    // seed inputs with current value
    if (value) {
      const parts = value.split("-");
      setY(parts[0] ?? "");
      setM(parts[1] ?? "");
      setD(parts[2] ?? "");
    } else {
      const dt = new Date();
      setY(String(dt.getFullYear()));
      setM(pad(dt.getMonth() + 1));
      setD(pad(dt.getDate()));
    }
    setError(null);
    setOpen(true);
  };

  const validate = () => {
    const yi = parseInt(y || "0", 10);
    const mi = parseInt(m || "0", 10);
    const di = parseInt(d || "0", 10);
    if (!isValidYMD(yi, mi, di)) {
      setError("Invalid date. Please enter a valid YYYY-MM-DD date.");
      return false;
    }
    if (yi < minYear || yi > maxYear) {
      setError(`Year must be between ${minYear} and ${maxYear}`);
      return false;
    }
    setError(null);
    return true;
  };

  const confirm = () => {
    if (!validate()) return;
    const date = `${y}-${pad(Number(m))}-${pad(Number(d))}`;
    setOpen(false);
    onChange?.(date);
  };

  return (
    <View>
      <Pressable
        style={styles.control}
        onPress={openModal}
        accessibilityRole="button"
      >
        <AntDesign name="calendar" size={18} color="#94A3B8" />
        <ThemedText style={styles.controlText}>
          {value ?? placeholder}
        </ThemedText>
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Choose Date</ThemedText>

            <ScrollView contentContainerStyle={styles.row} horizontal={false}>
              <View style={styles.rowInputs}>
                {(
                  [
                    { key: "year", label: "Year", value: y || "YYYY" },
                    { key: "month", label: "Month", value: m || "MM" },
                    { key: "day", label: "Day", value: d || "DD" },
                  ] as const
                ).map((field) => (
                  <View key={field.key} style={styles.field}>
                    <ThemedText>{field.label}</ThemedText>
                    <Pressable
                      style={styles.dropdownTrigger}
                      onPress={() => setPickerField(field.key)}
                    >
                      <Text style={styles.dropdownValue}>{field.value}</Text>
                      <AntDesign name="caret-down" size={12} color="#94A3B8" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {pickerField ? (
                <View style={styles.optionSheet}>
                  <ThemedText style={styles.optionSheetTitle}>
                    Select{" "}
                    {pickerField.charAt(0).toUpperCase() + pickerField.slice(1)}
                  </ThemedText>
                  <ScrollView style={styles.optionList} nestedScrollEnabled>
                    {optionValues[pickerField].map((option) => (
                      <Pressable
                        key={option}
                        style={styles.optionItem}
                        onPress={() => {
                          if (pickerField === "year") setY(option);
                          if (pickerField === "month") setM(option);
                          if (pickerField === "day") setD(option);
                          setPickerField(null);
                        }}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.actionsRow}>
                <Pressable
                  style={[styles.actionButton, styles.cancel]}
                  onPress={() => setOpen(false)}
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.validate]}
                  onPress={() => {
                    validate();
                  }}
                >
                  <Text style={styles.actionText}>Validate</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.confirm]}
                  onPress={confirm}
                >
                  <Text style={styles.actionText}>Confirm</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.two,
    borderRadius: Radii.small,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0F172A",
  },
  controlText: {
    marginLeft: Spacing.two,
    color: "#F8FAFC",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    width: "92%",
    maxWidth: 720,
    backgroundColor: "#071126",
    borderRadius: Radii.medium,
    padding: Spacing.four,
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
    marginBottom: Spacing.two,
  },
  row: { gap: Spacing.two },
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
  field: { flex: 1, marginRight: Spacing.two },
  dropdownTrigger: {
    marginTop: Spacing.one,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownValue: {
    color: "#F8FAFC",
    fontSize: 14,
  },
  optionSheet: {
    marginTop: Spacing.one,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.small,
    padding: Spacing.two,
    maxHeight: 180,
  },
  optionSheetTitle: {
    color: "#F8FAFC",
    fontWeight: "600",
    marginBottom: Spacing.one,
  },
  optionList: {
    maxHeight: 150,
  },
  optionItem: {
    paddingVertical: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  optionText: {
    color: "#F8FAFC",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: Spacing.three,
  },
  actionButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginLeft: Spacing.two,
    borderRadius: Radii.small,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  cancel: {},
  validate: {},
  confirm: { backgroundColor: "#3B82F6" },
  actionText: { color: "#F8FAFC", fontWeight: "600" },
  errorText: { color: "#F87171", marginTop: Spacing.one },
});

export default DateNotePicker;
