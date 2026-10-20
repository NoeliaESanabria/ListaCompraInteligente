# Lista de compras inteligente — Útiles escolares

Aplicación desarrollada con React Native, Expo y TypeScript.

Permite organizar la compra de útiles escolares,
identificar los pendientes y programar un recordatorio local.

## Funcionalidades

- Registro local con usuario y contraseña.
- Inicio de sesión validando los datos guardados.
- Acceso a las pantallas principales solo con sesión iniciada.
- Alta, listado y eliminación de útiles.
- Marcar útiles como comprados o pendientes.
- Contador de útiles pendientes.
- Recordatorio local de compra a los 5 segundos.
- Aviso cuando no hay útiles pendientes, sin programar un recordatorio.
- Persistencia del usuario, los útiles y su estado con AsyncStorage.
- Cierre de sesión.

## Tecnologías

- React Native y Expo SDK 57.
- TypeScript.
- React Navigation con Native Stack.
- AsyncStorage.
- expo-notifications.
- Jest, jest-expo y React Native Testing Library.

## Cómo ejecutar

Se necesita Node.js, npm y Expo Go compatible con SDK 57
en un celular.

Desde la carpeta del proyecto:

```bash
npm ci
npx expo start
```

Escanear el QR con Expo Go. Para la conexión local, el celular
y la computadora deben estar en la misma red Wi-Fi.

## Uso

1. Registrar una cuenta.
2. Iniciar sesión con los datos registrados.
3. Agregar útiles desde «Agregar útil».
4. Marcar los útiles comprados o eliminar los que corresponda.
5. Con útiles pendientes, presionar «Recordar compra en 5 segundos».
6. Conceder el permiso de notificaciones si se solicita.

## Autenticación y almacenamiento

- Se admite una sola cuenta registrada por dispositivo.
- La autenticación es local, sin backend.
- La contraseña se guarda localmente sin cifrado.
- La cuenta y los útiles se conservan al cerrar la aplicación.
- La sesión se mantiene en memoria: al iniciar la app desde cero,
  es necesario volver a ingresar.
- Cerrar sesión no elimina la cuenta ni los útiles.

## Componente reutilizable

`ProductoItem` muestra el nombre de cada útil y sus botones
para marcar comprado o pendiente y eliminar.

Home reutiliza el componente para cada elemento de la lista.

## Tests

Ejecutar:

```bash
npm test
```

Se implementaron tres pruebas:

1. Renderizado del nombre y los botones de ProductoItem.
2. Ejecución de la acción de eliminar al presionar el botón.
3. Cálculo de pendientes excluyendo los útiles comprados.

Resultado verificado: 3 tests aprobados en 2 archivos de pruebas.

## Notificaciones en Expo Go

Se verificó la recepción del recordatorio local en el celular.

En Expo Go SDK 57 puede aparecer una advertencia al intentar
crear el canal personalizado de Android. Se maneja ese error
para continuar con los permisos y la programación, siguiendo
el ejemplo de la Unidad 7 del profesor.

## Autora

Noelia Sanabria