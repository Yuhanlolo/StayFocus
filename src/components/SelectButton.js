import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { Svg, Path } from "react-native-svg";
import { ThemeContext } from "../helpers";

export function SelectButton(props) {
  const theme = useContext(ThemeContext);
  const data = props.data;
  const index = props.index || 0;

  return (
    <Pressable
      onPress={() => props.onChange((index + 1) % data.length)}
      style={[defaultStyles, props.style]}
    >
      <Svg height="12" width="16" fill={theme.secondaryColor}>
        <Path d="M4.932 5.432a.45.45 0 1 0 .636.636L7.5 4.136l1.932 1.932a.45.45 0 0 0 .636-.636l-2.25-2.25a.45.45 0 0 0-.636 0l-2.25 2.25Zm5.136 4.136a.45.45 0 0 0-.636-.636L7.5 10.864 5.568 8.932a.45.45 0 0 0-.636.636l2.25 2.25a.45.45 0 0 0 .636 0l2.25-2.25Z" />
      </Svg>
      <Text style={props.style.text}>{data[index].label}</Text>
    </Pressable>
  );
}

const defaultStyles = {
  backgroundColor: "transparent",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
};
