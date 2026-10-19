import type { Producto } from '../context/ProductosContext';

// Contamos solamente los útiles que no están comprados.
export function contarPendientes(productos: Producto[]): number {
  return productos.filter((producto) => !producto.comprado).length;
}