import {useEffect, useRef} from 'react';
import {Text} from 'react-native';

import {CustomButton, Screen} from '../components';
import {createStyles} from '../helpers';

function FocusEndedPage({navigation}) {
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

  return (
    <Screen>
      <Text style={styles.text}>Your focus session has ended.</Text>
      <CustomButton
        styles={{button: styles.button}}
        onPress={() => {
          pressed.current = true;
          navigation.navigate('HomePage');
        }}>
        Back to home
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
