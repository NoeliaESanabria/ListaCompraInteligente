// Contextos de autenticación y productos.
import { AuthProvider } from './src/context/AuthContext';
import { ProductosProvider } from './src/context/ProductosContext';

// Navegación de la aplicación.
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProductosProvider>
        <AppNavigator />
      </ProductosProvider>
    </AuthProvider>
  );
}