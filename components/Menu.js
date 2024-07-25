import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuItem from "./MenuItems";

const menuItems = [
  {
    id: '1',
    iconName: 'map',
    name: 'Map',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'Map',
  },
  {
    id: '2',
    iconName: 'trash-bin',
    name: 'Bins',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'Bins',
  },
  {
    id: '3',
    iconName: 'people',
    name: 'About us',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'AboutUs',
  },
  {
    id: '4',
    iconName: 'settings',
    name: 'Settings',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'Settings',
  },
  {
    id: '5',
    iconName: 'settings',
    name: 'Settings',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'Settings',
  },
  {
    id: '6',
    iconName: 'home',
    name: 'Home',
    iconSize: 48,
    iconColor: 'green',
    boxStyle: { backgroundColor: 'white' },
    textStyle: { color: 'black' },
    screen: 'Home',
  },
];

const Menu = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          iconName={item.iconName}
          iconSize={item.iconSize}
          iconColor={item.iconColor}
          name={item.name}
          boxStyle={item.boxStyle}
          textStyle={item.textStyle}
          action={() => navigation.navigate(item.screen)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: "grid",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Menu;
