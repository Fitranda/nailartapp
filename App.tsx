import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importing screens
import HomeScreen from './src/screens/HomeScreen';
import NailArt from './src/screens/NailArt';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ServiceAdmin from './src/screens/ServiceAdmin';
import Navigasi from './src/screens/Navigasi';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PegawaiScreen from './src/screens/PegawaiScreen';
import PelayananScreen from './src/screens/PelayananScreen';
import PemesananScreen from './src/screens/PemesananScreen';
import PemesananClientScreen from './src/screens/PemesananClientScreen';
import CrudPegawai from './src/screens/CrudPegawai';
import BuatPesananScreen from './src/screens/BuatPesananScreen';
import SplashScreen from './src/screens/SplashScreen';
import CreditScreen from './src/screens/CreditScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track login status
  const [showSplash, setShowSplash] = useState(true); // Track SplashScreen visibility

  useEffect(() => {
    const initApp = async () => {
      // Simulate SplashScreen for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowSplash(false); // Hide SplashScreen

      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsAuthenticated(true); // User is logged in
        } else {
          setIsAuthenticated(false); // User is not logged in
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsAuthenticated(false);
      }
    };

    initApp();
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'HomeScreen' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NailArt" component={NailArt} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Credit" component={CreditScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ServiceAdmin" component={ServiceAdmin} />
        <Stack.Screen name="Navigasi" component={Navigasi} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="PegawaiScreen" component={PegawaiScreen} />
        <Stack.Screen name="Pelayanan" component={PelayananScreen} />
        <Stack.Screen name="Pemesanan" component={PemesananScreen} />
        <Stack.Screen name="PemesananClient" component={PemesananClientScreen} />
        <Stack.Screen name="CrudPegawai" component={CrudPegawai} />
        <Stack.Screen name="BuatPesanan" component={BuatPesananScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
