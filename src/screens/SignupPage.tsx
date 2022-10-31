import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";

import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { createStyles } from "../helpers";
import { createUser } from "../api";

function SignupPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({
    email: true,
    username: true,
    password: true,
  });

  const styles = useStyles();

  const validate = () => {
    // taken from https://stackoverflow.com/a/4964766
    const validEmail = /^\S+@\S+\.\S+$/.test(email);
    const validUsername = password.length > 0;
    const validPassword = password.length >= 6;
    setValidation({
      email: validEmail,
      username: validUsername,
      password: validPassword,
    });
    if (validEmail && validUsername && validPassword) {
      createUser(email, username, password);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.heading}>Sign up</Text>
        <Text style={styles.text}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        {validation.email ? null : (
          <Text style={styles.error}>Please enter a valid email</Text>
        )}
        <Text style={styles.text}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        {validation.username ? null : (
          <Text style={styles.error}>Please enter at least 1 character</Text>
        )}
        <Text style={styles.text}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        {validation.password ? null : (
          <Text style={styles.error}>Please enter at least 6 characters</Text>
        )}
      </View>
      <View style={styles.switch}>
        <Text style={styles.switchPrompt}>Already a user?</Text>
        <Pressable onPress={() => navigation.navigate("LoginPage")}>
          <Text style={styles.switchLink}>Log in</Text>
        </Pressable>
      </View>
      <CustomButton styles={{ button: styles.button }} onPress={validate}>
        Sign up
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
    marginTop: 16,
  },
  input: {
    width: "100%",
    padding: theme.fontSizes.xs,
    marginBottom: 4,
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

export default SignupPage;
