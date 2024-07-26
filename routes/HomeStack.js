import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Bins from "../screens/Bins";
import AboutUs from "../screens/AbooutUs";

const Stack = createStackNavigator();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Smart Trash Bin AI",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Bins"
          component={Bins}
          options={{ title: "Bins", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ title: "ABOUT US", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
