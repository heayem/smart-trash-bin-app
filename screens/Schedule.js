import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Schedule = () => {
  const navigation = useNavigation();
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerDays}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.boxDay,
              width < 600 &&
                index === daysOfWeek.length - 1 &&
                styles.boxDayFullWidth,
            ]}
            onPress={() => navigation.navigate("DayDetails", { day })}
          >
            <Text style={styles.dayTitle}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ScheduleForm")}
      >
        <Text style={styles.addButtonText}>New schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  containerDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  boxDay: {
    width: "47%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  boxDayFullWidth: {
    width: "100%",
  },
  dayTitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Schedule;
