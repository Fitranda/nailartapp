import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const PemesananScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [services, setServices] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchOrders = async (date) => {
    try {
      const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getOrders`);
      const data = await response.json();
      if (data && data.data) {
        const filteredOrders = date ? data.data.filter(order => order.tanggal === date) : data.data;
        setOrders(filteredOrders);
      } else {
        alert('Gagal mengambil data pesanan.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getUsers`);
        const data = await response.json();
        if (data && data.data) {
          const usersMap = data.data.reduce((map, user) => {
            map[user.id_user] = user.nama;
            return map;
          }, {});
          setUsers(usersMap);
        } else {
          alert('Gagal mengambil data pengguna.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getServices`);
        const data = await response.json();
        if (data && data.data) {
          const servicesMap = data.data.reduce((map, service) => {
            map[service.id_layanan] = service.nama_layanan;
            return map;
          }, {});
          setServices(servicesMap);
        } else {
          alert('Gagal mengambil data layanan.');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchOrders(selectedDate.toISOString().split('T')[0]);
    fetchUsers();
    fetchServices();
  }, [selectedDate]);

  const completeOrder = (id_booking) => {
    if (!id_booking) {
      console.error('ID booking is required');
      return;
    }
  
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=completeOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_booking }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          alert('Pesanan berhasil diselesaikan!');
          fetchOrders(); // Refresh the orders list
        } else {
          alert('Gagal menyelesaikan pesanan.');
        }
      })
      .catch((error) => {
        console.error('Error completing order:', error);
      });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'batal':
        return styles.statusCancelled;
      case 'dipesan':
        return styles.statusBooked;
      case 'selesai':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Pelanggan: {users[item.id_user]}</Text>
      <Text style={styles.orderDescription}>Service: {services[item.id_layanan]}</Text>
      <Text style={[styles.orderDate, getStatusStyle(item.status)]}>Status: {item.status}</Text>
      <Text style={styles.orderDate}>Tanggal: {item.tanggal}</Text>
      <Text style={styles.orderDate}>Waktu Mulai: {item.waktu.slice(0, 5)}</Text>
      {item.status == 'dipesan' && (
        <View style={styles.buttonContainer}>
          <Button
            title="Selesaikan"
            onPress={() => completeOrder(item.id_pemesanan)}
            color="#4caf50"
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pemesanan</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Pilih Tanggal Pesanan</Text>
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
      <Text style={styles.selectedText}>{selectedDate.toLocaleDateString('id-ID')}</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id_booking}
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
  },
  orderItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDescription: {
    fontSize: 14,
    color: '#555',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  statusCancelled: {
    color: 'red',
  },
  statusBooked: {
    color: 'blue',
  },
  statusCompleted: {
    color: 'green',
  },
  buttonContainer: {
    marginTop: 10,
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
  backButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default PemesananScreen;