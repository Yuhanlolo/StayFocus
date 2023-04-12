import {useState} from 'react';
import {Text, Pressable, View, Keyboard} from 'react-native';

import {createStyles} from '../helpers';
import {CustomButton, Screen, TimeDropdown, Gear} from '../components';
import {useAppStore, useSessionStore} from '../api';

//Home page to set focusing time

function HomePage({navigation}) {
  const [value, setValue] = useState(25);

  const newSession = useSessionStore(state => state.newSession);
  const minMinutes = useAppStore(state => state.minMinutes);
  const maxMinutes = useAppStore(state => state.maxMinutes);

  const onPress = () => {
    newSession('Focusing', value);
    // Unfocus the input before changing page, so that the
    // user sees if their input gets clamped to min or max
    Keyboard.dismiss();
    if (value >= minMinutes && value <= maxMinutes) {
      setTimeout(() => navigation.navigate('TimerPage'), 500);
    }
  };

  const styles = useStyles();
  return (
    <Screen>
      <View style={styles.iconContainer}>
        <Pressable onPress={navigation.toggleDrawer}>
          <Gear size={32} color={styles.icon.color!} />
        </Pressable>
      </View>
      <View style={styles.section1}>
        <Text style={styles.text}>I want to focus for</Text>
        <TimeDropdown value={value} setValue={setValue} />
      </View>
      <CustomButton
        styles={{button: styles.button, text: styles.buttonText}}
        onPress={onPress}>
        Start
      </CustomButton>
    </Screen>
  );
}

const useStyles = createStyles(theme => ({
  iconContainer: {
    width: '100%',
  },
  icon: {
    color: theme.primaryColor,
  },
  container: {
    alignItems: 'center',
    height: '100%',
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  section1: {
    marginTop: 40,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  text: {
    marginBottom: 12,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  button: {
    marginTop: 180,
    rippleColor: theme.backgroundColor,
    borderRadius: theme.fontSizes.md,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
  },
}));

export default HomePage;
