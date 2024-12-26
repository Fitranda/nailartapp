import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('PegawaiScreen')}>
          <MaterialCommunityIcons name="account-group" size={50} color="#fff" />
          <Text style={styles.gridItemText}>Pegawai</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Pelayanan')}>
          <MaterialCommunityIcons name="hand-heart" size={50} color="#fff" />
          <Text style={styles.gridItemText}>Pelayanan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Pemesanan')}>
          <MaterialCommunityIcons name="clipboard-list" size={50} color="#fff" />
          <Text style={styles.gridItemText}>Pemesanan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Latar belakang putih
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Warna teks gelap
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: '#DA7297', // Warna pink untuk latar belakang item
    borderRadius: 10,
    padding: 10,
    elevation: 5, // Memberikan efek bayangan untuk tampilan 3D
  },
  gridItemText: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff', // Warna teks putih agar kontras dengan latar belakang pink
    textAlign: 'center',
  },
});

export default DashboardScreen;
