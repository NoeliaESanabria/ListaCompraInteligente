import { View, Text, Button, Image, StyleSheet } from 'react-native';
import type { Producto } from '../context/ProductosContext';

// Recibimos el útil y las acciones desde Home.
type Props = {
  producto: Producto;
  onMarcar: () => void;
  onEliminar: () => void;
  onCalendario?: () => void;
  ocupado?: boolean;
};

export default function ProductoItem({
  producto,
  onMarcar,
  onEliminar,
  onCalendario,
  ocupado,
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

      {producto.imagen && (
        <Image source={{ uri: producto.imagen }} style={styles.imagen} accessibilityLabel={`Foto de ${producto.nombre}`} />
      )}
      {!!producto.direccion && <Text>Dirección del comercio: {producto.direccion}</Text>}
      {producto.ubicacion && (
        <Text>Ubicación GPS: {producto.ubicacion.latitude.toFixed(5)}, {producto.ubicacion.longitude.toFixed(5)}</Text>
      )}
      {producto.contacto && (
        <Text>Proveedor: {producto.contacto.nombre} {producto.contacto.telefono}</Text>
      )}
      {producto.fechaRecordatorio && (
        <Text>Calendario: {new Date(producto.fechaRecordatorio).toLocaleString()}</Text>
      )}

      <Button
        title={producto.comprado ? 'Marcar pendiente' : 'Marcar comprado'}
        onPress={onMarcar}
        disabled={ocupado}
      />

      <Button title="Eliminar" onPress={onEliminar} disabled={ocupado} />
      {onCalendario && (
        <Button
          title={producto.eventoId ? 'Recordatorio creado' : 'Calendario: mañana a las 10'}
          onPress={onCalendario}
          disabled={ocupado || !!producto.eventoId}
        />
      )}
    </View>
  );
}

// Estilos de cada útil.
const styles = StyleSheet.create({
  imagen: { width: 100, height: 100, marginBottom: 8 },
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
