import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Pressable, Text, TextInput, View } from "react-native";

import { CaretDown, CaretUp } from "./Icons";
import { createStyles } from "../helpers";
import { useAppStore } from "../api";

interface TimeDropdownProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export function TimeDropdown({ value, setValue }: TimeDropdownProps) {
  const defaultItems = [
    { label: "25 minutes", value: 25 },
    { label: "50 minutes", value: 50 },
    { label: "75 minutes", value: 75 },
    { label: "100 minutes", value: 100 },
  ];
  const [open, setOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const min = useAppStore((state) => state.minMinutes);
  const max = useAppStore((state) => state.maxMinutes);

  const numToString = (v: number) => {
    return v <= 0 ? "" : `${v}`;
  };
  const display = (v: number) => numToString(v) + " minutes";
  const parse = (t: string) => parseInt(t.replace(" minutes", ""), 10) || 0;

  const showError = () => (value < min || value > max) && !open;

  const styles = useStyles();

  // We put a TextInput and the Icons to toggle the dropdown on top
  // of the DropDownPicker to have complete control over the style of
  // the box and implement the search function ourselves.
  return (
    <View>
      <View>
        <TextInput
          style={styles.input}
          value={isFocus ? numToString(value) : display(value)}
          onChangeText={(t) => setValue(() => parse(t))}
          onFocus={() => {
            setValue(0);
            setIsFocus(true);
            setOpen(false);
          }}
          onEndEditing={() => {
            setIsFocus(false);
            if (value <= 0) setValue(25);
          }}
          keyboardType="numeric"
          maxLength={30}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={defaultItems}
          setOpen={setOpen}
          setValue={setValue}
          showTickIcon={false}
          containerStyle={styles.container}
          dropDownContainerStyle={styles.dropDownContainer}
          style={styles.dropDown}
          textStyle={styles.dropDownText}
          selectedItemLabelStyle={{
            fontWeight: "bold",
          }}
        />
        <Pressable style={styles.caret} onPress={() => setOpen(!open)}>
          {open ? (
            <CaretUp size={24} color={styles.caret.color!} />
          ) : (
            <CaretDown size={24} color={styles.caret.color!} />
          )}
        </Pressable>
      </View>
      {showError() ? (
        <Text style={styles.error}>
          Please enter between {min} and {max} minutes
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  input: {
    position: "absolute",
    width: 200,
    height: 50,
    borderRadius: 6,
    backgroundColor: theme.textColor,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    padding: 8,
    zIndex: 200,
  },
  container: {
    width: 200,
    zIndex: 100,
  },
  dropDownContainer: {
    borderWidth: 0,
  },
  dropDown: {
    borderWidth: 0,
  },
  dropDownText: {
    textAlign: "center",
    fontSize: theme.fontSizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryColor,
  },
  caret: {
    position: "absolute",
    width: 32,
    height: 50,
    top: 13,
    right: 0,
    color: theme.primaryColor,
    zIndex: 300,
  },
  error: {
    paddingTop: 8,
    width: 200,
    fontSize: theme.fontSizes.xs,
    color: theme.alertColor,
  },
}));
