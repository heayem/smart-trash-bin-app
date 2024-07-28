import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Schedule, Event, MapButton } from '../components/DayDetailsItems';

const DayDetails = ({ route, navigation }) => {
  const { day } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: day });
  }, [navigation, day]);

  return (
    <View style={styles.container}>
      <Schedule day={day} navigation={navigation} />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default DayDetails;