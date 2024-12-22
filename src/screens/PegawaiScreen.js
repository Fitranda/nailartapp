import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PegawaiScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pegawai</Text>
      {/* Add your Pegawai content here */}
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
});

export default PegawaiScreen;