import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet, View, Text } from "react-native";
import Loading from "../components/Loading";
import Button from "../components/MapComponent/Button";
import ErrorMessage from "../components/MapComponent/ErrorMessage";
import RouteSummary from "../components/MapComponent/RouteSummary";
import CustomMarker from "../components/MapComponent/CustomMarker";
import { fetchAndCallApi } from "../services/routeService/aiSuggestion";
import {
  fetchUserLocation,
  fetchRoute,
  calculateRouteToNearestMarker,
} from "../services/mapService";
import BinService from "../services/BinService/binService";
import { useRoute } from "@react-navigation/native";

const Map = () => {
  const route = useRoute();
  const { coordinates } = route.params || {};

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
  const [bins, setBins] = useState([]);
  const [stations, setStations] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const binImage = require("../assets/Map/bin.jpg");

  useEffect(() => {
    const initialize = async () => {
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

    initialize();
    fetchStations();
    fetchBins();
  }, []);

  useEffect(() => {
    if (coordinates && userLocation) {
      handleCalculateRouteToMarker(coordinates);
    } else if (userLocation && bins.length > 0) {
      handleAiSuggestion();
    }
  }, [coordinates, bins, userLocation]);

  const fetchBins = async () => {
    const { success, data, message } = await BinService.getAll(
      "trash-bin-database"
    );
    if (success && data) {
      setBins(normalizeBins(data));
    } else {
      setError(message || "Failed to fetch bins.");
    }
  };

  const fetchStations = async () => {
    const { success, data, message } = await BinService.getAll(
      "station-database"
    );
    if (success && data) {
      setStations(normalizeStations(data));
    } else {
      setError(message || "Failed to fetch stations.");
    }
  };

  const normalizeBins = (data) => {
    return Object.keys(data).map((key) => {
      const bin = data[key];
      return {
        id: key,
        latitude: bin.latitude || bin.lat,
        longitude: bin.longitude || bin.lng,
        title: bin.title || "Unknown",
        binLevel: bin.binLevel || bin.fill,
      };
    });
  };

  const normalizeStations = (data) => {
    return Object.keys(data).map((key) => {
      const station = data[key];
      return {
        id: key,
        latitude: station.latitude || station.lat,
        longitude: station.longitude || station.lng,
        title: station.title || "Unknown",
      };
    });
  };

  const handleAiSuggestion = async () => {
    if (!userLocation || bins.length === 0) return;

    setLoading(true);
    try {
      const { waypoints, endStation, message } = await fetchAndCallApi(
        bins,
        stations,
        "Analyze this message",
        userLocation
      );

      let allRouteCoordinates = [];
      let currentLocation = userLocation;

      for (const waypoint of waypoints) {
        const route = await fetchRoute(currentLocation, waypoint);
        allRouteCoordinates.push({ coordinates: route, color: "#FF0000" });
        currentLocation = waypoint;
      }

      const finalRoute = await fetchRoute(currentLocation, endStation);
      allRouteCoordinates.push({ coordinates: finalRoute, color: "#00FF00" });

      setRouteCoordinates(allRouteCoordinates);
      setInfoMessage(`AI suggested to ${message}`);
    } catch (err) {
      alert("Failed to fetch route suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRoutes = async () => {
    if (!userLocation || bins.length === 0) return;

    setCalculating(true);
    setLoading(true);
    try {
      const { allRouteCoordinates, routeSummary } =
        await calculateRouteToNearestMarker(userLocation, bins);
      setRouteCoordinates(allRouteCoordinates);
      setInfoMessage(`Nearly suggested to ${routeSummary}`);
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
      setRouteCoordinates([{ coordinates: route, color: "#FF0000" }]);
      setInfoMessage(`From your location to ${marker.title}`);
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
        {bins.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleCalculateRouteToMarker(marker)}
          >
            <CustomMarker iconUri={binImage} size={52} />
            <Callout>
              <View style={styles.calloutContainer}>
                <FontAwesome name="building" size={40} color="green" />
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle}>{marker.title}</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => handleCalculateRouteToMarker(station)}
          >
            <CustomMarker iconUri={binImage} size={52} />
            <Callout>
              <View style={styles.calloutContainer}>
                <FontAwesome name="building" size={60} color="red" />
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle}>{station.title}</Text>
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

        {routeCoordinates.map((segment, index) => (
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
          style={styles.mapButton}
          name="robot-outline"
          size={28}
          color="white"
        />
        <Button
          Icon={FontAwesome6}
          onPress={handleCalculateRoutes}
          style={styles.mapButton}
          name="map"
          size={28}
          color="white"
        />
        <Button
          Icon={FontAwesome}
          onPress={handleToggleMapType}
          style={styles.mapButton}
          name="map"
          size={28}
          color="white"
        />
      </View>
      {calculating && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Calculating...</Text>
          <Button onPress={handleCancelCalculation} style={styles.cancelButton}>
            Cancel
          </Button>
        </View>
      )}
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
    right: 10,
    flexDirection: "column",
  },
  mapButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    margin: 5,
    padding: 10,
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    color: "white",
  },
  calloutContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calloutTextContainer: {
    marginLeft: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
  },
});

export default Map;
