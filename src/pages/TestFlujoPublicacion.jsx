// src/pages/TestFlujoPublicacion.jsx
import FlujoPublicacionPanel from '../components/FlujoPublicacionPanel';

export default function TestFlujoPublicacion() {
  const areas = [
    { id: '1', nombre: 'Matemáticas', estado: 'Confirmado' },
    { id: '2', nombre: 'Física', estado: 'En evaluación' },
    { id: '3', nombre: 'Química', estado: 'Concluido' },
    { id: '4', nombre: 'Biología', estado: 'Confirmado' },
    { id: '5', nombre: 'Informática', estado: 'Concluido' },
    { id: '6', nombre: 'Astronomía-Astrofísica', estado: 'En evaluación' },
    { id: '7', nombre: 'Robótica', estado: 'Confirmado' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Resultados y Reportes (Prueba)</h1>
      <FlujoPublicacionPanel areas={areas} />
    </div>
  );
}