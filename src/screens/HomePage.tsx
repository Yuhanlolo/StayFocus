import { useState } from "react";
import { Text, TextInput, View, Keyboard } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { createStyles } from "../helpers";
import { CustomButton, Screen } from "../components";
import { useSessionStore } from "../api";

//Home page to set focusing time

function HomePage({ navigation }) {
  const [plan, setPlan] = useState("");

  const defaultItems = [
    { label: "25 minutes", value: 25 },
    { label: "50 minutes", value: 50 },
    { label: "75 minutes", value: 75 },
    { label: "100 minutes", value: 100 },
  ];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(25);
  const [items, setItems] = useState(defaultItems);

  const newSession = useSessionStore((state) => state.newSession);

  const onPress = () => {
    newSession(plan, value);
    // Unfocus the input before changing page, so that the
    // user sees if their input gets clamped to min or max
    Keyboard.dismiss();
    setTimeout(() => navigation.navigate("TimerPage"), 500);
  };

  // Put the new item first in the dropdown list
  const insertItem = (text: string) =>
    setItems([
      { label: `${text} minutes`, value: parseInt(text, 10) },
      ...defaultItems,
    ]);

  const styles = useStyles();

  return (
    <Screen>
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
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          searchable={true}
          searchTextInputProps={{ keyboardType: "numeric" }}
          searchPlaceholder="Custom time..."
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeSearchText={insertItem}
          showTickIcon={false}
          containerStyle={styles.dropdown}
          textStyle={styles.dropdownText}
          selectedItemLabelStyle={{
            fontWeight: "bold",
          }}
          searchTextInputStyle={styles.dropdownSearchTextInput}
          searchContainerStyle={styles.dropdownSearchContainer}
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
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  section: {
    marginTop: 100,
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
  dropdown: {
    width: 180,
    overflow: "visible",
    zIndex: 100,
  },
  dropdownText: {
    textAlign: "center",
    fontSize: theme.fontSizes.sm,
  },
  dropdownSearchTextInput: {
    textAlign: "center",
    borderRadius: 0,
    borderWidth: 0,
  },
  dropdownSearchContainer: {
    padding: 0,
  },
  button: {
    marginTop: 40,
    rippleColor: theme.backgroundColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
  },
}));

export default HomePage;
