import React, { useEffect, useState } from 'react';

interface Transaccion {
  id: string;
  fecha: string;
  descripcion: string;
  tipo: 'aporte' | 'retiro' | 'rendimiento';
  monto: number;
}

interface Props {
  cuentaId?: string;
}

const API_URL = process.env.API_URL || 'http://localhost:3001';

function formatoMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);
}

function formatoFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CO');
}

export default function TablaTransacciones({ cuentaId = '1001' }: Props) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    fetch(`${API_URL}/api/transacciones/${cuentaId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        return res.json();
      })
      .then((data: Transaccion[]) => {
        if (!cancelado) setTransacciones(data);
      })
      .catch((err: Error) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [cuentaId]);

  return (
    <div data-testid="tabla-transacciones" style={{ padding: '1rem' }}>
      <h2>Transacciones</h2>

      {cargando && <p>Cargando transacciones...</p>}
      {error && <p role="alert">No se pudieron cargar las transacciones: {error}</p>}

      {!cargando && !error && (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t) => (
              <tr key={t.id} data-testid="fila-transaccion">
                <td>{formatoFecha(t.fecha)}</td>
                <td>{t.descripcion}</td>
                <td>{t.tipo}</td>
                <td>{formatoMoneda(t.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
