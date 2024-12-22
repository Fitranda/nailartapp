import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import '../global';

const PelayananScreen = () => {
  const [services, setServices] = useState([]);
  const [namaLayanan, setNamaLayanan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [gambar, setGambar] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getServices`);
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleCreateOrUpdateService = async () => {
    const url = editingService
      ? `http://${global.myApi}/nailartapp/src/service/api.php?op=updateService&id_layanan=${editingService.id_layanan}`
      : `http://${global.myApi}/nailartapp/src/service/api.php?op=createService`;

    const method = editingService ? 'POST' : 'POST';

    const formData = new FormData();
    formData.append('nama_layanan', namaLayanan);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', harga);
    if (gambar) {
      const uriParts = gambar.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('gambar', {
        uri: gambar,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const data = await response.json();
      Alert.alert(data.message);
      fetchServices();
      resetForm();
    } catch (error) {
      console.error('Error creating/updating service:', error);
    }
  };

  const handleDeleteService = async (id_layanan) => {
    try {
      const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=deleteService&id_layanan=${id_layanan}`);
      const data = await response.json();
      Alert.alert(data.message);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const resetForm = () => {
    setNamaLayanan('');
    setDeskripsi('');
    setHarga('');
    setGambar('');
    setEditingService(null);
    setShowForm(false);
  };

  const handleEditService = (service) => {
    setNamaLayanan(service.nama_layanan);
    setDeskripsi(service.deskripsi);
    setHarga(service.harga);
    setGambar(service.gambar);
    setEditingService(service);
    setShowForm(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGambar(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pelayanan</Text>
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nama Layanan"
            value={namaLayanan}
            onChangeText={setNamaLayanan}
          />
          <TextInput
            style={styles.input}
            placeholder="Deskripsi"
            value={deskripsi}
            onChangeText={setDeskripsi}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga"
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Gambar</Text>
          </TouchableOpacity>
          {gambar ? (
            <Image source={{ uri: gambar }} style={styles.previewImage} />
          ) : null}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCreateOrUpdateService}>
              <Icon name="content-save" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{editingService ? "Update" : "Create"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={resetForm}>
              <Icon name="cancel" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!showForm && (
        <Button title="Tambah Baru" onPress={() => setShowForm(true)} />
      )}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id_layanan.toString()}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Image
              source={{ uri: `http://${global.myApi}/nailartapp/src/service/uploads/${item.gambar}` }}
              style={styles.serviceImage}
            />
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceText}>Nama Layanan: {item.nama_layanan}</Text>
              <Text style={styles.serviceText}>Harga: {item.harga}</Text>
            </View>
            <Text style={styles.serviceDescription}>Deskripsi: {item.deskripsi}</Text>
            <View style={styles.serviceActions}>
              <TouchableOpacity onPress={() => handleEditService(item)} style={styles.actionButton}>
                <Icon name="pencil" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteService(item.id_layanan)} style={styles.actionButton}>
                <Icon name="delete" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    form: {
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    uploadButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    previewImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    serviceItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 10,
    },
    serviceImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      marginBottom: 10,
    },
    serviceDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    serviceText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    serviceDescription: {
      fontSize: 14,
      marginBottom: 10,
    },
    serviceActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    actionButtonText: {
      color: '#fff',
      marginLeft: 5,
    },
  });

export default PelayananScreen;