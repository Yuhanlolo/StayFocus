import React, { useState, useCallback, useEffect, useRef } from 'react';
import {Text} from 'react-native';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';

import {CustomButton, Screen} from '../components';
import {createStyles} from '../helpers';

function FocusEndedPage({route, navigation}) {

  const [timeString, setTimeString] = useState('');

  let pressed = useRef(false);

  const styles = useStyles();

  // Prevent going back to timer screen
  // Taken from https://reactnavigation.org/docs/preventing-going-back
  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!pressed.current) {
          e.preventDefault();
        }
      }),
    [navigation],
  );

  useFocusEffect(React.useCallback(() => {
    let timeString = route.params.timeString;
    setTimeString(timeString);
	}, []));

  return (
    <Screen>
      <Text style={styles.text}>Your focus session has ended.</Text>
      <CustomButton
        styles={{button: styles.button}}
        onPress={() => {
          pressed.current = true;
          navigation.navigate('ChatRefEndPage', {timeString: timeString});
        }}>
        Quick Reflection
      </CustomButton>
    </Screen>
  );
}

const useStyles = createStyles(theme => ({
  text: {
    marginTop: '70%',
    marginBottom: '10%',
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
  },
  button: {
    rippleColor: theme.backgroundColor,
  },
  modal: {
    justifyContent: 'center',
  },
}));

export default FocusEndedPage;
