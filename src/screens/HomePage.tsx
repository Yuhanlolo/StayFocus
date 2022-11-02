import { useState } from "react";
import { Text, TextInput, Pressable, View, Keyboard } from "react-native";

import { createStyles } from "../helpers";
import {
  CustomButton,
  Screen,
  TimeDropdown,
  HamburgerMenu,
} from "../components";
import { useSessionStore } from "../api";

//Home page to set focusing time

function HomePage({ navigation }) {
  const [plan, setPlan] = useState("");

  const [value, setValue] = useState(25);

  const newSession = useSessionStore((state) => state.newSession);

  const onPress = () => {
    newSession(plan, value);
    // Unfocus the input before changing page, so that the
    // user sees if their input gets clamped to min or max
    Keyboard.dismiss();
    setTimeout(() => navigation.navigate("TimerPage"), 500);
  };

  const styles = useStyles();

  return (
    <Screen>
      <Pressable onPress={navigation.toggleDrawer}>
        <HamburgerMenu size={32} color={styles.icon.color} />
      </Pressable>
      <View style={styles.section}>
        <Text style={styles.text}>My plan for this focus time is</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPlan}
          multiline={true}
          value={plan}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>I want to focus for</Text>
        <TimeDropdown value={value} setValue={setValue} />
      </View>
      <CustomButton
        styles={{ button: styles.button, text: styles.buttonText }}
        onPress={onPress}
      >
        Start
      </CustomButton>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  section: {
    marginTop: 60,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  text: {
    marginBottom: 4,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  input: {
    padding: 8,
    backgroundColor: "white",
    color: theme.muteColor,
    fontSize: theme.fontSizes.md,
    borderRadius: 8,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  button: {
    marginTop: 40,
    rippleColor: theme.backgroundColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
  },
  icon: {
    color: theme.primaryColor,
  },
}));

export default HomePage;
