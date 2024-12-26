import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('User data:', userData); // Log untuk memeriksa data
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Logout', 'You have been logged out successfully.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // Show loading state if user data is not available yet
  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* User Info */}
      <View style={styles.userItem}>
        <Text style={styles.userText}>Name: {user.nama || 'Data tidak tersedia'}</Text>
        <Text style={styles.userText}>Email: {user.email || 'Data tidak tersedia'}</Text>
        <Text style={styles.userText}>Telepon: {user.telepon || 'Data tidak tersedia'}</Text>
        <Text style={styles.userText}>Alamat: {user.alamat || 'Data tidak tersedia'}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#DA7297', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default ProfileScreen;
