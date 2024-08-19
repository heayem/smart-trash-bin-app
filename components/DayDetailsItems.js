import React, { useState, useEffect } from "react";
import { View,FlatList, Alert, StyleSheet} from "react-native";
import ScheduleService from "../services/ScheduleService/ScheduleService";
import Loading from "./Loading";
import DayNoData from "./DayNoData";
import MainEvent from "./ScheduleComponents/MainEvent";

export const Schedule = ({ day, navigation }) => {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = ScheduleService.listenForData(day, (response) => {
      if (response.success) {
        const daySchedule = response.data ? transformSchedule(response.data) : [];
        setSchedule(daySchedule);
      } else {
        setError(response.message);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe(); 
      }
    };
  }, [day]);

  

  const transformSchedule = (scheduleData) => {
    if (!scheduleData) return [];

    return Object.keys(scheduleData).map((key) => {
      const event = scheduleData[key];
      return {
        id: key,
        title: event.title || "No title",
        description: event.description || "No description",
        time: event.time || "No time",
      };
    });
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: () => navigation.goBack() }]);
    }
  }, [error]);

  const confirmRemoval = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirm Removal",
        "Are you sure you want to delete this event?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { text: "Delete", onPress: () => resolve(true), style: "destructive" },
        ]
      );
    });
  };

  const handleRemoveEvent = async (eventId) => {
    if (!eventId) {
      Alert.alert("Error", "Failed to delete event. Please try again.");
      return;
    }

    const confirmed = await confirmRemoval();
    if (confirmed) {
      removeEvent(day, eventId);
    }
  };

  const removeEvent = async (day, eventId) => {
    try {
      const deletionResult = await ScheduleService.remove(day, eventId);
      if (deletionResult.success) {
        const updatedSchedule = schedule.filter((event) => event.id !== eventId);
        setSchedule(updatedSchedule);
        Alert.alert("Success", "Event deleted successfully.");
      } else {
        Alert.alert("Error", deletionResult.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (schedule.length === 0) {
    return <DayNoData fetchSchedule={() => {}} day={day} />;
  }

  return (
    <View>
      
      <FlatList
        style={styles.container}
        data={schedule}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MainEvent
            event={item}
            navigation={navigation}
            removeEvent={() => handleRemoveEvent(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
})


