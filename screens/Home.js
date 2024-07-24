import React from "react";
import { View } from "react-native";
import Menu from "../components/Menu.js";

const Home = ({ navigation }) => {
  const bins = () => {
    navigation.navigate("Bins");
  };
  return (
    <View>
      <Menu />
    </View>
  );
};

export default Home;
