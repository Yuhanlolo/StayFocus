import { Pressable, Text } from "react-native";

import { createStyles } from "../helpers";

export function CustomButton(props) {
  const defaultStyles = useStyles();

  return (
    <Pressable
      android_ripple={{ color: props.style?.rippleColor, borderless: true }}
      {...props}
      style={[defaultStyles, props.style]}
    >
      <Text style={[defaultStyles.text, props.style?.text]}>
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
    color: theme.textColor,
    fontWeight: "500",
    textAlign: "center",
  },
}));
