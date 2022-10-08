import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles, secondsToHHMMSS } from "../helpers";
import { CustomButton } from "../components/CustomButton";

function TimerPage({ route, navigation }) {
  const styles = useStyles();

  const { minutes, plan } = route.params;
  const [seconds, setSeconds] = useState(minutes * 60);

  const timeString = (secs, showHour) => {
    const [h, m, s] = secondsToHHMMSS(secs);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return showHour ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton style={styles.button}>Give up</CustomButton>
      <Text style={styles.plan}>{plan}</Text>
      <Text style={styles.timer}>{timeString(seconds, minutes > 60)}</Text>
    </SafeAreaView>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  button: {
    marginTop: "20%",
    text: {
      fontSize: theme.fontSizes.md,
    },
  },
  plan: {
    marginTop: "50%",
    color: theme.muteColor,
    fontSize: theme.fontSizes.lg,
    fontWeight: "500",
    textAlign: "center",
  },
  timer: {
    width: "100%",
    color: theme.secondaryColor,
    fontWeight: "700",
    fontSize: theme.fontSizes.huge * 2.25,
    textAlign: "center",
  },
}));

export default TimerPage;
