import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontSizes, MaxContentWidth, Radii, Spacing } from "@/constants/theme";

const userProfile = {
  name: "Amit Patel",
  birthDate: "1990-08-15",
  email: "amit.patel@example.com",
  location: "Mumbai, India",
};

function calculateAge(birthDate: string) {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export default function TabThreeScreen() {
  const age = calculateAge(userProfile.birthDate);

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <ThemedText type="subtitle">Profile</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            View your portfolio profile details.
          </ThemedText>

          <View style={styles.profileCard}>
            <ThemedText style={styles.profileName}>
              {userProfile.name}
            </ThemedText>
            <View style={styles.profileRow}>
              <ThemedText style={styles.profileLabel}>Age</ThemedText>
              <ThemedText style={styles.profileValue}>{age}</ThemedText>
            </View>
            <View style={styles.profileRow}>
              <ThemedText style={styles.profileLabel}>Email</ThemedText>
              <ThemedText style={styles.profileValue}>
                {userProfile.email}
              </ThemedText>
            </View>
            <View style={styles.profileRow}>
              <ThemedText style={styles.profileLabel}>Location</ThemedText>
              <ThemedText style={styles.profileValue}>
                {userProfile.location}
              </ThemedText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // container: {
  //   flex: 1,
  //   marginBottom:4

  //   // justifyContent: 'center',
  //   // backgroundColor: "#020817",
  // },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  contentContainer: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  profileCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: Radii.large,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  profileName: {
    color: "#F8FAFC",
    fontSize: FontSizes.xxl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FontSizes.base,
    marginBottom: Spacing.three,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  profileLabel: {
    color: "#94A3B8",
    fontSize: FontSizes.base,
  },
  profileValue: {
    color: "#F8FAFC",
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
