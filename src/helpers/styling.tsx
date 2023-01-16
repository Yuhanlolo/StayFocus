import React, { createContext, useContext } from "react";
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

const THEME = {
  primaryColor: "#B8C59E",
  secondaryColor: "#506F4C",
  backgroundColor: "#1E1E1E",
  muteColor: "#333333",
  textColor: "#FFFFFF",
  alertColor: "#FF5656",
  padding: 24,
  fontSizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
};

const ThemeContext = createContext(THEME);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={THEME}>{children}</ThemeContext.Provider>
  );
}

export function createStyles<Key extends string = string, Params = void>(
  input:
    | ((theme: Theme, params: Params) => Record<Key, CSSStyles>)
    | Record<Key, CSSStyles>
) {
  const getCssObject = typeof input === "function" ? input : () => input;

  function useStyles(params: Params) {
    const theme = useContext(ThemeContext);
    const cssObject = getCssObject(theme, params);
    return StyleSheet.create(cssObject);
  }

  return useStyles;
}

export interface CSSStyles extends ViewStyle, TextStyle, ImageStyle {
  overflow?: any;
  rippleColor?: string;
  placeholderTextColor?: string;
}

type Theme = typeof THEME;
