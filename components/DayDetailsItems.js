import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const dayConfig = {
  Monday: {
    startTime: '5:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '5:00 AM - Collect trash',
    additionalEvents: [{ title: 'Meeting', description: '4:00 PM - Team meeting' }],
  },
  Tuesday: {
    startTime: '6:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '6:00 AM - Collect trash',
    additionalEvents: [{ title: 'Inspection', description: '3:00 PM - Equipment inspection' }],
  },
  Wednesday: {
    startTime: '6:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '6:00 AM - Collect trash',
    additionalEvents: [{ title: 'Inspection', description: '3:00 PM - Equipment inspection' }],
  },
  Thursday: {
    startTime: '6:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '6:00 AM - Collect trash',
    additionalEvents: [{ title: 'Inspection', description: '3:00 PM - Equipment inspection' }],
  },
  Friday: {
    startTime: '6:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '6:00 AM - Collect trash',
    additionalEvents: [{ title: 'Inspection', description: '3:00 PM - Equipment inspection' }],
  },
  Saturday: {
    startTime: '6:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '6:00 AM - Collect trash',
    additionalEvents: [{ title: 'Inspection', description: '3:00 PM - Equipment inspection' }],
  },
  Sunday: {
    startTime: '7:00 AM',
    mainEvent: 'Collect Trash',
    mainDescription: '7:00 AM - Collect trash',
    additionalEvents: [{ title: 'Maintenance', description: '5:00 PM - Vehicle maintenance' }],
  },
};

export const Schedule = ({ day, navigation }) => {
  const config = dayConfig[day] || {};
  const { startTime, mainEvent, mainDescription, additionalEvents } = config;

  return (
    <>
      <MainEvent title={mainEvent} description={mainDescription} navigation={navigation} />
      {additionalEvents && additionalEvents.map((event, index) => (
        <Event key={index} title={event.title} description={event.description} />
      ))}
    </>
  );
};

export const MainEvent = ({ title, description, navigation }) => (
  <View style={styles.scheduleContainer}>
    <Text style={styles.eventTitle}>{title}</Text>
    <Text style={styles.eventDescription}>{description}</Text>
    <Text style={styles.mapDescription}>Check the map for detailed routes and bins to collect.</Text>
    <MapButton navigation={navigation} />
  </View>
);

export const Event = ({ title, description }) => (
  <View style={styles.scheduleContainer}>
    <Text style={styles.eventTitle}>{title}</Text>
    <Text style={styles.eventDescription}>{description}</Text>
  </View>
);

export const MapButton = ({ navigation }) => (
  <View style={styles.buttonContainer}>
    <Button
      title="Go to Map"
      onPress={() => navigation.navigate('Map')} // Assuming 'MapScreen' is the name of your map screen
      color="#007AFF"
    />
  </View>
);

const styles = StyleSheet.create({
  scheduleContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  mapDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});