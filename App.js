import React, { useEffect, useState } from "react";
import Navigator from "./routes/HomeStack";
import LoginScreen from "./screens/Login";
import WelcomeScreen from "./screens/Welcome";
import { database, ref, get } from "./firebaseConfig";
import * as Notifications from "expo-notifications";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  useEffect(() => {
    if (isWelcomeScreen) {
      // Automatically hide welcome screen after a few seconds
      const timer = setTimeout(() => setIsWelcomeScreen(false), 3000);
      return () => clearTimeout(timer);
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchAndSchedule();
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, [isWelcomeScreen]);

  const fetchAndSchedule = async () => {
    try {
      const dbRef = ref(database, "notification");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const notifications = snapshot.val();
        scheduleNotifications(notifications);
      }
    } catch {
      // Handle error as needed
    }
  };

  const scheduleNotifications = (notifications) => {
    for (const day in notifications) {
      const events = notifications[day];
      for (const eventId in events) {
        const event = events[eventId];
        scheduleNotification(event);
      }
    }
  };

  const scheduleNotification = async (event) => {
    const [time, amPm] = event.time.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();
    let notificationTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      amPm === "PM" && hours !== 12
        ? hours + 12
        : amPm === "AM" && hours === 12
        ? 0
        : hours,
      minutes,
      0
    );

    if (notificationTime < now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: event.title,
          body: event.description,
        },
        trigger: {
          date: notificationTime,
        },
      });
    } catch {
      // Handle error as needed
    }
  };

  if (isWelcomeScreen) {
    return <WelcomeScreen />;
  }

  if (isAuthenticated === null) {
    // Optionally, you can return a loading indicator or similar here
    return null;
  }

  return isAuthenticated ? <Navigator /> : <LoginScreen />;
};

export default App;
