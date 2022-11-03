import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";

import { CustomButton, Screen } from "../components";
import { createStyles } from "../helpers";
import { loginUser } from "../api";

function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const styles = useStyles();

  const login = async () => {
    const [ok, _errorMsg] = await loginUser(email, password);
    setAuthError(!ok);
    if (!ok) setErrorMsg(_errorMsg);
  };

  return (
    <Screen styles={styles.screen}>
      <View>
        <Text style={styles.heading}>Log in</Text>
        <Text style={styles.text}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <Text style={styles.text}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
      {authError ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <View style={styles.switch}>
        <Text style={styles.switchPrompt}>Not a user yet?</Text>
        <Pressable onPress={() => navigation.navigate("SignupPage")}>
          <Text style={styles.switchLink}>Sign up</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          styles={{ button: styles.button, text: styles.buttonText }}
          onPress={login}
        >
          Log in
        </CustomButton>
      </View>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  screen: {
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: "stretch",
  },
  heading: {
    marginTop: 20,
    marginBottom: 60,
    color: theme.primaryColor,
    fontSize: theme.fontSizes.xl,
  },
  text: {
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    marginBottom: 12,
  },
  input: {
    padding: 8,
    marginBottom: 24,
    borderRadius: 8,
    fontSize: theme.fontSizes.md,
    backgroundColor: theme.textColor,
    color: theme.muteColor,
  },
  switch: {
    marginTop: 12,
    marginBottom: 80,
    flexDirection: "row",
  },
  switchPrompt: {
    color: theme.primaryColor,
    fontSize: theme.fontSizes.sm,
    marginRight: 6,
  },
  switchLink: {
    color: theme.primaryColor,
    fontSize: theme.fontSizes.sm,
    textDecorationLine: "underline",
  },
  error: {
    color: theme.alertColor,
    fontSize: theme.fontSizes.xs,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    rippleColor: theme.backgroundColor,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
  },
}));

export default LoginPage;
