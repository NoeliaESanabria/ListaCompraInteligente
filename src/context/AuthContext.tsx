// Herramientas para crear el contexto y manejar el estado.
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

// Almacenamiento local que conserva los datos al cerrar la app.
import AsyncStorage from '@react-native-async-storage/async-storage';

// Datos que guardaremos del usuario registrado.
type UsuarioRegistrado = {
  usuario: string;
  password: string;
};

// Datos y funciones que podrán utilizar las pantallas.
type AuthContextType = {
  isAuthenticated: boolean;
  userNombre: string | null;
  register: (usuario: string, password: string) => Promise<void>;
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Nombre con el que guardaremos la cuenta en AsyncStorage.
const USUARIO_KEY = '@lista_compras_usuario';

// Creamos el contexto. Al principio no tiene un proveedor.
const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// El proveedor compartirá la autenticación con sus componentes hijos.
export function AuthProvider({ children }: { children: ReactNode }) {
  // La app comienza sin una sesión iniciada.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userNombre, setUserNombre] = useState<string | null>(null);

  // Registra una cuenta y la guarda en el dispositivo.
  async function register(
    usuario: string,
    password: string
  ): Promise<void> {
    const nombre = usuario.trim();

    // No aceptamos campos vacíos o con solo espacios.
    if (nombre === '' || password.trim() === '') {
      throw new Error('Completá el usuario y la contraseña.');
    }

    // Evitamos reemplazar una cuenta que ya esté registrada.
    const usuarioGuardado = await AsyncStorage.getItem(USUARIO_KEY);

    if (usuarioGuardado !== null) {
      throw new Error(
        'Ya hay un usuario registrado en este dispositivo. Iniciá sesión.'
      );
    }

    // Armamos el objeto con los datos del registro.
    const nuevoUsuario: UsuarioRegistrado = {
      usuario: nombre,
      password: password,
    };

    // AsyncStorage guarda texto: convertimos el objeto a JSON.
    // El parcial permite guardar la contraseña sin cifrado.
    await AsyncStorage.setItem(
      USUARIO_KEY,
      JSON.stringify(nuevoUsuario)
    );

    // Registrarse no inicia sesión automáticamente.
    // Después del registro, la pantalla volverá al Login.
  }

  // Compara los datos ingresados con la cuenta registrada.
  async function login(
    usuario: string,
    password: string
  ): Promise<boolean> {
    const usuarioGuardado = await AsyncStorage.getItem(USUARIO_KEY);

    // Si no existe una cuenta, no permitimos ingresar.
    if (usuarioGuardado === null) {
      return false;
    }

    // Convertimos el texto JSON nuevamente en un objeto.
    const cuenta: UsuarioRegistrado = JSON.parse(usuarioGuardado);

    // Ambos datos deben coincidir con los registrados.
    if (
      cuenta.usuario !== usuario.trim() ||
      cuenta.password !== password
    ) {
      return false;
    }

    // Las credenciales coinciden: actualizamos la sesión.
    setUserNombre(cuenta.usuario);
    setIsAuthenticated(true);

    return true;
  }

  // Cierra la sesión sin borrar la cuenta ni los productos guardados.
  function logout() {
    setIsAuthenticated(false);
    setUserNombre(null);
  }

  // Compartimos los datos y funciones con las pantallas.
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userNombre,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Permite acceder al contexto mediante useAuth().
export function useAuth() {
  const context = useContext(AuthContext);

  // Detectamos si se intenta usar fuera de AuthProvider.
  if (context === undefined) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider.'
    );
  }

  return context;
}