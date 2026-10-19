import { contarPendientes } from '../contarPendientes';

describe('contarPendientes', () => {
  it('cuenta los pendientes y excluye los comprados', () => {
    const productos = [
      { id: '1', nombre: 'Cuaderno', comprado: false },
      { id: '2', nombre: 'Goma', comprado: true },
      { id: '3', nombre: 'Lápiz', comprado: false },
    ];

    expect(contarPendientes(productos)).toBe(2);
  });
});