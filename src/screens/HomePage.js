import { useContext, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { createStyles, ThemeContext } from "../helpers";
import { SelectButton } from "../components/SelectButton";
import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { useLocalStore } from "../store";

//Home page to set focusing time

function HomePage({ navigation }) {
  const styles = useStyles();
  const theme = useContext(ThemeContext);
  const [plan, setPlan] = useState("");
  const [minutes, setMinutes] = useState(10);

  const savePlan = useLocalStore((state) => state.savePlan);
  const saveStartDatetime = useLocalStore((state) => state.saveStartDatetime);
  const saveSetTimeSeconds = useLocalStore((state) => state.saveSetTimeSeconds);

  const onPress = () => {
    savePlan(plan);
    saveStartDatetime();
    saveSetTimeSeconds(minutes * 60);
    navigation.navigate("TimerPage");
  };

  return (
    <Screen>
      <TextInput
        style={styles.input}
        onChangeText={setPlan}
        placeholder={"My plan is..."}
        placeholderTextColor={theme.muteColor}
        multiline={true}
        value={plan}
      />
      <View style={styles.prompt}>
        <Text style={styles.prompt.text}>I want to focus for</Text>
        <SelectButton
          min={10}
          max={120}
          step={5}
          suffix="minutes"
          value={minutes}
          onChange={(v) => {
            console.log(typeof v);
            setMinutes(v);
          }}
          style={styles.prompt.select}
        />
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
    width: "100%",
    color: theme.secondaryColor,
    marginTop: "30%",
    marginBottom: "30%",
    fontFamily: "serif",
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: theme.fontSizes.huge,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  prompt: {
    marginBottom: 40,
    text: {
      width: "100%",
      color: theme.secondaryColor,
      fontSize: theme.fontSizes.lg,
      textAlign: "center",
    },
    select: {
      backgroundColor: "transparent",
      color: theme.secondaryColor,
      textInput: {
        color: theme.secondaryColor,
        fontSize: 2 * theme.fontSizes.xl,
        fontWeight: "700",
      },
    },
    suffix: {
      color: theme.secondaryColor,
      fontSize: theme.fontSizes.lg,
    },
  },
  button: {
    rippleColor: theme.primaryColor,
    text: {
      fontSize: theme.fontSizes.lg,
    },
  },
}));

export default HomePage;
