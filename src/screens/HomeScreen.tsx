import { View, Text, Button, FlatList, StyleSheet, Alert,} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';
import ProductoItem from '../components/ProductoItem';
import { programarRecordatorio } from '../utils/notificaciones';
import { contarPendientes } from '../utils/contarPendientes';

// Navegación hacia el formulario de alta.
type Props = {
  navigation: {
    navigate: (pantalla: 'AltaProducto') => void;
  };
};

export default function HomeScreen({ navigation }: Props) {
  const { userNombre, logout } = useAuth();
  const {
    productos,
    cargando,
    marcarProducto,
    eliminarProducto,
  } = useProductos();

  // Contamos los útiles pendientes de compra.
  const pendientes = contarPendientes(productos);

  // Cambiamos entre comprado y pendiente.
  async function handleMarcar(id: string) {
    try {
      await marcarProducto(id);
    } catch {
      Alert.alert('Error', 'No se pudo cambiar el estado del útil.');
    }
  }

  // Eliminamos el útil seleccionado.
  async function handleEliminar(id: string) {
    try {
      await eliminarProducto(id);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el útil.');
    }
  }

// Programamos el recordatorio si hay útiles pendientes.
async function handleRecordatorio() {
  if (pendientes === 0) {
    Alert.alert('Sin pendientes', 'Ya tenés todos los útiles comprados.');
    return;
  }

  try {
    await programarRecordatorio();
    Alert.alert('Recordatorio', 'Recibirás una notificación en 5 segundos.');
  } catch (error) {
    const mensaje = error instanceof Error
      ? error.message
      : 'No se pudo programar el recordatorio.';

    Alert.alert('Error', mensaje);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {userNombre}</Text>
      <Text style={styles.contador}>Pendientes: {pendientes}</Text>

      <Button
        title="Agregar útil"
        onPress={() => navigation.navigate('AltaProducto')}
        disabled={cargando}
      />

      <Button
          title="Recordar compra en 5 segundos"
          onPress={handleRecordatorio}
          disabled={cargando}
      />

      {/* Reutilizamos ProductoItem para cada útil de la lista. */}
      <FlatList
        style={styles.lista}
        data={productos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text>
            {cargando ? 'Cargando útiles...' : 'No hay útiles en la lista.'}
          </Text>
        }
        renderItem={({ item }) => (
          <ProductoItem
            producto={item}
            onMarcar={() => handleMarcar(item.id)}
            onEliminar={() => handleEliminar(item.id)}
          />
        )}
      />

      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

// Los estilos de cada útil quedaron en ProductoItem.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  contador: {
    fontSize: 18,
    marginBottom: 16,
  },
  lista: {
    flex: 1,
    marginVertical: 16,
  },
});