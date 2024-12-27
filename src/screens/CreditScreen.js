import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CreditScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Final Project Aplikasi Mobile</Text>
      <Text style={styles.title}>by Kelompok 3:</Text>
      <Text style={styles.creditItem}>Fitranda Ramadhana - 22081010005</Text>
      <Text style={styles.creditItem}>Talitha Atha Anastasya - 22081010054</Text>
      <Text style={styles.creditItem}>Gayuh Abdi Mahardika - 22081010067</Text>
      <Text style={styles.creditItem}>Agatha Diani Putri Saka - 22081010094</Text>
      <Text style={styles.creditItem}>Milen Juventus Dappa Deke - 22081010259</Text>
      {/* Add more members as needed */}
      <Button title="Back" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  creditItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default CreditScreen;
