import {
  View, Text, Button, FlatList, StyleSheet, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';

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

  // Contamos los útiles que todavía no están comprados.
  const pendientes = productos.filter(
    (producto) => !producto.comprado
  ).length;

  // Cambiamos el estado del útil seleccionado.
  async function handleMarcar(id: string) {
    try {
      await marcarProducto(id);
    } catch {
      Alert.alert('Error', 'No se pudo cambiar el estado del útil.');
    }
  }

  // Eliminamos el útil de la lista.
  async function handleEliminar(id: string) {
    try {
      await eliminarProducto(id);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el útil.');
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

      {/* Mostramos la lista y las acciones de cada útil. */}
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
          <View style={styles.producto}>
            <Text
              style={[
                styles.nombre,
                item.comprado && styles.comprado,
              ]}
            >
              {item.nombre}
            </Text>

            <Button
              title={item.comprado ? 'Marcar pendiente' : 'Marcar comprado'}
              onPress={() => handleMarcar(item.id)}
            />

            <Button
              title="Eliminar"
              onPress={() => handleEliminar(item.id)}
            />
          </View>
        )}
      />

      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

// Estilos de la pantalla y de cada útil.
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
  producto: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nombre: {
    fontSize: 18,
    marginBottom: 8,
  },
  comprado: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});