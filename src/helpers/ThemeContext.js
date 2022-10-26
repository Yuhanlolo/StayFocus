import React, { createContext } from "react";

const theme = {
  primaryColor: "#B8C59E",
  secondaryColor: "#506F4C",
  backgroundColor: "#1E1E1E",
  muteColor: "#333333",
  textColor: "#FFFFFF",
  alertColor: "#FF5656",
  padding: 16,
  fontSizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
};

export const ThemeContext = createContext(theme);

export function ThemeProvider(props) {
  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
}
