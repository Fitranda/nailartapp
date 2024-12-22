import React from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CrudPegawai = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData, isEditing } = route.params || {}; // Jika tidak ada data, gunakan objek kosong

  const [form, setForm] = React.useState(formData || {
    id_pegawai: '',
    nama: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    email: '',
    password: '',
  });

  // Fungsi untuk menghandle pengiriman form
  const handleSubmit = async () => {
    const operation = isEditing ? 'updatePegawai' : 'createPegawai';
    const apiUrl = 'http://${global.myApi}/nailartapp/src/service/api.php';

    // Validasi input form
    if (!form.nama || !form.tanggal_lahir || !form.jenis_kelamin || !form.email || !form.password) {
      Alert.alert('Error', 'Semua bidang harus diisi.');
      return;
    }

    try {
      // Kirim data ke API
      const response = await fetch(`${apiUrl}?op=${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert('Berhasil', `Pegawai berhasil ${isEditing ? 'diedit' : 'ditambahkan'}.`, [
          { text: 'OK', onPress: () => navigation.navigate('PegawaiScreen') },
        ]);
      } else {
        Alert.alert('Berhasil', `Pegawai berhasil ${isEditing ? 'diedit' : 'ditambahkan'}.`, [
          { text: 'OK', onPress: () => navigation.navigate('PegawaiScreen') },
        ]);
      }
    } catch (error) {
      console.error('Error submitting pegawai:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Icon name="user-plus" size={30} color="#fff" />
        <Text style={styles.headerText}>{isEditing ? 'Edit Pegawai' : 'Tambah Pegawai'}</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama"
          value={form.nama}
          onChangeText={(text) => setForm({ ...form, nama: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Tanggal Lahir"
          value={form.tanggal_lahir}
          onChangeText={(text) => setForm({ ...form, tanggal_lahir: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Jenis Kelamin"
          value={form.jenis_kelamin}
          onChangeText={(text) => setForm({ ...form, jenis_kelamin: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />

        {/* TouchableOpacity as the submit button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Update Pegawai' : 'Tambah Pegawai'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol kembali ke daftar pegawai */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('PegawaiScreen')} // Navigasi kembali ke PegawaiScreen
      >
        <Text style={styles.buttonText}>Kembali ke Daftar Pegawai</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#eeacbf', // Background header dengan warna custom
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eeacbf',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
  backgroundColor: '#DA7297', // Background pink untuk tombol
  padding: 12,
  marginTop: 20,
  borderRadius: 5,
  alignItems: 'center',
  marginHorizontal: 15,
},

  backButton: {
    backgroundColor: '#eeacbf',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CrudPegawai;
