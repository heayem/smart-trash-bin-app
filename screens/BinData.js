import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BinService from '../services/BinService/binService'; 

const BinData = () => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const result = await BinService.getAll('trash-bin-database');
        if (result.success) {
          const bins = Object.keys(result.data || {}).map(key => ({ id: key, ...result.data[key] }));
          setBinData(bins);
          console.log('Fetched Bin Data:', bins);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const handleRealTimeUpdate = (update) => {
      if (update.success) {
        console.log('Real-time update:', update.data);
      } else {
        setError(update.message);
      }
    };

    BinService.listenForData('bin-1', handleRealTimeUpdate);

    return () => {
      
    };
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Trash Bin</Text>
      {binData.length > 0 ? (
        <FlatList
          data={binData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.dataContainer}>
              <Text>Bin ID: {item.id}</Text>
              <Text>Fill Level: {item.fill}</Text>
              <Text>Latitude: {item.lat}</Text>
              <Text>Longitude: {item.lng}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 20,
  },
});

export default BinData;
