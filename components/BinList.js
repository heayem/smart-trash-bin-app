import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import BinItems from '../components/BinItems';
import { getDatabase, ref, onValue, off } from 'firebase/database'; 
import { database } from '../firebaseConfig'; 
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Bins = () => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const dbRef = ref(database, 'trash-bin-database');
        onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const bins = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setBinData(bins);
          } else {
            setError('No data found');
          }
        }, {
          onlyOnce: false, 
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const dbRef = ref(database, 'trash-bin-database');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bins = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setBinData(bins);
      } else {
        setError('No data found');
      }
    });

    return () => {
      off(dbRef); 
    };
  }, []);

  const handleLocationPress = (bin) => {
    navigation.navigate('Map');
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
  
  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }
  
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {binData.length > 0 ? (
        binData.map((bin) => (
          <BinItems
            key={bin.id}
            label={`Smart Bin ${bin.id}`}
            firstValue={bin.fill} 
            legends={[
              { text: `Level`, color: 'orange' },
              { text: `Location`, color: 'red' }
            ]}
            onLegendPress={() => handleLocationPress(bin)} // Handle legend press
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
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Bins;
