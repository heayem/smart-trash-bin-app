import React, { useEffect, useState } from 'react';
import { Button, View, Alert } from 'react-native';
import { fetchUserLocation } from '../services/mapService';

const TestAPI = () => {
  const [loading, setLoading] = useState(false);

  const fetchAndCallApi = async () => {
    setLoading(true);

    try {
      // Fetch user location
      const userLocation = await fetchUserLocation();

      // Define markers and stations
      const markers = [
        { id: 'bin-1', Level: 94, lat: 11.57038, lng: 104.89391 },
        { id: 'bin-2', Level: 0, lat: 11.56998, lng: 104.88984 },
        { id: 'bin-3', Level: 93, lat: 11.6, lng: 104.85 },
        { id: 'bin-4', Level: 45, lat: 11.575, lng: 104.891 },
        { id: 'bin-5', Level: 10, lat: 11.56, lng: 104.87 },
        { id: 'bin-6', Level: 78, lat: 11.54, lng: 104.89391 },
        { id: 'bin-7', Level: 90, lat: 11.52, lng: 104.9 },
        { id: 'bin-8', Level: 25, lat: 11.55, lng: 104.89391 },
      ];
      const stations = [
        { id: 'station-1', lat: 11.560173, lng: 104.892526 },
      ];

      // Call the API
      const response = await fetch('https://smart-trash-bin-service.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            title: userLocation.title,
            description: userLocation.description
          },
          bins: markers,
          stations: stations,
          message: 'Analyze this message',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      Alert.alert('API Response', JSON.stringify(data.reply));

    } catch (error) {
      console.error('Error fetching route coordinates:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Call API" onPress={fetchAndCallApi} disabled={loading} />
    </View>
  );
};

export default TestAPI;
