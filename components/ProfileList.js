// components/TeamMemberList.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Profile from './Profile';

const TeamMembers = [
  {
    id: "1",
    name: "Yem Hea",
    image: require('../assets/team/yem_hea.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "2",
    name: "Sok Leaphea",
    image: require('../assets/team/gallery.png'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "3",
    name: "Phon Sobon",
    image: require('../assets/team/phon_sobon.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "4",
    name: "Tes Sophanna",
    image: require('../assets/team/tes_sophanna.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "5",
    name: "Teok Yoteav",
    image: require('../assets/team/gallery.png'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "6",
    name: "Yoem Sreypov",
    image: require('../assets/team/gallery.png'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "7",
    name: "Uth Narin",
    image: require('../assets/team/uth_narin.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "8",
    name: "Chet Chakriya",
    image: require('../assets/team/chet_chakriya.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "9",
    name: "Pho Kakada",
    image: require('../assets/team/pho_kakada.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
  {
    id: "10",
    name: "Chea Menglim",
    image: require('../assets/team/chea_menglim.jpg'),
    contacts: {
        facebook: "#",
        telegram: "#",
        github: "#",
    },
  },
];

const TeamMemberList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.column}>
      <Profile
        name={item.name}
        image={item.image}
        contacts={item.contacts}
      />
    </View>
  );

  return (
    <FlatList
      data={TeamMembers}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  column: {
    flex: 1,
    padding: 8,
  },
});

export default TeamMemberList;