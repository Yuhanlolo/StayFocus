import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useAppStore } from "../api";

import { createStyles } from "../helpers";

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
  const [items, setItems] = useState(defaultItems);

  const min = useAppStore((state) => state.minMinutes);
  const max = useAppStore((state) => state.maxMinutes);

  // Put the new item first in the dropdown list
  const insertItem = (text: string) => {
    if (text.length > 0) {
      const value = parseInt(text, 10);
      if (min <= value && value <= max)
        setItems([{ label: `${text} minutes`, value: value }, ...defaultItems]);
    } else {
      setItems(defaultItems);
    }
  };
  const styles = useStyles();

  return (
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
      translation={{
        NOTHING_TO_SHOW: `Enter between ${min} and ${max} minutes`,
      }}
    />
  );
}

const useStyles = createStyles((theme) => ({
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
}));
