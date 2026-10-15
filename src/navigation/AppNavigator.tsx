// Herramientas para navegar entre pantallas mediante Stack.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Estado de autenticación compartido.
import { useAuth } from '../context/AuthContext';

// Pantallas de la aplicación.
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import HomeScreen from '../screens/HomeScreen';
import AltaProductoScreen from '../screens/AltaProductoScreen';

// Nombres de las rutas. Ninguna recibe parámetros.
type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Home: undefined;
  AltaProducto: undefined;
};

// Creamos el navegador con las rutas definidas.
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // Consultamos si el usuario inició sesión.
  const { isAuthenticated } = useAuth();

  // Las pantallas disponibles dependen del estado de la sesión.
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            {/* Pantallas accesibles después de iniciar sesión. */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Útiles escolares' }}
            />

            <Stack.Screen
              name="AltaProducto"
              component={AltaProductoScreen}
              options={{ title: 'Agregar útil' }}
            />
          </>
        ) : (
          <>
            {/* Pantallas accesibles sin iniciar sesión. */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />

            <Stack.Screen
              name="Registro"
              component={RegistroScreen}
              options={{ title: 'Registro' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}