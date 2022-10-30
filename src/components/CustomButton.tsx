import { Pressable, PressableProps, Text } from "react-native";

import { createStyles, CSSStyles } from "../helpers";

interface CustomButtonProps {
  style: {
    button?: CSSStyles;
    text?: CSSStyles;
    rippleColor: string;
  };
  children: React.ReactNode;
  buttonProps?: PressableProps;
}

export function CustomButton(props: CustomButtonProps) {
  const defaultStyles = useStyles();

  return (
    <Pressable
      android_ripple={{ color: props.style.rippleColor, borderless: true }}
      {...props.buttonProps}
      style={[defaultStyles.button, props.style.button]}
    >
      <Text style={[defaultStyles.text, props.style.text]}>
        {props.children}
      </Text>
    </Pressable>
  );
}

const useStyles = createStyles((theme) => ({
  button: {
    padding: 12,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: theme.secondaryColor,
    borderRadius: 9999,
  },
  text: {
    color: theme.textColor,
    textAlign: "center",
  },
}));
