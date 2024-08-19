import React from "react";
import { View, Button, StyleSheet } from "react-native";

const MapButton = ({ navigation, title = "Go to Map", onPressAction }) => (
  <View style={styles.buttonContainer}>
    <Button
      title={title}
      onPress={() => {
        if (onPressAction) {
          onPressAction();
        } else {
          navigation.navigate("Map", { triggerCalculateRoutes: true });
        }
      }}
      color="#007AFF"
    />
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default MapButton;
