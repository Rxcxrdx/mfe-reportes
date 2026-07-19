import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TablaTransacciones from './TablaTransacciones';

const mockTransacciones = Array.from({ length: 10 }, (_, i) => ({
  id: `1001-txn-${i + 1}`,
  fecha: `2026-07-0${(i % 9) + 1}T09:00:00.000Z`,
  descripcion: i % 2 === 0 ? 'Aporte mensual empleador' : 'Retiro parcial voluntario',
  tipo: i % 2 === 0 ? ('aporte' as const) : ('retiro' as const),
  monto: i % 2 === 0 ? 100000 + i * 1000 : -(50000 + i * 1000),
}));

describe('TablaTransacciones', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTransacciones),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('carga y renderiza las 10 transacciones en una tabla', async () => {
    render(<TablaTransacciones cuentaId="1001" />);

    expect(screen.getByText(/cargando transacciones/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId('fila-transaccion')).toHaveLength(10);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/transacciones/1001');
    expect(screen.getAllByText('Aporte mensual empleador').length).toBeGreaterThan(0);
  });

  it('muestra un mensaje de error si la petición falla', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    render(<TablaTransacciones cuentaId="1001" />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron cargar las transacciones');
    });
  });
});
