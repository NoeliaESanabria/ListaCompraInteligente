import { View, Text, Button, StyleSheet } from 'react-native';
import type { Producto } from '../context/ProductosContext';

// Recibimos el útil y las acciones desde Home.
type Props = {
  producto: Producto;
  onMarcar: () => void;
  onEliminar: () => void;
};

export default function ProductoItem({
  producto,
  onMarcar,
  onEliminar,
}: Props) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.nombre,
          producto.comprado && styles.comprado,
        ]}
      >
        {producto.nombre}
      </Text>

      <Button
        title={producto.comprado ? 'Marcar pendiente' : 'Marcar comprado'}
        onPress={onMarcar}
      />

      <Button title="Eliminar" onPress={onEliminar} />
    </View>
  );
}

// Estilos de cada útil.
const styles = StyleSheet.create({
  container: {
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