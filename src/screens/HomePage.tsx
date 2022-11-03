import { useState } from "react";
import { Text, TextInput, Pressable, View, Keyboard } from "react-native";

import { createStyles } from "../helpers";
import { CustomButton, Screen, TimeDropdown, Gear } from "../components";
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
      <View style={styles.iconContainer}>
        <Pressable onPress={navigation.toggleDrawer}>
          <Gear size={32} color={styles.icon.color} />
        </Pressable>
      </View>
      <View style={styles.section1}>
        <Text style={styles.text}>I want to focus for</Text>
        <TimeDropdown value={value} setValue={setValue} />
      </View>
      <View style={styles.section2}>
        <Text style={styles.text}>My plan for this focus time is</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPlan}
          multiline={true}
          value={plan}
        />
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
  iconContainer: {
    width: "100%",
  },
  icon: {
    color: theme.primaryColor,
  },
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  section1: {
    marginTop: 40,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  section2: {
    marginTop: 220,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  text: {
    marginBottom: 20,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  input: {
    padding: 8,
    backgroundColor: "white",
    color: theme.muteColor,
    fontSize: theme.fontSizes.lg,
    borderRadius: 8,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  button: {
    marginTop: 48,
    rippleColor: theme.backgroundColor,
    borderRadius: theme.fontSizes.md / 2,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
  },
}));

export default HomePage;
