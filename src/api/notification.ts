import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';

// Request permissions (required for iOS)
notifee.requestPermission();

// Default reminder (08:00)
const d = new Date();
d.setHours(8, 0, 0, 0);
setReminder(d);

export function setReminder(date: Date) {
  notifee.cancelAllNotifications();
  onReminderNotification(date);
}

async function onReminderNotification(date: Date) {
  if (date <= new Date()) date.setDate(date.getDate() + 1);
  console.log(date.toString());

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  await notifee.createTriggerNotification(
    {
      id: '123',
      title: 'StayFocused',
      body: 'Ready to focus? Set your focusing goal now!',
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );
}

export const notificationId = '184594917';

export async function onLeaveFocusNotification(
  enable: React.MutableRefObject<boolean>,
) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  const timeoutSecond = 10;
  const timeoutMillisecond = timeoutSecond * 1000 + 500;

  // Display a notification immediately and create a trigger
  // notification, set to be displayed 10 seconds from this moment.
  // BackgroundTimer.start();
  let t = timeoutSecond;
  BackgroundTimer.start();
  notification_control = true;
  const intervalId: string = BackgroundTimer.setInterval(() => {
    console.log(`timeout ${t}`);
    if (t > 0 && notification_control == true) {
      if (enable.current && notification_control == true) {
        notifee.displayNotification({
          id: notificationId,
          title: 'StayFocused',
          body: `Focus mode will end in ${t} seconds. Tap here to go back to StayFocus`,
          data: {
            focusStatus: 'ongoing',
          },
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'default',
            },
          },
        });
      }
      t = t - 1;
    } else {
      t = 10;
      BackgroundTimer.clearInterval(intervalId);
    }
  }, 1000);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: new Date().getTime() + timeoutMillisecond,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: 'StayFocused',
      body: 'Focus mode has ended. Tap here to go back to StayFocus',
      data: {
        focusStatus: 'ended',
      },
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );
}

export function clearNotification() {
  notifee.cancelNotification(notificationId);
}
