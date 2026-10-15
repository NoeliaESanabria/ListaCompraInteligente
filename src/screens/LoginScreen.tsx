import { useState } from 'react';
import {
  View, Text, TextInput, Button,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// Pantalla a la que podemos navegar desde el login.
type Props = {
  navigation: {
    navigate: (pantalla: 'Registro') => void;
  };
};

export default function LoginScreen({ navigation }: Props) {
  // Datos del formulario y función de autenticación.
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  // Validamos los campos y comprobamos la cuenta registrada.
  async function handleLogin() {
    if (usuario.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Completá el usuario y la contraseña.');
      return;
    }

    try {
      const correcto = await login(usuario, password);

      if (!correcto) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch {
      Alert.alert('Error', 'No se pudieron leer los datos guardados.');
    }
  }

  // Formulario de inicio de sesión.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button title="Ingresar" onPress={handleLogin} />

      {/* Acceso al registro de la cuenta. */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.link}>No tengo cuenta. Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos de la pantalla.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  link: {
    color: '#0066cc',
    textAlign: 'center',
    padding: 16,
  },
});