import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatTimeString } from "../../Helper/TimeConvert";
import Mapbutton from "./MapButton"; 

const MainEvent = ({ event, navigation, removeEvent }) => (
  <View style={styles.scheduleContainer}>
    <Text style={styles.eventTitle}>{event.title}</Text>
    <Text style={styles.eventDescription}>{event.description}</Text>
    <Text style={styles.eventTime}>{formatTimeString(event.time)}</Text>
    <Text style={styles.mapDescription}>
      Check the map for detailed routes and bins to collect.
    </Text>
    <Mapbutton navigation={navigation} />
    <TouchableOpacity
      style={styles.removeButton}
      onPress={removeEvent}
    >
      <Ionicons name="remove-circle-sharp" size={18} color="#ffb2a2" />
    </TouchableOpacity>
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
  removeButton: {
    position: "absolute",
    right: 5,
    top: 5,
  },
});


export default MainEvent;
