import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import '../global';

const ProfileScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getUsers`);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_user.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>Name: {item.nama}</Text>
            <Text style={styles.userText}>Email: {item.email}</Text>
            <Text style={styles.userText}>Phone: {item.telepon}</Text>
            <Text style={styles.userText}>Address: {item.alamat}</Text>
            <Text style={styles.userText}>Role: {item.role}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
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
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#d4af37', // Gold color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;