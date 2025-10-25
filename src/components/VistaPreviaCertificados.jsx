// src/components/VistaPreviaCertificados.jsx
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SuccessDialog from './SuccessDialog'; // Tu modal de éxito

export default function VistaPreviaCertificados({ 
  open, 
  onClose, 
  areaNombre = "Área", 
  isGlobal = false, // 👈 nueva prop
  competidores = [], // 👈 lista de competidores (opcional)
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImprimir = () => {
    // Simula la impresión
    setShowSuccess(true);
    // window.print(); // descomenta si quieres probar impresión real
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Modal de vista previa */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
          <button
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Vista previa del certificado
          </h2>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Certificado de Participación</h3>
            
            {isGlobal ? (
              <p className="text-slate-600 mb-1">Área: <span className="font-medium">{areaNombre}</span></p>
            ) : (
              <p className="text-slate-600 mb-1">Área: <span className="font-medium">{areaNombre}</span></p>
            )}

            {competidores.length > 0 ? (
              <div className="mt-4 text-left">
                <p className="font-medium mb-2">Competidores:</p>
                <ul className="space-y-1">
                  {competidores.map((comp, i) => (
                    <li key={i} className="text-sm">• {comp.nombre} ({comp.area || areaNombre})</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate-600">Competidor: Juan Pérez López</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleImprimir}>
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <SuccessDialog
        open={showSuccess}
        onClose={handleCloseSuccess}
        title="Operación Exitosa"
        subtitle="Impresión completada"
        message={`Certificados de ${areaNombre} impresos correctamente.`}
        confirmLabel="Aceptar"
      />
    </>
  );
}