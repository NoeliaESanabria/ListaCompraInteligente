import { Platform } from 'react-native';

// Imports utilizados en el ejemplo del profesor.
import { setNotificationHandler } from
  'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from
  'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from
  'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from
  'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from
  'expo-notifications/build/Notifications.types';

// Mostramos la notificación aunque la app esté abierta.
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function programarRecordatorio() {
  // En Expo Go puede fallar el canal: continuamos con los permisos.
  if (Platform.OS === 'android') {
    try {
      await setNotificationChannelAsync('compras', {
        name: 'Recordatorios de compra',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } catch (error) {
      console.warn('No se pudo crear el canal Android:', error);
    }
  }

  // Consultamos el permiso actual.
  const permisoActual = await getPermissionsAsync();
  let estado = permisoActual.status;

  // Solicitamos permiso si todavía no está concedido.
  if (estado !== 'granted') {
    const permiso = await requestPermissionsAsync({
      android: {},
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    estado = permiso.status;
  }

  if (estado !== 'granted') {
    throw new Error(
      'Activá las notificaciones de Expo Go en los ajustes del celular.'
    );
  }

  // Programamos la notificación sin indicar un canal personalizado.
  await scheduleNotificationAsync({
    content: {
      title: 'Útiles escolares',
      body: 'Recordá revisar los útiles pendientes de compra.',
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
}