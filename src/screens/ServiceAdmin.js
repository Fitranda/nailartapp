import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Validasi form
    if (email && password) {
      setIsLoading(true);
      setErrorMessage('');

      try {
        // Kirim data ke API untuk login
        const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=loginUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (data.status === 'success') {
          console.log('Login successful');
          const user = data.data;

          // Cek role pengguna dan arahkan ke halaman yang sesuai
          if (user.role === 'admin') {
            navigation.replace('ServiceAdmin'); // Arahkan ke ServiceAdmin jika role admin
          } else {
            navigation.replace('ServiceAdmin', { user }); // Arahkan ke HomeScreen jika role pengguna
          }
        } else {
          setErrorMessage(data.message); // Menampilkan pesan error dari API
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setErrorMessage('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title={isLoading ? 'Logging in...' : 'Login'} onPress={handleLogin} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here
      </Text>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 20,
    color: '#007bff',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
