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
      <CustomButton styles={{ button: styles.button }} onPress={login}>
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
  switch: {
    marginTop: 24,
    marginBottom: 48,
    flexDirection: "row",
  },
  switchPrompt: {
    color: theme.primaryColor,
    fontSize: theme.fontSizes.sm,
    marginRight: 4,
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
  button: {
    rippleColor: theme.backgroundColor,
  },
}));

export default LoginPage;
