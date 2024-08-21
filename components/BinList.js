import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import BinItems from '../components/BinItems';
import { ref, onValue } from 'firebase/database'; 
import { database } from '../firebaseConfig'; 
import { useNavigation } from '@react-navigation/native'; 
import Loading from "./Loading";

const BinList = () => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const dbRef = ref(database, 'trash-bin-database');
    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bins = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setBinData(bins);
        setError(null);
      } else {
        setError('No data found');
      }
      setLoading(false);
    };

    const unsubscribe = onValue(dbRef, handleData);

    return () => {
      unsubscribe(); 
    };
  }, []);

  const handleLocationPress = (lat, lng , title) => {
    navigation.navigate('Map', { coordinates: { latitude: lat, longitude: lng , title: title} }); 
  };

  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    Alert.alert('Error', error, [{ text: 'OK', onPress: () => setError(null) }]);
    return null; 
  }
  
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {binData.length > 0 ? (
        binData.map((bin) => (
          <BinItems
            key={bin.id}
            binId={bin.id}
            lat={bin.lat} 
            lng={bin.lng} 
            label={`Smart Bin ${bin.title}`}
            firstValue={bin.fill} 
            legends={[
              { text: `Level`, color: 'orange' },
              { text: `Location`, color: 'red' }
            ]}
            onLegendPress={() => handleLocationPress(bin.lat, bin.lng, bin.title)} 
          />
        ))
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </ScrollView>
  );  
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#f5f5f5',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BinList;
