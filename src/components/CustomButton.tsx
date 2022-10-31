import { Pressable, PressableProps, Text } from "react-native";

import { createStyles, CSSStyles } from "../helpers";

interface CustomButtonProps extends PressableProps {
  styles: {
    button?: CSSStyles;
    text?: CSSStyles;
  };
  children: React.ReactNode;
}

export function CustomButton(props: CustomButtonProps) {
  const defaultStyles = useStyles();

  return (
    <Pressable {...props} style={[defaultStyles.button, props.styles.button]}>
      <Text style={[defaultStyles.text, props.styles.text]}>
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
