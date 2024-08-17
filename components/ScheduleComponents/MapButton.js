import React from "react";
import { View, Button, StyleSheet } from "react-native";

const Mapbutton = ({ navigation }) => (
  <View style={styles.buttonContainer}>
    <Button
      title="Go to Map"
      onPress={() => navigation.navigate("Map")}
      color="#007AFF"
    />
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Mapbutton;
