import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

import {getAnalyticsData, useAppStore} from '../../api';
import {CaretLeft, CaretRight} from '../../components';
import {createStyles, dateToYYYYMMDD} from '../../helpers';
import SettingsScreen from './SettingsScreen';

export default function LogPage({navigation}) {
  const dateCreated = new Date(
    (useAppStore(state => state.dateCreated) || new Date()).valueOf(),
  );
  const today = new Date();
  dateCreated.setHours(12, 0, 0, 0);
  today.setHours(12, 0, 0, 0);
  const [date, setDate] = useState(today);
  const [enabled, setEnabled] = useState([
    dateCreated.getTime() < today.getTime(),
    false,
  ]);

  const styles = useStyles(enabled);

  // Who the heck designed this abomination of an API
  const moveBackOneDay = () => {
    const yesterday = new Date(date.valueOf());
    yesterday.setDate(date.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    setEnabled([yesterday.getTime() > dateCreated.getTime(), true]);
    setDate(yesterday);
  };

  const moveForwardOneDay = () => {
    const tomorrow = new Date(date.valueOf());
    tomorrow.setDate(date.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    setEnabled([true, tomorrow.getTime() < today.getTime()]);
    setDate(tomorrow);
  };

  const data = getAnalyticsData(dateToYYYYMMDD(date));

  return (
    <SettingsScreen
      title="Focusing Log"
      onBack={() => navigation.navigate('Home')}>
      <View style={styles.dateContainer}>
        <Pressable onPress={moveBackOneDay} disabled={!enabled[0]}>
          <CaretLeft
            size={styles.arrowLeft.width}
            color={styles.arrowLeft.color}
          />
        </Pressable>
        <Text style={styles.dateText}>{dateToYYYYMMDD(date)}</Text>
        <Pressable onPress={moveForwardOneDay} disabled={!enabled[1]}>
          <CaretRight
            size={styles.arrowRight.width}
            color={styles.arrowRight.color}
          />
        </Pressable>
      </View>
      <Text style={styles.text}>
        You completed{' '}
        <Text style={{fontWeight: '700'}}>{data.sessionsCount}</Text> focus
        sessions.
      </Text>
      <Text style={styles.text}>
        You stayed focused for{' '}
        <Text style={{fontWeight: '700'}}>{data.sessionsMinutes}</Text> minutes.
      </Text>
      <Text style={styles.text}>
        The last focus session ended at{' '}
        <Text style={{fontWeight: '700'}}>
          {data.lastSessionEndTime.substring(11, 16)}
        </Text>
        .
      </Text>
    </SettingsScreen>
  );
}

const useStyles = createStyles((theme, enabled: boolean[]) => ({
  dateContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
  dateText: {
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
  },
  arrowLeft: {
    width: 32,
    color: enabled[0] ? theme.primaryColor : theme.secondaryColor,
  },
  arrowRight: {
    width: 32,
    color: enabled[1] ? theme.primaryColor : theme.secondaryColor,
  },
  text: {
    width: '80%',
    marginTop: 40,
    marginBottom: 20,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
  },
}));
