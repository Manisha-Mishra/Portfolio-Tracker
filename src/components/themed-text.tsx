import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, FontSizes, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: FontSizes.base,
    lineHeight: 20,
    fontWeight: "500",
  },
  smallBold: {
    fontSize: FontSizes.base,
    lineHeight: 20,
    fontWeight: "700",
  },
  default: {
    fontSize: FontSizes.lg,
    lineHeight: 24,
    fontWeight: "500",
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: "600",
    lineHeight: 52,
  },
  subtitle: {
    fontSize: FontSizes.xxl,
    lineHeight: 44,
    fontWeight: "600",
  },
  link: {
    lineHeight: 30,
    fontSize: FontSizes.base,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: FontSizes.base,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
