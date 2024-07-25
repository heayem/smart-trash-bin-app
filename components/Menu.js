import React from "react";
import { FlatList, StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MenuItems from "./MenuItems";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const menuItems = [
  {
    id: "1",
    name: "Map",
    iconName: "map",
    iconSize: 48,
    iconColor: "green",
    IconComponent: Entypo,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },
  {
    id: "2",
    iconName: "trash-alt",
    name: "Bins",
    iconSize: 48,
    iconColor: "green",
    IconComponent: FontAwesome5,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },
  {
    id: "3",
    iconName: "schedule",
    name: "Schedule",
    iconSize: 48,
    iconColor: "green",
    IconComponent: MaterialIcons,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },

  {
    id: "4",
    iconName: "database",
    name: "Data",
    iconSize: 48,
    iconColor: "green",
    IconComponent: AntDesign,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },
  {
    id: "5",
    iconName: "information-circle-outline",
    name: "About us",
    iconSize: 48,
    iconColor: "green",
    IconComponent: Ionicons,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },
  {
    id: "6",
    iconName: "circle-user",
    name: "Profile",
    iconSize: 48,
    iconColor: "green",
    IconComponent: FontAwesome6,
    boxStyle: { backgroundColor: "white" },
    textStyle: { color: "black" },
    screen: "AboutUs",
  },
];

const Menu = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <MenuItems
      IconComponent={item.IconComponent}
      iconName={item.iconName}
      iconSize={item.iconSize}
      iconColor={item.iconColor}
      name={item.name}
      boxStyle={item.boxStyle}
      textStyle={item.textStyle}
      action={() => navigation.navigate(item.screen)}
    />
  );

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/logo/baner-bin.png")}
          style={styles.image}
        />
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
    alignSelf: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default Menu;
