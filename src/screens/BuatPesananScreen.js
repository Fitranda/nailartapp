import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuatPesananScreen = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser.id_user);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();

    // Fetch service options from API
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getServices`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setServices(data.data);
        } else {
          alert('Gagal mengambil data service.');
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    // Kirim data pesanan ke API
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: selectedService,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime.toISOString(),
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Pesanan berhasil dibuat!');
          navigation.navigate('PemesananClient'); // Navigate to the orders screen
        } else {
          alert('Gagal membuat pesanan.' + data.message);
        }
      })
      .catch((error) => {
        console.error('Error creating order:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Pesanan</Text>
      <Picker
        selectedValue={selectedService}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedService(itemValue)}
      >
        <Picker.Item label="Pilih Service" value="" />
        {services.map((service) => (
          <Picker.Item key={service.id_layanan} label={service.nama_layanan} value={service.id_layanan} />
        ))}
      </Picker>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Pilih Tanggal</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            setSelectedDate(date || selectedDate);
          }}
        />
      )}
      <Text style={styles.selectedText}>Tanggal Terpilih: {selectedDate.toLocaleDateString('id-ID')}</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Pilih Waktu Mulai</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            setSelectedTime(date || selectedTime);
          }}
        />
      )}
      <Text style={styles.selectedText}>Waktu Mulai Terpilih: {selectedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#5c6bc0" />
      </View>
      
      <View style={styles.buttonContainer}>
        {/* Tombol untuk kembali */}
        <Button
          title="Kembali"
          onPress={() => navigation.goBack()}
          color="#757575"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  dateButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default BuatPesananScreen;
