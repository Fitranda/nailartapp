import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [promotions, setPromotions] = useState([]);
  const [bestSeller, setBestSeller] = useState({
    title: 'Luxury Nail Art',
    description: 'Our best-selling luxury nail art for a glamorous look.',
    image: 'https://example.com/nail-art-best-seller.jpg', // Ganti dengan URL gambar Anda
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(
          `http://${global.myApi}/nailartapp/src/service/api.php?op=getPromotions`
        );
        const data = await response.json();
        if (data && data.data) {
          setPromotions(data.data);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to Nail Art Studio</Text>

        {/* Best Seller Service */}
        <View style={styles.bestSellerContainer}>
          <Text style={styles.sectionHeader}>Best Seller</Text>
          <Image source={require('../service/uploads/nail_art_design.jpg')} style={styles.bestSellerImage} />
          <Text style={styles.bestSellerTitle}>{bestSeller.title}</Text>
          <Text style={styles.bestSellerDescription}>{bestSeller.description}</Text>
        </View>

        {/* Promotions */}
        <Text style={styles.sectionHeader}>Promo dan Diskon</Text>
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
        {/* About Us */}
  

        <View style={styles.storeInfoContainer}>
          <Text style={styles.sectionHeader}>About Us</Text>
          <Text style={styles.aboutUsText}>
          Di sini di Nail Art Studio, kami percaya bahwa setiap kuku adalah kanvas unik yang bisa diubah menjadi karya seni. 
          Dengan sentuhan kreatif dan warna-warni yang berani, 
          kami hadir untuk menginspirasi dan meningkatkan kepercayaan diri Anda melalui nail art yang memukau. 
          Nail Art Studio telah menjadi destinasi favorit sejak didirikan pada tahun 2020. 
          Selamat datang di dunia di mana kuku-kuku Anda menjadi pusat perhatian!
          </Text>
        </View>

        {/* Store Information */}
        <View style={styles.storeInfoContainer}>
          <Text style={styles.sectionHeader}>Store Information</Text>
          <Text style={styles.storeInfoText}>
            📍 Address: 123 Beauty Avenue, Glamour City
          </Text>
          <Text style={styles.storeInfoText}>🕒 Opening Hours: 09:00 - 21:00</Text>
          <Text style={styles.storeInfoText}>📞 Contact: +62 812 3456 7890</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bestSellerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  bestSellerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  bestSellerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    textAlign: 'center',
  },
  bestSellerDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
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
  storeInfoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storeInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
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

export default HomeScreen;
