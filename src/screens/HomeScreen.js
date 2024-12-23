import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import '../global';

// Mendapatkan dimensi layar perangkat
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Ambil data promo dari API
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getPromotions`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setPromotions(data.data); // Menyimpan data promo
        }
      })
      .catch((error) => {
        console.error('Error fetching promotions:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Home Screen</Text>

        {/* Tombol navigasi ke NailArt */}
        <Button
          title="Go to Nail Art"
          onPress={() => navigation.navigate('NailArt')}
          color="#5c6bc0"
        />

        {/* Bagian Promo dan Diskon */}
        <Text style={styles.promotionHeader}>Promo dan Diskon</Text>
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id_promosi.toString()}
          renderItem={({ item }) => (
            <View style={styles.promotionItem}>
              <Text style={styles.promotionTitle}>{item.judul}</Text>
              <Text style={styles.promotionDescription}>{item.deskripsi}</Text>
              <Text style={styles.promotionDate}>
                {item.tanggal_mulai} - {item.tanggal_akhir}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('NailArt')}
        >
          <Text style={styles.navText}>Nail Art</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('PemesananClient')} // Navigasi ke halaman Pemesanan
        >
          <Text style={styles.navText}>Pemesanan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ProfileScreen')} // Navigasi ke halaman Login
        >
          <Text style={styles.navText}>Profile</Text>
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
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  promotionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promotionItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#555',
  },
  promotionDate: {
    fontSize: 12,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#5c6bc0',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
