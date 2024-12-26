import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import '../global';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    // Validasi form
    if (email && password && confirmPassword && nama && telepon && alamat) {
      if (password === confirmPassword) {
        setIsLoading(true);
        setErrorMessage('');

        try {
          // Kirim data ke API untuk registrasi
          const response = await fetch(`http://${global.myApi}/nailartapp/src/service/api.php?op=registerUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nama,
              email,
              password,
              telepon,
              alamat,
              role: 'pelanggan', // bisa disesuaikan jika ingin mengirim role lain
            }),
          });

          const data = await response.json();

          if (data.status === 'success') {
            console.log('Registration successful');
            // Arahkan ke halaman login setelah berhasil register
            navigation.replace('Login');
          } else {
            setErrorMessage(data.message); // Menampilkan pesan error dari API
          }
        } catch (error) {
          console.error('Error registering:', error);
          setErrorMessage('Something went wrong. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setErrorMessage('Passwords do not match');
      }
    } else {
      setErrorMessage('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={telepon}
        onChangeText={setTelepon}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={alamat}
        onChangeText={setAlamat}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <Button title={isLoading ? 'Registering...' : 'Register'} onPress={handleRegister} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login here
      </Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('HomeScreen')} />
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
    color: '#DA7297',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default RegisterScreen;
