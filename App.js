import Navigator from "./routes/HomeStack";
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notificationListener, setNotificationListener] = useState(null);
  const [responseListener, setResponseListener] = useState(null);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Set up notification listeners
    const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
      // console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    setNotificationListener(notificationSubscription);
    setResponseListener(responseSubscription);

    // Schedule frequent notifications
    scheduleFrequentNotification();

    return () => {
      if (notificationListener) notificationListener.remove();
      if (responseListener) responseListener.remove();
    };
  }, []);

  return <Navigator />;
}

async function registerForPushNotificationsAsync() {
  if (!Constants.isDevice) {
    Alert.alert('Notification Test', 'Must use a physical device for push notifications');
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Notification Test', 'Failed to get push token for push notification!');
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo push token:', token);
  return token;
}

async function scheduleFrequentNotification() {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Frequent Reminder!",
        body: 'This is your 1-minute reminder.',
      },
      trigger: {
        seconds: 60, // 1 minute
        repeats: true,
      },
    });
    console.log("Frequent notification scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling frequent notification:", error);
  }
}

