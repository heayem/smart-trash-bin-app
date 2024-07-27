import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RouteSummary = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.messageText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 70,
    left: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  messageText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default RouteSummary;
