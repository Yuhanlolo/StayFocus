import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import {getAnalyticsData} from '../../api';
import {createStyles, dateToYYYYMMDD} from '../../helpers';
import SettingsScreen from './SettingsScreen';

export default function LogPage({navigation}) {
  const dateCreated = new Date(
    useAppStore(state => state.dateCreated)!.valueOf(),
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
    setDate(yesterday);
  };

  const moveForwardOneDay = () => {
    const yesterday = new Date(date.valueOf());
    yesterday.setDate(date.getDate() + 1);
    setDate(yesterday);
  };

  const data = getAnalyticsData(dateToYYYYMMDD(date));

  return (
    <SettingsScreen
      title="Focusing Log"
      onBack={() => navigation.navigate('Home')}>
      <View style={styles.dateContainer}>
        <Pressable onPress={moveBackOneDay}>
          <Svg
            width={styles.arrows.width}
            height={styles.arrows.width}
            fill={styles.arrows.color}
            viewBox="0 0 256 256">
            <Path fill="none" d="M0 0h256v256H0z" />
            <Path
              fill="none"
              stroke={styles.arrows.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="m160 208-80-80 80-80"
            />
          </Svg>
        </Pressable>
        <Text style={styles.dateText}>{dateToYYYYMMDD(date)}</Text>
        <Pressable onPress={moveForwardOneDay}>
          <Svg
            width={styles.arrows.width}
            height={styles.arrows.width}
            fill={styles.arrows.color}
            viewBox="0 0 256 256">
            <Path fill="none" d="M0 0h256v256H0z" />
            <Path
              fill="none"
              stroke={styles.arrows.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="m96 48 80 80-80 80"
            />
          </Svg>
        </Pressable>
      </View>
      <Text style={styles.text}>
        Sessions started:{' '}
        <Text style={{fontWeight: '700'}}>{data.sessionsCount}</Text>
      </Text>
      <Text style={styles.text}>
        Sessions completed:{' '}
        <Text style={{fontWeight: '700'}}>{data.completedSessionsCount}</Text>
      </Text>
      <Text style={styles.text}>
        Total focus duration:{' '}
        <Text style={{fontWeight: '700'}}>{data.focusMinutes}</Text> minutes
      </Text>
      <Text style={styles.text}>
        Last focus session ended at{' '}
        <Text style={{fontWeight: '700'}}>
          {data.lastSessionEndTime.substring(11, 16)}
        </Text>
        .
      </Text>
    </SettingsScreen>
  );
}

const useStyles = createStyles(theme => ({
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
  arrows: {
    width: 32,
    color: theme.primaryColor,
  },
  text: {
    width: '80%',
    marginTop: 40,
    marginBottom: 20,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
  },
}));
