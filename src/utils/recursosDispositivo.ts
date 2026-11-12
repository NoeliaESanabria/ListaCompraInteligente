import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
// SDK 57 conserva estas funciones en la entrada /legacy.
import * as Contacts from 'expo-contacts/legacy';
import * as Calendar from 'expo-calendar/legacy';
import { File, Paths } from 'expo-file-system';
import type { Producto } from '../context/ProductosContext';

// Si el permiso está pendiente, mostramos la solicitud del sistema.
// Si fue bloqueado, explicamos cómo habilitarlo desde los ajustes.
export function comprobarPermiso(
  permiso: { granted: boolean; canAskAgain: boolean },
  recurso: string
) {
  if (!permiso.granted) {
    const mensaje = permiso.canAskAgain
      ? 'Podés volver a intentarlo y aceptar el permiso.'
      : 'Habilitá el permiso desde los ajustes del celular.';
    throw new Error(`No se concedió el permiso de ${recurso}. ${mensaje}`);
  }
}

export async function seleccionarImagen(camara: boolean) {
  const permiso = camara
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  comprobarPermiso(permiso, camara ? 'cámara' : 'galería');

  const opciones: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 0.5,
  };
  const resultado = camara
    ? await ImagePicker.launchCameraAsync(opciones)
    : await ImagePicker.launchImageLibraryAsync(opciones);

  // Cancelar la selección no es un error.
  if (resultado.canceled) return null;

  // La cámara devuelve un archivo temporal. Lo conservamos en documentos.
  const origen = new File(resultado.assets[0].uri);
  const destino = new File(Paths.document, `util-${Date.now()}${origen.extension || '.jpg'}`);
  origen.copy(destino);
  return destino.uri;
}

export async function obtenerUbicacion() {
  const permiso = await Location.requestForegroundPermissionsAsync();
  comprobarPermiso(permiso, 'ubicación');
  if (!(await Location.hasServicesEnabledAsync())) {
    throw new Error('Activá la ubicación (GPS) del celular y volvé a intentar.');
  }
  const resultado = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: resultado.coords.latitude,
    longitude: resultado.coords.longitude,
  };
}

export async function seleccionarContacto() {
  const permiso = await Contacts.requestPermissionsAsync();
  comprobarPermiso(permiso, 'contactos');
  const contacto = await Contacts.presentContactPickerAsync();
  if (!contacto) return null;
  return {
    id: contacto.id,
    nombre: contacto.name || 'Sin nombre',
    telefono: contacto.phoneNumbers?.[0]?.number,
  };
}

export async function crearRecordatorioCalendario(producto: Producto) {
  const permiso = await Calendar.requestCalendarPermissionsAsync();
  comprobarPermiso(permiso, 'calendario');

  const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const calendario = calendarios.find((item) => item.allowsModifications);
  if (!calendario) {
    throw new Error('Agregá un calendario editable en el celular y volvé a intentar.');
  }

  // Recordatorio simple: mañana a las 10, durante 30 minutos.
  const inicio = new Date();
  inicio.setDate(inicio.getDate() + 1);
  inicio.setHours(10, 0, 0, 0);
  const fin = new Date(inicio.getTime() + 30 * 60 * 1000);

  const eventoId = await Calendar.createEventAsync(calendario.id, {
    title: `Comprar ${producto.nombre}`,
    startDate: inicio,
    endDate: fin,
    notes: `Lista de útiles. Producto: ${producto.id}. Proveedor: ${producto.contacto?.nombre || 'Sin contacto'}.`,
    location: producto.ubicacion
      ? `${producto.ubicacion.latitude}, ${producto.ubicacion.longitude}`
      : '',
    alarms: [{ relativeOffset: -10 }],
  });
  return { eventoId, fechaRecordatorio: inicio.toISOString() };
}
