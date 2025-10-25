// src/pages/TestControlFases.jsx
import ControlFasesTable from '../components/ControlFasesTable';

export default function TestControlFases() {
  const areas = [
    {
      id: '1',
      nombre: 'Matemáticas',
      nivel: 'Primaria',
      faseActual: 'Final',
      progreso: 100,
      clasificados: 12,
      noClasificados: 8,
      descalificados: 2,
      responsable: 'MG María González',
      estado: 'Concluido',
    },
    {
      id: '2',
      nombre: 'Física',
      nivel: 'Secundaria',
      faseActual: 'Clasificatorio',
      progreso: 75,
      clasificados: 18,
      noClasificados: 5,
      descalificados: 1,
      responsable: 'CQ Carlos Quispe',
      estado: 'En evaluación',
    },
    {
      id: '3',
      nombre: 'Química',
      nivel: 'Primaria',
      faseActual: 'Final',
      progreso: 100,
      clasificados: 15,
      noClasificados: 10,
      descalificados: 3,
      responsable: 'AR Ana Rodríguez',
      estado: 'Confirmado',
    },
    {
      id: '4',
      nombre: 'Biología',
      nivel: 'Secundaria',
      faseActual: 'Clasificatorio',
      progreso: 60,
      clasificados: 10,
      noClasificados: 12,
      descalificados: 0,
      responsable: 'LM Luis Mamani',
      estado: 'En evaluación',
    },
    {
      id: '5',
      nombre: 'Informática',
      nivel: 'Secundaria',
      faseActual: 'Final',
      progreso: 85,
      clasificados: 8,
      noClasificados: 6,
      descalificados: 1,
      responsable: 'PT Pedro Torrez',
      estado: 'Concluido',
    },
    {
      id: '6',
      nombre: 'Astronomía-Astrofísica',
      nivel: 'Primaria',
      faseActual: 'Clasificatorio',
      progreso: 45,
      clasificados: 5,
      noClasificados: 8,
      descalificados: 0,
      responsable: 'SV Sofía Vargas',
      estado: 'En evaluación',
    },
    {
      id: '7',
      nombre: 'Robótica',
      nivel: 'Secundaria',
      faseActual: 'Final',
      progreso: 100,
      clasificados: 10,
      noClasificados: 5,
      descalificados: 2,
      responsable: 'JR Juan Rojas',
      estado: 'Confirmado',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Control de Fases (Prueba)</h1>
      <ControlFasesTable areas={areas} rolUsuario="Administrador" />
    </div>
  );
}
