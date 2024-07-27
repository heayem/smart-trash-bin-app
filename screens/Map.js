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
import * as Location from "expo-location";
import axios from "axios";
import haversine from "haversine";

const GOOGLE_MAPS_APIKEY = "AIzaSyAKrvPTDE_YSFrbOLlwaIi-iM9ge-Pchz0";

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
    },
  ]);
  

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const fetchUserLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = location.coords;
      setUserLocation({
        latitude,
        longitude,
        title: "Your Location",
        description: "This is where you are",
      });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      setError("Error fetching location. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoute = async (origin, destination) => {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_MAPS_APIKEY}`;

    try {
      const response = await axios.get(url);
      const { routes } = response.data;
      if (routes.length > 0) {
        const points = routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        return decodedPoints;
      } else {
        setError("No route found.");
        return [];
      }
    } catch (err) {
      setError("Error fetching route. Please try again later.");
      return [];
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  const calculateRoutes = async () => {
    if (!userLocation || markers.length === 0) return;

    setCalculating(true);
    setLoading(true);
    let remainingMarkers = [...markers];
    let currentLocation = userLocation;
    let allRouteCoordinates = [];
    let segmentColors = [];
    let routeSummary = [];

    while (remainingMarkers.length > 0) {
      let nearestMarker = remainingMarkers.reduce(
        (nearest, marker) => {
          const distance = haversine(currentLocation, marker, {
            unit: "meter",
          });
          if (distance < nearest.distance) {
            return { marker, distance };
          }
          return nearest;
        },
        { marker: null, distance: Infinity }
      );

      if (nearestMarker.marker) {
        const route = await fetchRoute(currentLocation, nearestMarker.marker);
        allRouteCoordinates.push({
          coordinates: route,
          color: segmentColors.length % 2 === 0 ? "#FF0000" : "#0000FF",
        });

        routeSummary.push(
          `From ${currentLocation.title} to ${nearestMarker.marker.title}`
        );

        currentLocation = nearestMarker.marker;

        remainingMarkers = remainingMarkers.filter(
          (marker) => marker !== nearestMarker.marker
        );
      } else {
        break;
      }
    }

    setRouteCoordinates(allRouteCoordinates);
    setInfoMessage(routeSummary.join("\n"));
    setCalculating(false);
    setLoading(false);
  };

  const calculateRouteToMarker = async (marker) => {
    if (!userLocation) return;

    setCalculating(true);
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
    setCalculating(false);
  };

  const cancelCalculation = () => {
    setCalculating(false);
    setRouteCoordinates([]);
    setInfoMessage("");
  };
  const toggleMapType = () => {
    setMapType((prevType) =>
      prevType === "standard" ? "satellite" : "standard"
    );
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

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
            onPress={() => calculateRouteToMarker(marker)}
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
      <View style={styles.buttonContainer}>
        <Button
          Icon={FontAwesome6}
          onPress={calculateRoutes}
          style={styles.button}
          name="route"
          size={28}
          color="white"
        />
        <Button
          Icon={MaterialCommunityIcons}
          onPress={cancelCalculation}
          style={styles.cancelButton}
          name="map-marker-off"
          size={28}
          color="white"
        />
        <Button
          Icon={MaterialCommunityIcons}
          onPress={toggleMapType}
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
  mapTypeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    marginRight: 10,
  },
  calloutTextContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
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
