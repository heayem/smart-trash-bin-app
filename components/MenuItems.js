import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const MenuItem = ({
  IconComponent,
  iconName = "home",
  iconSize = 48,
  iconColor = "black",
  name = "menu",
  boxStyle = {},
  textStyle = {},
  action = () => {},
}) => {
  return (
    <TouchableOpacity onPress={action} style={[styles.menuItem, boxStyle]}>
      <IconComponent name={iconName} size={iconSize} color={iconColor} />
      <Text style={textStyle}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    width: 100,
    padding: 16,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10,
  },
});

export default MenuItem;
