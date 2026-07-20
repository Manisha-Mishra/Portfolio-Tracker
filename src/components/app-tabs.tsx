import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";

export default function AppTabs(props: BottomTabBarProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {props.state.routes.map((route, index) => {
        const isFocused = props.state.index === index;
        const label =
          route.name === "index"
            ? "Home"
            : route.name === "explore"
              ? "Portfolio"
              : "Profile";

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = props.navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.navigate(route.name, route.params);
              }
            }}
            style={[
              styles.tab,
              {
                borderBottomColor: isFocused
                  ? colors.backgroundElement
                  : "transparent",
              },
            ]}
          >
            {route.name === "index" && (
              <SymbolView
                name="house.fill"
                size={24}
                tintColor={isFocused ? colors.text : "#94A3B8"}
              />
            )}
            {route.name === "explore" && (
              <SymbolView
                name="chart.pie.fill"
                size={24}
                tintColor={isFocused ? colors.text : "#94A3B8"}
              />
            )}
            {route.name === "profile" && (
              <SymbolView
                name="person.fill"
                size={24}
                tintColor={isFocused ? colors.text : "#94A3B8"}
              />
            )}
            <ThemedText
              style={[
                styles.label,
                { color: isFocused ? colors.text : "#94A3B8" },
              ]}
            >
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
