import { useEffect, type ReactNode } from 'react';
import { Alert } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Los datos nuevos son opcionales para conservar los útiles del parcial 1.
export type Producto = {
  id: string;
  nombre: string;
  comprado: boolean;
  imagen?: string;
  direccion?: string;
  ubicacion?: { latitude: number; longitude: number };
  contacto?: { id: string; nombre: string; telefono?: string };
  eventoId?: string;
  fechaRecordatorio?: string;
};

type ProductosStore = {
  productos: Producto[];
  cargando: boolean;
  cargarProductos: () => Promise<void>;
  agregarProducto: (nombre: string, datos?: Partial<Producto>) => Promise<void>;
  actualizarProducto: (id: string, cambios: Partial<Producto>) => Promise<void>;
  marcarProducto: (id: string) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
};

// Conservamos la misma clave de almacenamiento del parcial 1.
const PRODUCTOS_KEY = '@lista_compras_productos';

export const useProductos = create<ProductosStore>((set, get) => {
  // Actualizamos la pantalla solo después de guardar correctamente.
  async function guardarProductos(lista: Producto[]) {
    await AsyncStorage.setItem(PRODUCTOS_KEY, JSON.stringify(lista));
    set({ productos: lista });
  }

  return {
    productos: [],
    cargando: true,

    cargarProductos: async () => {
      try {
        const guardados = await AsyncStorage.getItem(PRODUCTOS_KEY);
        if (guardados !== null) {
          set({ productos: JSON.parse(guardados) });
        }
      } finally {
        set({ cargando: false });
      }
    },

    agregarProducto: async (nombre, datos = {}) => {
      const nombreLimpio = nombre.trim();
      if (nombreLimpio === '') {
        throw new Error('Escribí el nombre del útil.');
      }
      const nuevoProducto: Producto = {
        ...datos,
        id: Date.now().toString(),
        nombre: nombreLimpio,
        comprado: false,
      };
      await guardarProductos([...get().productos, nuevoProducto]);
    },

    actualizarProducto: async (id, cambios) => {
      const actualizados = get().productos.map((producto) =>
        producto.id === id ? { ...producto, ...cambios } : producto
      );
      await guardarProductos(actualizados);
    },

    marcarProducto: async (id) => {
      const producto = get().productos.find((item) => item.id === id);
      if (producto) {
        await get().actualizarProducto(id, { comprado: !producto.comprado });
      }
    },

    eliminarProducto: async (id) => {
      const actualizados = get().productos.filter((producto) => producto.id !== id);
      await guardarProductos(actualizados);
    },
  };
});

// Conservamos el proveedor del proyecto original para cargar los datos al iniciar.
// El estado de la lista ahora se maneja con Zustand, como pide el parcial 2.
export function ProductosProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    useProductos.getState().cargarProductos().catch(() => {
      Alert.alert('Error', 'No se pudieron cargar los útiles.');
    });
  }, []);

  return <>{children}</>;
}
