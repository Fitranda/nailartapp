import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import '../global';

const NailArt = ({ navigation }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Ambil data layanan dari API
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getServices`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setServices(data.data); // Menyimpan data layanan
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, []);

  const renderImage = (imagePath) => {
    const baseURL = `http://${global.myApi}/nailartapp/src/service/uploads/`; // Base URL server jika gambar di-host di server
    return { uri: `${baseURL}${imagePath}` }; // Menggabungkan baseURL dengan path gambar dari database
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Layanan Nail Art</Text>

        <FlatList
          data={services}
          keyExtractor={(item) => item.id_layanan.toString()}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <Image
                style={styles.image}
                source={renderImage(item.gambar)} // Menggunakan fungsi renderImage untuk menangani path gambar
              />
              <Text style={styles.serviceName}>{item.nama_layanan}</Text>
              <Text style={styles.description}>{item.deskripsi}</Text>
              <Text style={styles.price}>Rp {item.harga}</Text>
            </View>
          )}
        />
      </ScrollView>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('NailArt')}>
          <Icon name="brush" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PemesananClient')}>
          <Icon name="shopping-cart" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <Icon name="person" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e91e63',
    marginBottom: 20,
  },
  serviceItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#d9534f',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#DA7297',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#eeacbf',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NailArt;
