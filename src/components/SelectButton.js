import { Pressable, TextInput, View } from "react-native";
import { Svg, Path } from "react-native-svg";
import { createStyles } from "../helpers";

export function SelectButton(props) {
  const value = props.value;
  const defaultStyles = useDefaultStyles();

  const decrease = () => {
    const newValue =
      props.min +
      (Math.ceil((value - props.min) / props.step) - 1) * props.step;
    if (newValue >= props.min) props.onChange(newValue);
  };

  const increase = () => {
    const newValue =
      props.max -
      (Math.ceil((props.max - value) / props.step) - 1) * props.step;
    if (newValue <= props.max) props.onChange(newValue);
  };

  const onChangeText = (text) => {
    props.onChange(text);
  };

  const onEndEditing = (e) => {
    const newValue = parseInt(e.nativeEvent.text, 10);
    if (newValue >= props.min && newValue <= props.max) {
      props.onChange(e.nativeEvent.text);
    } else if (newValue > props.max) {
      props.onChange(props.max);
    } else {
      props.onChange(props.min);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.form}>
        <Pressable
          onPress={decrease}
          pressRetentionOffset={200}
          style={[defaultStyles.button, props.style]}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            fill={defaultStyles.button.fill}
            viewBox="0 0 256 256"
          >
            <Path fill="none" d="M0 0h256v256H0z" />
            <Path
              fill="none"
              stroke={defaultStyles.button.fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M40 128h176"
            />
          </Svg>
        </Pressable>
        <TextInput
          keyboardType="numeric"
          onEndEditing={onEndEditing}
          onChangeText={onChangeText}
          style={[defaultStyles.textInput, props.style.textInput]}
        >
          {value}
        </TextInput>
        <Pressable
          onPress={increase}
          pressRetentionOffset={100}
          style={[defaultStyles.button, props.style]}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            fill={defaultStyles.button.fill}
            viewBox="0 0 256 256"
          >
            <Path fill="none" d="M0 0h256v256H0z" />
            <Path
              fill="none"
              stroke={defaultStyles.button.fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M40 128h176M128 40v176"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const useDefaultStyles = createStyles((theme) => ({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 2 * theme.fontSizes.xl,
    fill: theme.primaryColor,
  },
  textInput: {
    textAlign: "center",
  },
}));
