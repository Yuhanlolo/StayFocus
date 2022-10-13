import { useContext, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles, ThemeContext } from "../helpers";
import { SelectButton } from "../components/SelectButton";
import { CustomButton } from "../components/CustomButton";
import { useLocalStore } from "../store";

//Home page to set focusing time
const times = [
  { label: "0.1 minutes", value: 0.1 },
  { label: "50 minutes", value: 50 },
  { label: "75 minutes", value: 75 },
  { label: "100 minutes", value: 100 },
];

function HomePage({ navigation }) {
  const styles = useStyles();
  const theme = useContext(ThemeContext);
  const [plan, setPlan] = useState("");
  const [index, setIndex] = useState(0);

  const savePlan = useLocalStore((state) => state.savePlan);
  const saveStartDatetime = useLocalStore((state) => state.saveStartDatetime);
  const saveSetTimeSeconds = useLocalStore((state) => state.saveSetTimeSeconds);

  const onPress = () => {
    savePlan(plan);
    saveStartDatetime();
    saveSetTimeSeconds(times[index].value * 60);
    navigation.navigate("TimerPage");
  };

  return (
    <SafeAreaView style={styles.container}>
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
          data={times}
          index={index}
          onChange={setIndex}
          style={styles.prompt.select}
        />
      </View>
      <CustomButton style={styles.button} onPress={onPress}>
        Start
      </CustomButton>
    </SafeAreaView>
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
    height: "50%",
    width: "100%",
    color: theme.secondaryColor,
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
      color: theme.secondaryColor,
      fontSize: theme.fontSizes.lg,
      textAlign: "center",
    },
    select: {
      backgroundColor: "transparent",
      color: theme.secondaryColor,
      text: {
        color: theme.secondaryColor,
        fontSize: theme.fontSizes.lg,
        fontWeight: "700",
      },
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
