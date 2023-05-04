import {Text} from 'react-native';

import {CustomButton, Screen} from '../components';
import {createStyles} from '../helpers';

//When finish the focusing task, this page come out for congrats.

function SuccessPage({navigation}) {
  const styles = useStyles();

  return (
    <Screen>
      <Text style={styles.text}>
        Congrats! You have completed this focus session.
      </Text>
      <CustomButton
        styles={{button: styles.button}}
        onPress={() => 
        {navigation.navigate('HomePage');}}>
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

export default SuccessPage;
