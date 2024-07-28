import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet, View, Text } from "react-native";
import Loading from "../components/MapComponent/Loading";
import Button from "../components/MapComponent/Button";
import ErrorMessage from "../components/MapComponent/ErrorMessage";
import RouteSummary from "../components/MapComponent/RouteSummary";
import CustomMarker from "../components/MapComponent/CustomMarker";
import { fetchAllRouteCoordinates } from "../services/routeService/aiSuggestion";
import {
  fetchUserLocation,
  fetchRoute,
  calculateRouteToNearestMarker,
} from "../services/mapService";

const Map = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 11.5561,
    longitude: 104.9285,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapType, setMapType] = useState("standard");
  const [markers, setMarkers] = useState([
    {
      latitude: 11.5681,
      longitude: 104.8921,
      title: "RUPP",
      description: "Royal University of Phnom Penh",
      iconName: "building",
      Icon: FontAwesome,
      color: "red",
      size: 80,
      iconUri: require("../assets/Map/bin.jpg"),
      binLevel: 90,
    },
    {
      latitude: 11.5689,
      longitude: 104.8932,
      title: "IFL",
      description: "Institute of Foreign Languages",
      iconName: "building",
      Icon: FontAwesome,
      color: "blue",
      size: 80,
      iconUri: require("../assets/Map/bin.jpg"),
      binLevel: 70,
    },
    {
      latitude: 11.5681,
      longitude: 104.8947,
      title: "SETEC",
      description: "Setec Institute",
      iconName: "building",
      Icon: FontAwesome,
      color: "green",
      size: 80,
      iconUri: require("../assets/Map/bin.jpg"),
      binLevel: 90,
    },
  ]);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const location = await fetchUserLocation();
        setUserLocation(location);
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleAiSuggestion = async () => {
    if (!userLocation || markers.length === 0) return;

    setCalculating(true);
    setLoading(true);
    try {
      const { allRouteCoordinates, routeSummary } =
        await fetchAllRouteCoordinates(userLocation, markers);
      console.log(allRouteCoordinates);
      setRouteCoordinates(allRouteCoordinates);
      console.log(allRouteCoordinates);
      setInfoMessage(routeSummary.join("\n"));
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
      setLoading(false);
    }
  };

  const handleCalculateRoutes = async () => {
    if (!userLocation || markers.length === 0) return;

    setCalculating(true);
    setLoading(true);
    try {
      const { allRouteCoordinates, routeSummary } =
        await calculateRouteToNearestMarker(userLocation, markers);
      setRouteCoordinates(allRouteCoordinates);
      setInfoMessage(routeSummary.join("\n"));
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
      setLoading(false);
    }
  };

  const handleCalculateRouteToMarker = async (marker) => {
    if (!userLocation) return;

    setCalculating(true);
    try {
      const route = await fetchRoute(userLocation, marker);
      setRouteCoordinates([
        {
          coordinates: route,
          color: "#FF0000",
        },
      ]);
      setInfoMessage(
        `Route to ${marker.title}:\nFrom your location to ${marker.title}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleCancelCalculation = () => {
    setCalculating(false);
    setRouteCoordinates([]);
    setInfoMessage("");
  };

  const handleToggleMapType = () => {
    setMapType((prevType) =>
      prevType === "standard" ? "satellite" : "standard"
    );
  };

  if (error) return <ErrorMessage message={error} />;

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <MapView
        showsMyLocationButton
        showsUserLocation
        style={styles.map}
        region={mapRegion}
        mapType={mapType}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleCalculateRouteToMarker(marker)}
          >
            <CustomMarker iconUri={marker.iconUri} size={52} />

            <Callout>
              <View style={styles.calloutContainer}>
                <View style={styles.iconContainer}>
                  <marker.Icon
                    name={marker.iconName}
                    size={marker.size}
                    color={marker.color}
                  />
                </View>
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle}>{marker.title}</Text>
                  <Text style={styles.calloutDescription}>
                    {marker.description}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={userLocation.title}
            description={userLocation.description}
            pinColor="red"
          >
            <CustomMarker
              iconUri={require("../assets/Map/bin_track.jpg")}
              size={80}
            />
          </Marker>
        )}
        {routeCoordinates.length > 0 &&
          routeCoordinates.map((segment, index) => (
            <Polyline
              key={index}
              coordinates={segment.coordinates}
              strokeColor={segment.color}
              strokeWidth={4}
            />
          ))}
      </MapView>
      <View style={styles.buttonsContainer}>
        <Button
          Icon={MaterialCommunityIcons}
          onPress={handleAiSuggestion}
          style={styles.aiButton}
          name="robot-outline"
          size={28}
          color="white"
        />
        <Button
          Icon={FontAwesome6}
          onPress={handleCalculateRoutes}
          style={styles.mapButton}
          name="route"
          size={28}
          color="white"
        />
        <Button
          Icon={MaterialCommunityIcons}
          onPress={handleCancelCalculation}
          style={styles.cancelButton}
          name="map-marker-off"
          size={28}
          color="white"
        />
        <Button
          Icon={MaterialCommunityIcons}
          onPress={handleToggleMapType}
          style={styles.mapTypeButton}
          name="map-outline"
          size={28}
          color="white"
        />
      </View>
      {infoMessage && <RouteSummary message={infoMessage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  mapTypeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  aiButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  mapButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Map;