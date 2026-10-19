import { render, fireEvent } from '@testing-library/react-native';
import ProductoItem from '../../components/ProductoItem';

describe('ProductoItem', () => {
  const producto = {
    id: '1',
    nombre: 'Cuaderno',
    comprado: false,
  };

  it('muestra el nombre y los botones del útil pendiente', () => {
    const { getByText } = render(
      <ProductoItem
        producto={producto}
        onMarcar={jest.fn()}
        onEliminar={jest.fn()}
      />
    );

    expect(getByText('Cuaderno')).toBeTruthy();
    expect(getByText('Marcar comprado')).toBeTruthy();
    expect(getByText('Eliminar')).toBeTruthy();
  });

  it('llama a la acción de eliminar al presionar el botón', () => {
    const onEliminar = jest.fn();

    const { getByText } = render(
      <ProductoItem
        producto={producto}
        onMarcar={jest.fn()}
        onEliminar={onEliminar}
      />
    );

    fireEvent.press(getByText('Eliminar'));

    expect(onEliminar).toHaveBeenCalledTimes(1);
  });
});