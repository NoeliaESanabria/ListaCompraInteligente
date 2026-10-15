import { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// Pantalla a la que podemos volver desde el registro.
type Props = {
  navigation: {
    navigate: (pantalla: 'Login') => void;
  };
};

export default function RegistroScreen({ navigation }: Props) {
  // Datos del formulario y función para registrar la cuenta.
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  // El contexto valida los campos y guarda la cuenta.
  async function handleRegistro() {
    try {
      await register(usuario, password);

      Alert.alert('Registro exitoso', 'Ahora podés iniciar sesión.');
      navigation.navigate('Login');
    } catch (error) {
      const mensaje = error instanceof Error
        ? error.message
        : 'No se pudo guardar la cuenta.';

      Alert.alert('Error', mensaje);
    }
  }

  // Formulario de registro.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

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

      <Button title="Registrarme" onPress={handleRegistro} />

      {/* Permite volver sin registrar una cuenta. */}
      <View style={styles.backButton}>
        <Button
          title="Volver al login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
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
  backButton: {
    marginTop: 16,
  },
});