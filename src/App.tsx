import React from 'react';
import TablaTransacciones from './components/TablaTransacciones';

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1>mfe-reportes (modo standalone)</h1>
      <TablaTransacciones />
    </div>
  );
}
