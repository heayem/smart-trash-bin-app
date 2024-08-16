import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const DayNoData = ({ fetchSchedule, day }) => {
  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>Oops! No data available.</Text>
      {day && (
        <Button title="Refresh" onPress={() => fetchSchedule(day)} color="#007AFF" />
      )}
    </View>
  );
};

export default DayNoData;

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
});
