import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Profile = ({ title, image }) => {
  return (
    <View style={styles.item}>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default Profile;
