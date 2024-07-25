import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const TeamMembers = [ 
  { 
    id: "1", 
    title: "Dr. Heng Sovannarith",
    image: require('../assets/team/gallery.png'),
  }, 
  { 
    id: "2", 
    title: "Yem Hea",
    image: require('../assets/team/yem_hea.jpg'),
  }, 
  { 
    id: "3", 
    title: "Sok Leaphea",
    image: require('../assets/team/gallery.png'),
  }, 
  { 
    id: "4", 
    title: "Phon Sobon",
    image: require('../assets/team/phon_sobon.jpg'),
  }, 
  { 
    id: "5", 
    title: "Tes Sophanna",
    image: require('../assets/team/tes_sophanna.jpg'),
  }, 
  { 
    id: "6", 
    title: "Teok Yoteav",
    image: require('../assets/team/gallery.png'),
  }, 
  { 
    id: "7", 
    title: "Yoem Sreypov",
    image: require('../assets/team/gallery.png'),
  }, 
  { 
    id: "8", 
    title: "Uth Narin",
    image: require('../assets/team/uth_narin.jpg'),
  }, 
  { 
    id: "9", 
    title: "Chet Chakriya",
    image: require('../assets/team/chet_chakriya.jpg'),
  }, 
  { 
    id: "10", 
    title: "Pho Kakada",
    image: require('../assets/team/pho_kakada.jpg'),
  }, 
  { 
    id: "11", 
    title: "Chea Menglim",
    image: require('../assets/team/chea_menglim.jpg'),
  }, 
]; 

const Item = ({ title, image }) => { 
  return ( 
    <View style={styles.item}> 
      {image && <Image source={image} style={styles.image} />} 
      <Text style={styles.title}>{title}</Text> 
    </View> 
  ); 
};

const AboutUs = () => {
  const renderItem = ({ item }) => (
    <Item 
      title={item.title} 
      image={item.image} 
    />
  );

  return ( 
    <View style={styles.container}> 
      <FlatList 
        data={TeamMembers} 
        renderItem={renderItem} 
        keyExtractor={item => item.id} 
      /> 
    </View> 
  ); 
};

const styles = StyleSheet.create({ 
  container: { 
    marginTop: 30, 
    padding: 10, 
    backgroundColor: '#f5f5f5',
  }, 
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

export default AboutUs;
