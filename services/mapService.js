import axios from "axios";
import * as Location from "expo-location";
import haversine from "haversine";

const GOOGLE_MAPS_APIKEY = "AIzaSyAKrvPTDE_YSFrbOLlwaIi-iM9ge-Pchz0";

export const fetchUserLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied.");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const { latitude, longitude } = location.coords;
    return {
      latitude,
      longitude,
      title: "Your Location",
      description: "This is where you are",
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching location. Please try again later.");
  }
};

export const fetchRoute = async (origin, destination) => {
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
      throw new Error("No route found.");
    }
  } catch (err) {
    throw new Error(err.message || "Error fetching route. Please try again later.");
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

export const calculateRouteToNearestMarker = async (userLocation, markers) => {
    let remainingMarkers = [...markers];
    let currentLocation = userLocation;
    let allRouteCoordinates = [];
    let segmentColors = [];
    let routeSummary = [];
  
    while (remainingMarkers.length > 0) {
      let nearestMarker = remainingMarkers.reduce(
        (nearest, marker) => {
          const distance = haversine(currentLocation, marker, { unit: "meter" });
          if (distance < nearest.distance) {
            return { marker, distance };
          }
          return nearest;
        },
        { marker: null, distance: Infinity }
      );
  
      if (nearestMarker.marker) {
        try {
          const route = await fetchRoute(currentLocation, nearestMarker.marker);
          allRouteCoordinates.push({
            coordinates: route,
            color: segmentColors.length % 2 === 0 ? "#FF0000" : "#0000FF",
          });
  
          routeSummary.push(
            ` ${currentLocation.title} -> ${nearestMarker.marker.title}`
          );
  
          currentLocation = nearestMarker.marker;
  
          remainingMarkers = remainingMarkers.filter(
            (marker) => marker !== nearestMarker.marker
          );
        } catch (err) {
          console.error("Error fetching route:", err);
        }
      } else {
        break;
      }
    }
  
    return { allRouteCoordinates, routeSummary };
  };

