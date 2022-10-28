import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";

import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { createStyles } from "../helpers";
import { loginUser } from "../api";

function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);

  const styles = useStyles();

  const validate = () => {
    // taken from https://stackoverflow.com/a/4964766
    const cond1 = /^\S+@\S+\.\S+$/.test(email);
    setValidEmail(cond1);
    if (cond1) {
      loginUser(email, password);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.heading}>Log in</Text>
        <Text style={styles.text}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        {validEmail ? null : (
          <Text style={styles.error}>Please enter a valid email</Text>
        )}
        <Text style={styles.text}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
      <View style={styles.switchPrompt}>
        <Text style={styles.switchPrompt.prompt}>Not a user yet?</Text>
        <Pressable onPress={() => navigation.navigate("SignupPage")}>
          <Text style={styles.switchPrompt.link}>Sign up</Text>
        </Pressable>
      </View>
      <CustomButton style={styles.button} onPress={validate}>
        Log in
      </CustomButton>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "flex-start",
  },
  heading: {
    marginTop: "10%",
    marginBottom: "10%",
    color: theme.primaryColor,
    fontSize: theme.fontSizes.lg,
  },
  text: {
    color: theme.textColor,
    fontSize: theme.fontSizes.sm,
    marginBottom: 8,
    marginTop: 24,
  },
  input: {
    width: "100%",
    padding: theme.fontSizes.xs,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: theme.fontSizes.sm,
    backgroundColor: theme.textColor,
    color: theme.muteColor,
  },
  switchPrompt: {
    marginTop: 24,
    marginBottom: 48,
    flexDirection: "row",
    prompt: {
      color: theme.primaryColor,
      fontSize: theme.fontSizes.sm,
      marginRight: 4,
    },
    link: {
      color: theme.primaryColor,
      fontSize: theme.fontSizes.sm,
      textDecorationLine: "underline",
    },
  },
  error: {
    color: theme.alertColor,
    fontSize: theme.fontSizes.xs,
  },
  button: {
    rippleColor: theme.backgroundColor,
  },
}));

export default LoginPage;
