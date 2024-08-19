import React, { useEffect } from "react";
import Navigator from "./routes/HomeStack";
import { database, ref, get } from "./firebaseConfig";
import * as Notifications from "expo-notifications";

const App = () => {
  useEffect(() => {
    const fetchAndSchedule = async () => {
      try {
        const dbRef = ref(database, "notification");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const notifications = snapshot.val();
          console.log("Fetched notifications:", notifications); // Debugging
          scheduleNotifications(notifications);
        } else {
          console.log("No notifications data available");
        }
      } catch (error) {
        console.error("Error fetching notifications data:", error);
      }
    };

    fetchAndSchedule();
  }, []);

  const scheduleNotifications = (notifications) => {
    console.log("Scheduling notifications for each event"); // Debugging
    for (const day in notifications) {
      const events = notifications[day];
      for (const eventId in events) {
        const event = events[eventId];
        scheduleNotification(event);
      }
    }
  };

  const scheduleNotification = async (event) => {
    console.log("Scheduling event:", event); // Debugging
    const timeParts = event.time.split(" ");
    const [hours, minutes] = timeParts[0].split(":").map(Number);
    const amPm = timeParts[1];

    const now = new Date();
    let notificationTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      amPm === "PM" && hours !== 12 ? hours + 12 : (amPm === "AM" && hours === 12 ? 0 : hours),
      minutes,
      0
    );

    if (notificationTime < now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    console.log(`Notification time set to: ${notificationTime}`); 

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
      console.log(`Notification scheduled for ${event.title} at ${notificationTime}`);
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  return <Navigator />;
};

export default App;
