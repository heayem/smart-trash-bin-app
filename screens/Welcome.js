import React from "react";
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
 
} from "react-native";

const Welcome = () => {
 
  return (
    <ImageBackground
      source={require("../assets/bg/login_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
       <Text style={styles.welcomeText}>Welcome Bin AI</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  
});

export default Welcome;
