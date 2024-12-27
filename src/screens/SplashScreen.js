import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../service/uploads/logo.png.png')} // Ganti dengan path logo Anda
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe7f1',
  },
  logo: {
    width: 150, // Sesuaikan ukuran logo
    height: 150, // Sesuaikan ukuran logo
  },
});

export default SplashScreen;
