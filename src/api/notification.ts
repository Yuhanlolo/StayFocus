import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";
import { AppState } from "react-native";

// Request permissions (required for iOS)
notifee.requestPermission();

export function setReminder(date: Date) {
  notifee.cancelAllNotifications();
  onReminderNotification(date);
}

async function onReminderNotification(date: Date) {
  if (date <= new Date()) date.setDate(date.getDate() + 1);
  console.log(date.toString());

  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
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
      id: "123",
      title: "StayFocused",
      body: "Ready to focus? Set your focusing goal now!",
      android: {
        channelId: channelId,
        pressAction: {
          id: "default",
        },
      },
    },
    trigger
  );
}

const notificationId = "184594917";

AppState.addEventListener("change", async (nextAppState) => {
  /*
    If app is opened, check if the end-of-session trigger notification 
    is still pending. If yes, then the session continues; if no, then 
    the session has ended.

    The correct way seems to be using notifee.onBackgroundEvent() event 
    listener, but that method is super unreliable for some reasons. See 
    https://github.com/invertase/notifee/issues/404 for more details.
  */
  if (nextAppState.match(/active/)) {
    const pending = await notifee.getTriggerNotificationIds();
    if (pending.includes(notificationId)) {
      console.log("Ongoing");
    } else {
      console.log("Ended");
    }
    notifee.cancelNotification(notificationId);
  }
});

export async function onLeaveFocusNotification() {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });
  const timeoutSecond = 10;
  const timeoutMillisecond = timeoutSecond * 1000 + 500;

  // Display a notification immediately and create a trigger
  // notification, set to be displayed 10 seconds from this moment.
  notifee.displayNotification({
    id: notificationId,
    title: "StayFocused",
    body: `Focus mode will end in ${timeoutSecond} seconds. Tap here to go back to StayFocus`,
    data: {
      focusStatus: "ongoing",
    },
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      showChronometer: true,
      chronometerDirection: "down",
      timestamp: Date.now() + timeoutMillisecond,
    },
  });

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
      title: "StayFocused",
      body: "Focus mode has ended. Tap here to go back to StayFocus",
      data: {
        focusStatus: "ended",
      },
      android: {
        channelId: channelId,
        pressAction: {
          id: "default",
        },
      },
    },
    trigger
  );
}

export function clearNotification() {
  notifee.cancelNotification(notificationId);
}
