// Estado para el nombre del útil.
import { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
} from 'react-native';
import { useProductos } from '../context/ProductosContext';

// Recibimos la función para volver a la pantalla anterior.
type Props = {
  navigation: {
    goBack: () => void;
  };
};

export default function AltaProductoScreen({ navigation }: Props) {
  // Nombre ingresado y acceso a la lista compartida.
  const [nombre, setNombre] = useState('');
  const { agregarProducto, cargando } = useProductos();

  // Guardamos el útil y volvemos solo si se guardó correctamente.
  async function handleGuardar() {
    try {
      // El contexto comprueba que el nombre no esté vacío.
      await agregarProducto(nombre);
      navigation.goBack();
    } catch (error) {
      const mensaje = error instanceof Error
        ? error.message
        : 'No se pudo guardar el útil.';

      Alert.alert('Error', mensaje);
    }
  }

  // Formulario de alta.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo útil escolar</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del útil"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Esperamos la carga inicial de la lista antes de agregar. */}
      <Button
        title="Guardar"
        onPress={handleGuardar}
        disabled={cargando}
      />
    </View>
  );
}

// Estilos del formulario.
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
});