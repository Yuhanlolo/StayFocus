import { StatusBar, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles, CSSStyles } from "../helpers";

interface ScreenProps {
  styles?: CSSStyles;
  children: React.ReactNode;
}

export function Screen({ styles, children }: ScreenProps) {
  const defaultStyles = useStyles();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={[defaultStyles.container, styles]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            styles?.backgroundColor || defaultStyles.container.backgroundColor
          }
        />
        {children}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.backgroundColor,
  },
}));
