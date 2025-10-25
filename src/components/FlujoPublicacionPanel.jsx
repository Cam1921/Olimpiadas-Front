// src/components/FlujoPublicacionPanel.jsx
import { useState } from 'react';
import { PrinterIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import VistaPreviaCertificados from './VistaPreviaCertificados'; // 👈 único componente
import ConfirmationModal from './ConfirmationModal';
import SuccessDialog from './SuccessDialog';

export default function FlujoPublicacionPanel({ areas = [] }) {
  const [vistaPrevia, setVistaPrevia] = useState(null); // { area, isGlobal, competidores }
  const [showConfirmPublicar, setShowConfirmPublicar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filtrar áreas confirmadas
  const areasConfirmadas = areas.filter(area => area.estado === 'Confirmado');
  const hayAreasConfirmadas = areasConfirmadas.length > 0;

  const getColorChip = (estado) => {
    switch (estado) {
      case 'En evaluación': return 'bg-blue-100 text-blue-800';
      case 'Concluido': return 'bg-green-100 text-green-800';
      case 'Confirmado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getButtonClass = (estadoActual, estadoBoton) => {
    const isActive = estadoActual === estadoBoton;
    if (!isActive) return 'bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed';
    return estadoBoton === 'Confirmado'
      ? 'bg-purple-500 text-white border-purple-600'
      : estadoBoton === 'Concluido'
      ? 'bg-green-500 text-white border-green-600'
      : 'bg-blue-500 text-white border-blue-600';
  };

  const handlePublicar = () => {
    setShowConfirmPublicar(true);
  };

  const confirmarPublicacion = () => {
    setShowConfirmPublicar(false);
    setSuccessMessage("Resultados publicados correctamente.");
    setShowSuccess(true);
  };

  const handleImprimirGlobal = () => {
    // Simula competidores de todas las áreas confirmadas
    const competidores = [];
    areasConfirmadas.forEach(area => {
      competidores.push({
        nombre: "Juan Pérez López",
        area: area.nombre,
      });
      competidores.push({
        nombre: "María González",
        area: area.nombre,
      });
    });

    setVistaPrevia({
      areaNombre: 'Todos los certificados',
      isGlobal: true,
      competidores: competidores,
    });
  };

  const handleImprimirArea = (area) => {
    setVistaPrevia({
      areaNombre: area.nombre,
      isGlobal: false,
      competidores: [], // o puedes pasar competidores reales si los tienes
    });
  };

  return (
    <div className="space-y-4">
      {/* Botones globales */}
      <div className="flex gap-3">
        <button
          className={`btn btn-outline flex items-center gap-2 ${!hayAreasConfirmadas ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleImprimirGlobal}
          disabled={!hayAreasConfirmadas}
        >
          <PrinterIcon className="w-4 h-4" /> Imprimir certificados
        </button>
        <button
          className={`btn btn-primary flex items-center gap-2 ${!hayAreasConfirmadas ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePublicar}
          disabled={!hayAreasConfirmadas}
        >
          <ArrowUpTrayIcon className="w-4 h-4" /> Publicar resultados
        </button>
      </div>

      {/* Tarjetas por área */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <div key={area.id} className="card p-4">
            <h3 className="font-medium text-slate-800">{area.nombre}</h3>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getColorChip(area.estado)}`}>
                {area.estado}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(area.estado, 'En evaluación')}`}
                disabled={area.estado !== 'En evaluación'}
              >
                En evaluación
              </button>
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(area.estado, 'Concluido')}`}
                disabled={area.estado !== 'Concluido'}
              >
                Concluido
              </button>
              <button
                className={`w-full py-2 text-sm rounded-md border ${getButtonClass(area.estado, 'Confirmado')}`}
                disabled={area.estado !== 'Confirmado'}
              >
                Confirmado
              </button>
            </div>

            {/* Botón de imprimir por área */}
            {area.estado === 'Confirmado' && (
              <button
                className="mt-3 w-full btn btn-outline btn-sm"
                onClick={() => handleImprimirArea(area)}
              >
                🖨️ Imprimir certificados
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de vista previa (único componente) */}
      <VistaPreviaCertificados
        open={!!vistaPrevia}
        onClose={() => setVistaPrevia(null)}
        areaNombre={vistaPrevia?.areaNombre || "Área"}
        isGlobal={vistaPrevia?.isGlobal || false}
        competidores={vistaPrevia?.competidores || []}
      />

      {/* Modal de confirmación para publicar */}
      <ConfirmationModal
        open={showConfirmPublicar}
        onClose={() => setShowConfirmPublicar(false)}
        onConfirm={confirmarPublicacion}
        title="Confirmar publicación"
        message="¿Está seguro que desea publicar los resultados? Esta acción no se puede deshacer."
        confirmText="Publicar"
        cancelText="Cancelar"
      />

      {/* Modal de éxito */}
      <SuccessDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Operación Exitosa"
        subtitle="Publicación completada"
        message={successMessage}
        confirmLabel="Aceptar"
      />
    </div>
  );
}