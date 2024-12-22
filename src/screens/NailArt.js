import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    // Jika gambar adalah URL
    const baseURL = `http://${global.myApi}/nailartapp/`; // Base URL server jika gambar di-host di server
    if (imagePath.includes('http')) {
      return { uri: imagePath }; // Gambar dari URL langsung
    }
    
    // Jika gambar lokal dalam proyek (assets/images/)
    const images = {
      'assets/images/manicure.jpg': require('../../assets/images/manicure.jpg'), // Sesuaikan path relatif
      'assets/images/pedicure.jpg': require('../../assets/images/pedicure.jpg'), // Sesuaikan path relatif
      'assets/images/nail_art_design.jpg': require('../../assets/images/nail_art_design.jpg'), // Sesuaikan path relatif
      // Tambahkan gambar lainnya sesuai kebutuhan
    };

    return images[imagePath] || { uri: `${baseURL}${imagePath}` }; // Menggabungkan baseURL jika gambar lokal tidak ditemukan
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Layanan Nail Art</Text>

      {/* Tombol kembali ke Home */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Fungsi untuk kembali ke screen sebelumnya
      >
        <Text style={styles.backButtonText}>Kembali ke Home</Text>
      </TouchableOpacity>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  serviceItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#d9534f',
  },
});

export default NailArt;
