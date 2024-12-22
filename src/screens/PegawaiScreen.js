import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const PegawaiScreen = () => {
  const [pegawai, setPegawai] = useState([]);
  const apiUrl = 'http://${global.myApi}/nailartapp/src/service/api.php';
  const navigation = useNavigation();

  const fetchPegawai = async () => {
    try {
      const response = await fetch(`${apiUrl}?op=getPegawai`);
      const json = await response.json();
      if (json.data) {
        setPegawai(json.data);
      } else {
        Alert.alert('Error', 'Failed to fetch pegawai data.');
      }
    } catch (error) {
      console.error('Error fetching pegawai:', error);
      Alert.alert('Error', 'Failed to fetch pegawai. Please try again.');
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  const handleAddPegawai = () => {
    navigation.navigate('CrudPegawai', { isEditing: false });
  };

  // Menambahkan handleEdit untuk mengedit pegawai
  const handleEdit = (pegawai) => {
    navigation.navigate('CrudPegawai', {
      isEditing: true,
      formData: pegawai, // Mengirimkan data pegawai yang akan diedit
    });
  };

  // Function for navigating back to the Dashboard
  const handleBackToDashboard = () => {
    navigation.navigate('DashboardScreen');  // Use the correct screen name
  };

  // Function to delete pegawai
  const deletePegawai = async (id) => {
    try {
      const response = await fetch(`${apiUrl}?op=deletePegawai`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_pegawai: id }), // Send the ID to delete
      });

      const json = await response.json();
      if (json.status === 'success') {
        Alert.alert('Success', 'Pegawai deleted successfully');
        fetchPegawai(); // Re-fetch the data to update the list
      } else {
        Alert.alert('Error', json.message || 'Failed to delete pegawai');
      }
    } catch (error) {
      console.error('Error deleting pegawai:', error);
      Alert.alert('Error', 'Failed to delete pegawai. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Icon name="users" size={30} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerText}>Pengelolaan Data Pegawai</Text>
        </View>

        {/* Back to Dashboard Button */}
        

        {/* Add Pegawai Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPegawai}
        >
          <Text style={styles.addButtonText}>
            <Icon name="plus" size={18} color="#fff" style={styles.icon} /> Tambah Pegawai
          </Text>
        </TouchableOpacity>

        <View style={styles.listContainer}>
          {pegawai.map((item) => (
            <View key={item.id_pegawai} style={styles.listItem}>
              <Text style={styles.name}>{item.nama}</Text>
              <Text style={styles.detail}>{item.email}</Text>
              <Text style={styles.detail}>{item.jenis_kelamin}</Text>
              <Text style={styles.detail}>{item.tanggal_lahir}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)} // Panggil handleEdit saat tombol Edit diklik
                >
                  <Text style={styles.buttonText}>
                    <Icon name="edit" size={18} color="#fff" /> Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePegawai(item.id_pegawai)} // Trigger the delete
                >
                  <Text style={styles.buttonText}>
                    <Icon name="trash" size={18} color="#fff" /> Delete
                  </Text>
                </TouchableOpacity>

      
              </View>
              
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToDashboard}
        >
          <Text style={styles.backButtonText}>
            <Icon name="arrow-left" size={18} color="#fff" style={styles.icon} /> Kembali ke Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    paddingBottom: 70, // space to avoid content hidden behind the tab
  },
  headerContainer: {
    backgroundColor: '#eeacbf',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#DA7297',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#DA7297',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 5,
  },
  icon: {
    marginRight: 10,
  },
  listContainer: {
    margin: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default PegawaiScreen;
