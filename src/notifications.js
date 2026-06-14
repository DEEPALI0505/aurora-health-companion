// Aurora Notification Service
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('aurora-health', {
      name: 'Aurora Health',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00F5D4',
    });
  }
  return true;
}

export async function scheduleWaterReminders(intervalHours = 1, enabled = true) {
  // Cancel all existing water reminders
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'water') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  if (!enabled) return;

  const messages = [
    { title: 'Time to drink water 💧', body: "Stay hydrated and healthy. You're one glass away from your goal!" },
    { title: "Hydration check! 💧", body: "Your body needs water. Keep that streak going!" },
    { title: "Water o'clock 💧", body: "Quick reminder to stay hydrated. Aurora is watching out for you!" },
    { title: "Don't forget to hydrate 💧", body: "Small sips through the day = big energy boost!" },
  ];

  // Schedule repeating water notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to drink water 💧',
      body: `Stay hydrated and healthy. Drink water every ${intervalHours} hour${intervalHours > 1 ? 's' : ''}!`,
      data: { type: 'water' },
      color: '#00F5D4',
    },
    trigger: {
      seconds: intervalHours * 3600,
      repeats: true,
      channelId: 'aurora-health',
    },
  });
}

export async function scheduleSleepReminder(enabled = true) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'sleep') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  if (!enabled) return;

  // 10:30 PM bedtime reminder
  const trigger = new Date();
  trigger.setHours(22, 30, 0, 0);
  if (trigger < new Date()) trigger.setDate(trigger.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bedtime soon 🌙',
      body: 'You usually begin your bedtime routine around this time. Wind down for better sleep!',
      data: { type: 'sleep' },
      color: '#B197FC',
    },
    trigger: { date: trigger, repeats: true, channelId: 'aurora-health' },
  });
}

export async function scheduleHabitReminders(enabled = true) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'habit') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  if (!enabled) return;

  // Morning reminder 7 AM
  const morning = new Date();
  morning.setHours(7, 0, 0, 0);
  if (morning < new Date()) morning.setDate(morning.getDate() + 1);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good morning! ⚡",
      body: "Start your day strong. Your morning habits are waiting!",
      data: { type: 'habit' },
      color: '#00F5D4',
    },
    trigger: { date: morning, repeats: true, channelId: 'aurora-health' },
  });

  // Evening reminder 8 PM
  const evening = new Date();
  evening.setHours(20, 0, 0, 0);
  if (evening < new Date()) evening.setDate(evening.getDate() + 1);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Evening habits ⚡",
      body: "Don't break the streak! Complete your remaining habits before bed.",
      data: { type: 'habit' },
      color: '#00F5D4',
    },
    trigger: { date: evening, repeats: true, channelId: 'aurora-health' },
  });
}

export async function scheduleDailyInsight(enabled = true) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'insight') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  if (!enabled) return;

  const morning = new Date();
  morning.setHours(8, 0, 0, 0);
  if (morning < new Date()) morning.setDate(morning.getDate() + 1);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✦ Your daily health insight',
      body: 'A new personalized insight from Aurora is ready. Tap to see!',
      data: { type: 'insight' },
      color: '#FFD97D',
    },
    trigger: { date: morning, repeats: true, channelId: 'aurora-health' },
  });
}

export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to drink water 💧',
      body: "Stay hydrated and healthy. You're 750ml away from your goal!",
      data: { type: 'water' },
      color: '#00F5D4',
    },
    trigger: null, // send immediately
  });
}
