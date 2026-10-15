// Herramientas para compartir la lista y cargar los datos al iniciar.
import {createContext,useContext,useEffect,useState,ReactNode,} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Datos de cada útil escolar.
export type Producto = {
  id: string;
  nombre: string;
  comprado: boolean;
};

// Datos y acciones que compartirán las pantallas.
type ProductosContextType = {
  productos: Producto[];
  cargando: boolean;
  agregarProducto: (nombre: string) => Promise<void>;
  marcarProducto: (id: string) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
};

// Clave distinta de la utilizada para guardar el usuario.
const PRODUCTOS_KEY = '@lista_compras_productos';

const ProductosContext = createContext<
  ProductosContextType | undefined
>(undefined);

export function ProductosProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Lista compartida y estado de la carga inicial.
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Recuperamos la lista guardada cuando se monta el proveedor.
  useEffect(() => {
    async function cargarProductos() {
      try {
        const guardados = await AsyncStorage.getItem(PRODUCTOS_KEY);

        if (guardados !== null) {
          setProductos(JSON.parse(guardados));
        }
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los útiles.');
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  // Guardamos la lista y después actualizamos lo que muestra la app.
  async function guardarProductos(lista: Producto[]) {
    await AsyncStorage.setItem(
      PRODUCTOS_KEY,
      JSON.stringify(lista)
    );

    setProductos(lista);
  }

  // Agregamos un útil pendiente de compra.
  async function agregarProducto(nombre: string) {
    const nombreLimpio = nombre.trim();

    if (nombreLimpio === '') {
      throw new Error('Escribí el nombre del útil.');
    }

    const nuevoProducto: Producto = {
      id: Date.now().toString(),
      nombre: nombreLimpio,
      comprado: false,
    };

    await guardarProductos([...productos, nuevoProducto]);
  }

  // Cambiamos entre comprado y pendiente.
  async function marcarProducto(id: string) {
    const actualizados = productos.map((producto) =>
      producto.id === id
        ? { ...producto, comprado: !producto.comprado }
        : producto
    );

    await guardarProductos(actualizados);
  }

  // Quitamos de la lista el producto seleccionado.
  async function eliminarProducto(id: string) {
    const actualizados = productos.filter(
      (producto) => producto.id !== id
    );

    await guardarProductos(actualizados);
  }

  // Compartimos la lista y sus acciones.
  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        agregarProducto,
        marcarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

// Las pantallas accederán a la lista mediante useProductos().
export function useProductos() {
  const context = useContext(ProductosContext);

  if (context === undefined) {
    throw new Error(
      'useProductos debe utilizarse dentro de ProductosProvider.'
    );
  }

  return context;
}