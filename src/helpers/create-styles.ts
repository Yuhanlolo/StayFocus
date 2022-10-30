import { useContext } from "react";
import { Theme, ThemeContext } from "./ThemeContext";
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

export type CSSStyles = ViewStyle | TextStyle | ImageStyle;

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
