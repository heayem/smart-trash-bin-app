import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import BinItems from '../components/BinItems';
import { getDatabase, ref, onValue, off } from 'firebase/database'; 
import { database } from '../firebaseConfig'; 
import { useNavigation } from '@react-navigation/native'; 
import Loading from "../components/MapComponent/Loading";

const BinList = () => {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); 

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
        setError('Something went wrong!');
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

  const handleLocationPress = () => {
    navigation.navigate('Map');
  };

  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return Alert.alert('Error', error, [{ text: 'OK' }]);
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
            onLegendPress={() => handleLocationPress()} 
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
