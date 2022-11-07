import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

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

  return await notifee.createTriggerNotification(
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

export async function onLeaveFocusNotification() {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // Display a notification
  await notifee.displayNotification({
    title: "StayFocused",
    body: "Focus mode will end in 10 seconds. Tap here to go back to StayFocus",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
}
