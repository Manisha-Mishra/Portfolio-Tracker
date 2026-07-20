import React from "react";
import { Image, StyleSheet, Text } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { ThemedText } from "../themed-text";

export default function HeaderSection() {
  return (
    <ThemedView style={styles.heroSection}>
      <ThemedView style={styles.avatar}>
        <Image
          style={styles.image}
          source={require("@/assets/images/portfolio-logo.png")}
          resizeMode="contain"
        />
      </ThemedView>

      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.title}>
          Portfolio <Text style={styles.subTitle}>Tracker</Text>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    // backgroundColor: "#020817",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'space-between',
    // marginBottom:Spacing.four
    paddingVertical: 4,
  },
  avatar: {
    marginRight: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius:12,
    marginRight:12
  },
  textContainer: {
    justifyContent: "center",
  },
  title: {
    // color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing:0.5
  },
  button: {
      flexDirection: 'row',
      alignItems: 'center',
  
      height:40,
      // width:40,
      // paddingVertical: 10,
      paddingHorizontal: Spacing.three,
  
      borderRadius: 16,
      marginRight: 10,
  
      // shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
  subTitle: {
    color: "#60A5FA",
  },
});
