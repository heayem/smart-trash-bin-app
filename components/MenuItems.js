import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MenuItem = ({
  iconName = "home",
  iconSize = 24,
  iconColor = "black",
  name = "menu",
  boxStyle = {},
  textStyle = {},
  action = () => {},
}) => {
  return (
    <TouchableOpacity onPress={action} style={[styles.menuItem, boxStyle]}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
      <Text style={textStyle}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    width: 100,
    marginVertical: 5,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});

export default MenuItem;
