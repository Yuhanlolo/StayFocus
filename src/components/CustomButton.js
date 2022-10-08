import { useContext } from "react";
import { Pressable, Text } from "react-native";

import { createStyles, ThemeContext } from "../helpers";

export function CustomButton(props) {
  const theme = useContext(ThemeContext);
  const defaultStyles = useStyles();

  return (
    <Pressable
      android_ripple={{ color: theme.primaryColor, borderless: true }}
      {...props}
      style={{ ...defaultStyles, ...props.style }}
    >
      <Text style={{ ...defaultStyles.text, ...props.style?.text }}>
        {props.children}
      </Text>
    </Pressable>
  );
}

const useStyles = createStyles((theme) => ({
  padding: 12,
  paddingLeft: 24,
  paddingRight: 24,
  backgroundColor: theme.secondaryColor,
  borderRadius: 12,
  text: {
    color: theme.primaryColor,
    fontSize: theme.fontSizes.lg,
    fontWeight: "500",
    textAlign: "center",
  },
}));
