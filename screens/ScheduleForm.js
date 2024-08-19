import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScheduleService from "../services/ScheduleService/ScheduleService";


const ScheduleForm = () => {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isDayValid, setIsDayValid] = useState(true);
  const [isTimeValid, setIsTimeValid] = useState(true);

  const handleAddEvent = () => {
    const titleValid = eventTitle.trim() !== "";
    const descriptionValid = eventDescription.trim() !== "";
    const dayValid = day !== "";
    const timeValid = startTime !== null;

    setIsTitleValid(titleValid);
    setIsDescriptionValid(descriptionValid);
    setIsDayValid(dayValid);
    setIsTimeValid(timeValid);

    if (titleValid && descriptionValid && dayValid && timeValid) {
      setEvents([
        ...events,
        {
          id: Date.now(), // unique id for each event
          title: eventTitle,
          description: eventDescription,
          day,
          time: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setEventTitle("");
      setEventDescription("");
      setDay("");
      setStartTime(null);
      setShowTimePicker(false);
    } else {
      return;
    }
  };
  

  const handleRemoveEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const groupedEvents = events.reduce((acc, event) => {
        if (!acc[event.day]) {
          acc[event.day] = [];
        }
        acc[event.day].push(event);
        return acc;
      }, {});
  
      for (const [day, eventsForDay] of Object.entries(groupedEvents)) {
        const response = await ScheduleService.createData(day, eventsForDay);
        Alert.alert("Success", response.message);
      }
  
      setEvents([]);
      setDay("");
      setStartTime(null);
    } catch (error) {
      Alert.alert("Error", "Please try again.");
    }
  };
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowTimePicker(Platform.OS === "ios");
    setStartTime(currentDate);
  };

  const handleDayChange = (itemValue) => {
    setDay(itemValue);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.pickerContainer, !isDayValid && styles.pickerError]}>
        <Picker
          selectedValue={day}
          style={styles.picker}
          onValueChange={handleDayChange}
        >
          <Picker.Item label="Select Day" value="" />
          <Picker.Item label="Monday" value="Monday" />
          <Picker.Item label="Tuesday" value="Tuesday" />
          <Picker.Item label="Wednesday" value="Wednesday" />
          <Picker.Item label="Thursday" value="Thursday" />
          <Picker.Item label="Friday" value="Friday" />
          <Picker.Item label="Saturday" value="Saturday" />
          <Picker.Item label="Sunday" value="Sunday" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.buttonTime, !isTimeValid && styles.buttonTimeError]}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.selectedTime}>
          {startTime
            ? startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Select Time"}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startTime || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, !isTitleValid && styles.inputError]}
          placeholder="Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <TextInput
          style={[styles.input, !isDescriptionValid && styles.inputError]}
          placeholder="Event Description"
          value={eventDescription}
          onChangeText={setEventDescription}
        />
      </View>

      <Button title="Add Event" onPress={handleAddEvent} color="#007AFF" />

      {events.length > 0 && (
        <View style={styles.additionalEvents}>
          <Text style={styles.subTitle}>Scheduled Events</Text>
          {events.map((event) => (
            <View key={event.id} style={styles.eventContainer}>
              <Text style={styles.eventDay}>Day: {event.day}</Text>
              <Text style={styles.eventTime}>Time: {event.time}</Text>
              <Text style={styles.eventTitle}>Title: {event.title}</Text>
              <Text style={styles.eventDescription}>
                Desc: {event.description}
              </Text>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveEvent(event.id)}
              >
                <Ionicons
                  name="remove-circle-sharp"
                  size={18}
                  color="#ffb2a2"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {events.length > 0 && (
        <Button title="Submit" onPress={handleSubmit} color="#007AFF" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  pickerError: {
    borderColor: "red",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonTime: {
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginVertical: 10,
  },
  buttonTimeError: {
    borderColor: "red",
  },
  selectedTime: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    height: 55,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    width: "48%",
  },
  inputError: {
    borderColor: "red",
  },
  additionalEvents: {
    marginTop: 20,
  },
  eventContainer: {
    padding: 10,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    position: "relative",
  },
  eventTitle: {
    fontSize: 12,
    color: "#999",
  },
  eventDescription: {
    fontSize: 12,
    color: "#999",
  },
  eventDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    position: "absolute",
    right: 5,
    top: 5,
  },
});

export default ScheduleForm;
