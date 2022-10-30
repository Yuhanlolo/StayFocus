import { StatusBar, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles } from "../helpers";

export function Screen({ children }) {
  const styles = useStyles();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.statusBar.backgroundColor}
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
  statusBar: {
    backgroundColor: theme.backgroundColor,
  },
}));
