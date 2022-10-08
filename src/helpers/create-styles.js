import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { StyleSheet } from "react-native";

export function createStyles(input) {
  const getCssObject = typeof input === "function" ? input : () => input;

  function useStyles(params) {
    const theme = useContext(ThemeContext);
    const cssObject = getCssObject(theme, params);
    return StyleSheet.create(cssObject);
  }

  return useStyles;
}
