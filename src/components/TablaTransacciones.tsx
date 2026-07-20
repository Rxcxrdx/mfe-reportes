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

const colorPorTipo: Record<Transaccion['tipo'], string> = {
  aporte: '#2f855a',
  retiro: '#c53030',
  rendimiento: '#2b6cb0',
};

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
    <div
      data-testid="tabla-transacciones"
      style={{
        fontFamily: 'sans-serif',
        maxWidth: 720,
        margin: '1rem auto',
        padding: '1.5rem',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ margin: '0 0 1rem', color: '#1a202c' }}>Transacciones</h2>

      {cargando && <p style={{ color: '#718096' }}>Cargando transacciones...</p>}
      {error && (
        <p role="alert" style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '0.5rem', borderRadius: 6 }}>
          No se pudieron cargar las transacciones: {error}
        </p>
      )}

      {!cargando && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.5rem' }}>Fecha</th>
              <th style={{ padding: '0.5rem' }}>Descripción</th>
              <th style={{ padding: '0.5rem' }}>Tipo</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t, i) => (
              <tr
                key={t.id}
                data-testid="fila-transaccion"
                style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f7fafc' }}
              >
                <td style={{ padding: '0.5rem' }}>{formatoFecha(t.fecha)}</td>
                <td style={{ padding: '0.5rem' }}>{t.descripcion}</td>
                <td style={{ padding: '0.5rem', color: colorPorTipo[t.tipo], fontWeight: 600 }}>{t.tipo}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{formatoMoneda(t.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
