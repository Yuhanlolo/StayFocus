import {useState} from 'react';
import {Text} from 'react-native';
import DatePicker from 'react-native-date-picker';

import {CustomButton, TimeDropdown} from '../../components';
import {createStyles} from '../../helpers';
import SettingsScreen from './SettingsScreen';
import {saveSettings, setReminder} from '../../api';

export default function SettingsPage({navigation}) {
  const [minutes, setMinutes] = useState(25);
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  const [date, setDate] = useState(d);
  const [saved, setSaved] = useState(false);

  const onBack = () => {
    navigation.navigate('Home');
  };

  const getTime = (d : String) => {
    let hour = d.substring(12,14);
    let minTxt = d.substring(15,17);
    let hourNum = Number(hour) + 8;
    let hourTxt = hourNum.toString();
    let time = hourTxt + ':' + minTxt;
    return time;
  }

  const onConfirm = () => {
    saveSettings(minutes, date);
    setReminder(date);
    setSaved(true);
    // pretty sure this is a race condition somehow
    setTimeout(() => setSaved(false), 3000);
  };

  const styles = useStyles();

  return (
    <SettingsScreen title="Settings" onBack={onBack}>
      <Text style={styles.text}>
        For each day, I plan to focus for at least: {minutes} mins
      </Text>
      <TimeDropdown value={minutes} setValue={setMinutes} />
      <Text style={styles.text2}>I want to be reminded at</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="time"
        androidVariant="nativeAndroid"
        textColor="#ffffff"
      />
      <Text style={styles.text2current}>Current reminder time: {getTime(JSON.stringify(date))}</Text>
      <CustomButton
        onPress={onConfirm}
        styles={{button: styles.button, text: styles.buttonText}}>
        Confirm
      </CustomButton>
      {saved && (
        <Text style={styles.textSaved}>Your settings have been saved</Text>
      )}
    </SettingsScreen>
  );
}

const useStyles = createStyles(theme => ({
  text: {
    width: '80%',
    marginTop: 10,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  text2: {
    width: '80%',
    marginTop: 170,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  text2current: {
    width: '80%',
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.primaryColor,
    rippleColor: theme.secondaryColor,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
  },
  textSaved: {
    fontSize: theme.fontSizes.xs,
    textAlign: 'center',
    marginTop: 12,
    color: theme.textColor,
  },
}));
