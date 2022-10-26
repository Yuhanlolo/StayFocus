import { useState } from "react";
import { Text, TextInput, View, Keyboard } from "react-native";

import { createStyles } from "../helpers";
import { SelectButton } from "../components/SelectButton";
import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { useLocalStore } from "../store";

//Home page to set focusing time

function HomePage({ navigation }) {
  const styles = useStyles();
  const [plan, setPlan] = useState("");
  const [minutes, setMinutes] = useState(10);

  const savePlan = useLocalStore((state) => state.savePlan);
  const saveStartDatetime = useLocalStore((state) => state.saveStartDatetime);
  const saveSetSeconds = useLocalStore((state) => state.saveSetSeconds);

  const onPress = () => {
    savePlan(plan);
    saveStartDatetime();
    saveSetSeconds(minutes * 60);
    // Unfocus the input before changing page, so that the
    // user sees if their input gets clamped to min or max
    Keyboard.dismiss();
    setTimeout(() => navigation.navigate("TimerPage"), 500);
  };

  return (
    <Screen>
      <TextInput
        style={styles.input}
        onChangeText={setPlan}
        placeholder={"My plan is..."}
        placeholderTextColor={styles.input.placeholderTextColor}
        multiline={true}
        value={plan}
      />
      <View style={styles.prompt}>
        <Text style={styles.prompt.text}>I want to focus for</Text>
        <SelectButton
          min={10}
          max={120}
          step={5}
          value={minutes}
          onChange={(v) => setMinutes(v)}
          style={styles.prompt.select}
        />
        <Text style={styles.prompt.suffix}>minutes</Text>
      </View>
      <CustomButton style={styles.button} onPress={onPress}>
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
  input: {
    width: "75%",
    marginTop: "30%",
    marginBottom: "30%",
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: theme.primaryColor,
    color: theme.textColor,
    placeholderTextColor: theme.primaryColor,
    fontWeight: "700",
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  prompt: {
    justifyContent: "flex-start",
    marginBottom: "30%",
    alignItems: "center",
    text: {
      width: "100%",
      color: theme.textColor,
      fontSize: theme.fontSizes.md,
      textAlign: "center",
    },
    select: {
      backgroundColor: "transparent",
      color: theme.textColor,
      textAlign: "center",
      textInput: {
        width: 100,
        color: theme.textColor,
        fontSize: theme.fontSizes.xl,
        fontWeight: "700",
      },
    },
    suffix: {
      color: theme.textColor,
      fontSize: theme.fontSizes.md,
    },
  },
  button: {
    rippleColor: theme.backgroundColor,
    text: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

export default HomePage;
