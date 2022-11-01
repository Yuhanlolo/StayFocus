import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

import { createStyles } from "../helpers";

export function TimeDropdown({ value, setValue }) {
  const defaultItems = [
    { label: "25 minutes", value: 25 },
    { label: "50 minutes", value: 50 },
    { label: "75 minutes", value: 75 },
    { label: "100 minutes", value: 100 },
  ];
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(defaultItems);

  // Put the new item first in the dropdown list
  const insertItem = (text: string) => {
    if (text.length > 0) {
      setItems([
        { label: `${text} minutes`, value: parseInt(text, 10) },
        ...defaultItems,
      ]);
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
