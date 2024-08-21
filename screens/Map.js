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
import { useRoute } from '@react-navigation/native';

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

  const binImage = require("../assets/Map/bin.jpg");


  useEffect(() => {
    init();
    fetchStations();
    fetchBins();
  }, []);

  useEffect(() => {
    if (coordinates && userLocation) {
        handleCalculateRouteToMarker(coordinates);
    }
    else{
      if (userLocation && bins.length > 0) {
        handleAiSuggestion();
      }
    }
    
    
  }, [coordinates, bins, userLocation]);

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

  const fetchBins = async () => {
    const { success, data, message } = await BinService.getAll(
      "trash-bin-database"
    );
    if (success && data) {
      const normalizedData = normalizeBins(data);
      setBins(normalizedData);
    } else {
      setError(message || "Failed to fetch bins.");
    }
  };

  const fetchStations = async () => {
    const { success, data, message } = await BinService.getAll(
      "station-database"
    );
    if (success && data) {
      const normalizedData = normalizeStations(data);
      setStations(normalizedData);
    } else {
      setError(message || "Failed to fetch bins.");
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

  const [bins, setBins] = useState([
    {
      id: "bin-1",
      latitude: 11.5681,
      longitude: 104.8921,
      title: "RUPP",
      binLevel: 90,
    },
    {
      id: "bin-2",
      latitude: 11.5689,
      longitude: 104.8932,
      title: "IFL",
      binLevel: 70,
    },
    {
      id: "bin-3",
      latitude: 11.5681,
      longitude: 104.8947,
      title: "SETEC",
      binLevel: 90,
    },
  ]);

  const [stations, setStations] = useState([
    {
      id: "station-1",
      latitude: 11.560173,
      longitude: 104.892526,
      title: "Station",
    },
  ]);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const handleAiSuggestion = async () => {
    // if (!userLocation || bins.length === 0) return;
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
        allRouteCoordinates.push({
          coordinates: route,
          color: "#FF0000",
        });
        currentLocation = waypoint;
      }

      const finalRoute = await fetchRoute(currentLocation, endStation);
      allRouteCoordinates.push({
        coordinates: finalRoute,
        color: "#00FF00",
      });

      setRouteCoordinates(allRouteCoordinates);
      setInfoMessage(`AI suggested to ${message}`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Failed to fetch route suggestions", "Please try again later.");
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
      setRouteCoordinates([
        {
          coordinates: route,
          color: "#FF0000",
        },
      ]);
      setInfoMessage(`From your location -> ${marker.title}`);
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
        {bins.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleCalculateRouteToMarker(marker)}
          >
            <CustomMarker iconUri={binImage} size={52} />

            <Callout>
              <View style={styles.calloutContainer}>
                <View>
                  <FontAwesome name="building" size={40} color="green" />
                </View>
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle}>{marker.title} </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

        {stations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => handleCalculateRouteToMarker(station)}
          >
            <CustomMarker iconUri={binImage} size={52} />

            <Callout>
              <View style={styles.calloutContainer}>
                <View>
                  <FontAwesome name="building" size={60} color="red" />
                </View>
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
          style={styles.mapButton}
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
          style={styles.mapButton}
          name="map-outline"
          size={28}
          color="white"
        />
      </View>
      {infoMessage !== "" && (
        <RouteSummary message={infoMessage} color={"#F24A4A"} />
      )}
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
  calloutContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: 250,
    maxHeight: 250,
  },
  calloutTextContainer: {
    flexDirection: "column",
    flexShrink: 1,
  },
  calloutTitle: {
    color: "black",
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  buttonsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 28,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  mapButton: {
    backgroundColor: "#00008B",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Map;