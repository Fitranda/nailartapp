import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PemesananClientScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchUserIdAndOrders = async (date) => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        fetchOrders(parsedUser.id_user, date);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    fetchUserIdAndOrders(selectedDate.toISOString().split('T')[0]);

    // Fetch service options from API
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getServices`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const servicesMap = data.data.reduce((map, service) => {
            map[service.id_layanan] = service.nama_layanan;
            return map;
          }, {});
          setServices(servicesMap);
        } else {
          alert('Gagal mengambil data service.');
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserIdAndOrders(selectedDate.toISOString().split('T')[0]);
    });

    return unsubscribe;
  }, [navigation, selectedDate]);

  const fetchOrders = (userId, date) => {
    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=getUserOrdersByDate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_user: userId, date }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setOrders(data.data); // Menyimpan data pesanan
        } else {
          console.error('Failed to fetch orders:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };

  const cancelOrder = (id_booking) => {
    if (!id_booking) {
      console.error('ID booking is required');
      return;
    }

    fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=cancelOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_booking }),
    })
      .then((response) => {
        console.log('Raw response:', response); // Log the raw response
        return response.text(); // Get response as text
      })
      .then((text) => {
        console.log('Response text:', text); // Log the response text
        try {
          const data = JSON.parse(text); // Parse the text as JSON
          console.log('Parsed data:', data); // Log the parsed data
          return data;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          throw error;
        }
      })
      .then((data) => {
        if (data.status === 'success') {
          alert('Pesanan berhasil dibatalkan!');
          fetchUserIdAndOrders(selectedDate.toISOString().split('T')[0]); // Refresh the orders list
        } else {
          alert('Gagal membatalkan pesanan.');
        }
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pemesanan Client</Text>
      
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
            fetchUserIdAndOrders(date.toISOString().split('T')[0]);
          }}
        />
      )}
      <Text style={styles.selectedText}>{selectedDate.toLocaleDateString('id-ID')}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Buat Pesanan Baru"
          onPress={() => navigation.navigate('BuatPesanan')}
          color="#DA7297"
        />
      </View>

      

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id_booking}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderTitle}>{services[item.id_layanan]}</Text>
            <Text style={[styles.orderDescription, getStatusStyle(item.status)]}>{item.status}</Text>
            <Text style={styles.orderDate}>{item.tanggal}</Text>
            <Text style={styles.orderTime}>{item.waktu}</Text>
            {item.status == 'dipesan' && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Batalkan"
                  onPress={() => cancelOrder(item.id_pemesanan)}
                  color="#e53935"
                />
              </View>
            )}
          </View>
        )}
      />
      
      {/* Bottom Navigation */}
           <View style={styles.bottomNav}>
             <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  createOrderButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#eeacbf',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
  cancelButton: {
    marginTop: 10,
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
  orderTime: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    marginVertical: 10,
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
  // Styling untuk Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#eeacbf',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
});



export default PemesananClientScreen;
