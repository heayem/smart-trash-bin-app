import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const NoData = ({ refresh, day }) => {
  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>Oops! No data available.</Text>
      {day && (
        <Button title="Refresh" onPress={() => refresh(day)} color="#007AFF" />
      )}
    </View>
  );
};

export default NoData;

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
