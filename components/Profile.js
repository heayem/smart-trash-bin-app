import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using Expo

const Profile = ({ name, image, contacts }) => {
  return (
    <View style={styles.item}>
      {image && <Image source={image} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.contactIcons}>
          {contacts.facebook && (
            <TouchableOpacity onPress={() => Linking.openURL(contacts.facebook)}>
              <FontAwesome name="facebook" size={24} color="#4267B2" style={styles.icon} />
            </TouchableOpacity>
          )}
          {contacts.telegram && (
            <TouchableOpacity onPress={() => Linking.openURL(contacts.telegram)}>
              <FontAwesome name="telegram" size={24} color="#0088cc" style={styles.icon} />
            </TouchableOpacity>
          )}
          {contacts.github && (
            <TouchableOpacity onPress={() => Linking.openURL(contacts.github)}>
              <FontAwesome name="github" size={24} color="#000" style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,

  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Profile;

