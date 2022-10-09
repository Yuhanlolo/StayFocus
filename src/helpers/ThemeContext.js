import React, { createContext } from "react";

const theme = {
  primaryColor: "#19534f",
  secondaryColor: "#f1fec9",
  muteColor: "#f1fec980",
  padding: 16,
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    huge: 30,
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
