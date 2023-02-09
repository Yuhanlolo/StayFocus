import {Text} from 'react-native';

import {createStyles} from '../../helpers';
import SettingsScreen from './SettingsScreen';

export default function AboutPage({navigation}) {
  const styles = useStyles();

  return (
    <SettingsScreen
      title="About StayFocus"
      onBack={() => navigation.navigate('Home')}>
      <Text style={styles.text}>Instruction</Text>
      <Text style={styles.text}>Privacy and Data Collection</Text>
    </SettingsScreen>
  );
}

const useStyles = createStyles(theme => ({
  text: {
    width: '80%',
    marginTop: 60,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
}));
