import React from "react";
import { View, Image, StyleSheet } from "react-native";
const CustomMarker = ({ iconUri, size }) => (
  <View style={[styles.markerContainer, { width: size, height: size }]}>
    <Image
      source={iconUri}
      style={[styles.markerImage, { width: size, height: size }]}
    />
  </View>
);

export default CustomMarker;
const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  markerImage: {
    resizeMode: "contain",
  },
});
