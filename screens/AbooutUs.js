// screens/AboutUs.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileList from '../components/ProfileList.js';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <ProfileList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AboutUs;
