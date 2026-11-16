// Estado para el nombre del útil.
import { useState } from 'react';
import {
  ScrollView, Text, TextInput, Button, Image, StyleSheet, Alert,
} from 'react-native';
import { useProductos, type Producto } from '../context/ProductosContext';
import { seleccionarImagen, obtenerUbicacion, seleccionarContacto } from '../utils/recursosDispositivo';

// Recibimos la función para volver a la pantalla anterior.
type Props = {
  navigation: {
    goBack: () => void;
  };
};

export default function AltaProductoScreen({ navigation }: Props) {
  // Nombre ingresado y acceso a la lista compartida.
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const { agregarProducto, cargando } = useProductos();
  const [imagen, setImagen] = useState<string>();
  const [ubicacion, setUbicacion] = useState<Producto['ubicacion']>();
  const [contacto, setContacto] = useState<Producto['contacto']>();
  const [ocupado, setOcupado] = useState(false);

  // Mientras esperamos el permiso o el resultado, deshabilitamos los botones.
  async function handleRecurso(recurso: 'camara' | 'galeria' | 'ubicacion' | 'contacto') {
    if (ocupado) return;
    setOcupado(true);
    try {
      if (recurso === 'camara' || recurso === 'galeria') {
        const foto = await seleccionarImagen(recurso === 'camara');
        if (foto) setImagen(foto);
      } else if (recurso === 'ubicacion') {
        setUbicacion(await obtenerUbicacion());
      } else {
        const proveedor = await seleccionarContacto();
        if (proveedor) setContacto(proveedor);
      }
    } catch (error) {
      Alert.alert('Recurso no disponible', error instanceof Error ? error.message : 'No se pudo acceder al recurso.');
    } finally {
      setOcupado(false);
    }
  }

  // Guardamos el útil y volvemos solo si se guardó correctamente.
  async function handleGuardar() {
    if (ocupado) return;
    setOcupado(true);
    try {
      // El store comprueba que el nombre no esté vacío.
      await agregarProducto(nombre, {
        imagen,
        direccion: direccion.trim(),
        ubicacion,
        contacto,
      });
      navigation.goBack();
    } catch (error) {
      const mensaje = error instanceof Error
        ? error.message
        : 'No se pudo guardar el útil.';

      Alert.alert('Error', mensaje);
    } finally {
      setOcupado(false);
    }
  }

  // Formulario de alta.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo útil escolar</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del útil"
        value={nombre}
        onChangeText={setNombre}
      />

      <Button title="Tomar foto" onPress={() => handleRecurso('camara')} disabled={ocupado} />
      <Button title="Elegir de galería" onPress={() => handleRecurso('galeria')} disabled={ocupado} />
      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} accessibilityLabel="Foto del útil" />}

      <TextInput
        style={styles.input}
        placeholder="Dirección del comercio (opcional)"
        value={direccion}
        onChangeText={setDireccion}
      />
      <Button title="Estoy en el comercio: guardar ubicación actual" onPress={() => handleRecurso('ubicacion')} disabled={ocupado} />
      {ubicacion && <Text>Ubicación GPS: {ubicacion.latitude.toFixed(5)}, {ubicacion.longitude.toFixed(5)}</Text>}

      <Button title="Seleccionar proveedor de contactos" onPress={() => handleRecurso('contacto')} disabled={ocupado} />
      {contacto && <Text>Proveedor: {contacto.nombre} {contacto.telefono}</Text>}
      {ocupado && <Text>Esperando permiso o resultado...</Text>}

      {/* Esperamos la carga inicial de la lista antes de agregar. */}
      <Button
        title="Guardar"
        onPress={handleGuardar}
        disabled={cargando || ocupado}
      />
    </ScrollView>
  );
}

// Estilos del formulario.
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  imagen: { width: 120, height: 120, marginVertical: 12 },
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
