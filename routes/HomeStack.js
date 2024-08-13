import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Bins from "../screens/Bins";
import Map from "../screens/Map";
import AboutUs from "../screens/AbooutUs";
import Schedule from "../screens/Schedule";
import DayDetails from "../screens/DayDetails";
import ScheduleForm from "../screens/ScheduleForm";
import TestAPI from "../screens/TestAPI";
import BinData from "../screens/BinData";

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
          name="TestAPI"
          component={TestAPI}
          options={{ title: "TestAPI", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ title: "MapView", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Bins"
          component={Bins}
          options={{ title: "Bins", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Schedule"
          component={Schedule}
          options={{ title: "Schedule", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="DayDetails"
          component={DayDetails}
          options={{ title: "Schedule", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="ScheduleForm"
          component={ScheduleForm}
          options={{ title: "Schedule form", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ title: "ABOUT US", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="BinData"
          component={BinData}
          options={{ title: "Bin Data", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
