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

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track login status

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setIsAuthenticated(true); // User is logged in
        } else {
          setIsAuthenticated(false); // User is not logged in
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsAuthenticated(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isAuthenticated === null) {
    return null; // Show nothing while checking login status
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "HomeScreen" : "Login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NailArt" component={NailArt} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ServiceAdmin" component={ServiceAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
