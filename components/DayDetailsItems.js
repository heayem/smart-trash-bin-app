import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, Alert } from "react-native";
import ScheduleService from "../services/ScheduleService/ScheduleService";
import { formatTimeString } from "../Helper/TimeConvert";
import Loading from "../components/MapComponent/Loading";
import NoData from "./NoData";

export const Schedule = ({ day, navigation }) => {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule(day);
  }, [day]);

  const fetchSchedule = async (day) => {
    setLoading(true);
    try {
      const result = await ScheduleService.getAll();
      if (result.success) {
        const daySchedule = result.data
          ? transformSchedule(result.data[day])
          : [];
        setSchedule(daySchedule);
      } else {
        setError(result.message || "Error fetching schedule");
      }
    } catch (err) {
      // Check if the error is related to network issues
      if (err.message.includes("Network Error")) {
        setError(
          "Network connection lost. Please check your internet connection."
        );
      } else {
        setError("Error fetching schedule: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const transformSchedule = (scheduleData) => {
    if (!scheduleData) return [];

    const keys = Object.keys(scheduleData);
    return keys
      .filter((key) => key.startsWith("title-"))
      .map((key) => {
        const index = key.split("-")[1];
        return {
          title: scheduleData[`title-${index}`] || "No title",
          description: scheduleData[`description-${index}`] || "No description",
          time: scheduleData[`time-${index}`] || "No time",
        };
      });
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  if (schedule.length === 0) {
    return <NoData fetchSchedule={fetchSchedule} day={day} />;
  }

  return (
    <View>
      <FlatList
        data={schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MainEvent
            title={item.title}
            description={item.description}
            time={item.time}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

const MainEvent = ({ title, description, time, navigation }) => (
  <View style={styles.scheduleContainer}>
    <Text style={styles.eventTitle}>{title}</Text>
    <Text style={styles.eventDescription}>{description}</Text>
    <Text style={styles.eventTime}>{formatTimeString(time)}</Text>
    <Text style={styles.mapDescription}>
      Check the map for detailed routes and bins to collect.
    </Text>
    <MapButton navigation={navigation} />
  </View>
);

const MapButton = ({ navigation }) => (
  <View style={styles.buttonContainer}>
    <Button
      title="Go to Map"
      onPress={() => navigation.navigate("Map")}
      color="#007AFF"
    />
  </View>
);

const styles = StyleSheet.create({
  scheduleContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  eventDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  eventTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  mapDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
});
