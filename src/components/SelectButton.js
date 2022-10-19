import { Pressable, Text, View } from "react-native";
import { Svg, Path } from "react-native-svg";
import { createStyles } from "../helpers";

export function SelectButton(props) {
  const data = props.data;
  const index = props.index || 0;

  const defaultStyles = useDefaultStyles();

  return (
    <View style={defaultStyles}>
      <Pressable
        onPress={() => props.onChange((index - 1 + data.length) % data.length)}
        style={[defaultStyles.button, props.style]}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={defaultStyles.button.width}
          height={defaultStyles.button.height}
          fill={defaultStyles.button.fill}
          viewBox="0 0 256 256"
        >
          <Path fill="none" d="M0 0h256v256H0z" />
          <Path
            fill="none"
            stroke={defaultStyles.button.fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={50}
            d="M40 128h176"
          />
        </Svg>
      </Pressable>
      <Text style={[defaultStyles.text, props.style.text]}>
        {data[index].label}
      </Text>
      <Pressable
        onPress={() => props.onChange((index + 1) % data.length)}
        style={[defaultStyles.button, props.style]}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={defaultStyles.button.width}
          height={defaultStyles.button.height}
          fill={defaultStyles.button.fill}
          viewBox="0 0 256 256"
        >
          <Path fill="none" d="M0 0h256v256H0z" />
          <Path
            fill="none"
            stroke={defaultStyles.button.fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={50}
            d="M40 128h176M128 40v176"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const useDefaultStyles = createStyles((theme) => ({
  backgroundColor: "transparent",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  button: {
    width: theme.fontSizes.xl,
    height: theme.fontSizes.xl,
    fill: theme.secondaryColor,
    marginLeft: theme.padding,
    marginRight: theme.padding,
  },
  text: {
    textAlign: "center",
  },
}));
