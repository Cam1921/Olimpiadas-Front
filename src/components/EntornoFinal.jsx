// src/components/EntornoFinal.jsx
import React, { useState } from 'react';
import SuccessDialog from './SuccessDialog';
import ConfirmationModal from './ConfirmationModal';

export default function EntornoFinal() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Datos simulados
  const areas = [
    {
      id: 1,
      name: "Matemáticas",
      level: "Primer Nivel",
      status: "Confirmado",
      enabled: false,
      classifiedCount: 12,
      enabledDate: "2025-01-21"
    },
    {
      id: 2,
      name: "Física",
      level: "4to Secundaria",
      status: "Confirmado",
      enabled: false,
      classifiedCount: 8,
      enabledDate: "2025-01-20"
    }
  ];

  const totalEnabled = areas.filter(a => a.enabled).length;
  const totalClassified = areas.reduce((sum, a) => sum + a.classifiedCount, 0);
  const pendingAreas = areas.filter(a => !a.enabled && a.status === "Confirmado").length;

  const handlePrepare = (area) => {
    setSelectedArea(area);
    setShowConfirmModal(true);
  };

  const handleConfirmFinalSetup = () => {
    if (selectedArea) {
      const msg = `El área ${selectedArea.name} ha sido habilitada para la fase final con ${selectedArea.classifiedCount} competidores.`;
      setSuccessMessage(msg);
      setShowSuccessModal(true);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Entorno Final</h1>
        <p className="text-slate-600 mt-1">
          Gestión de competidores habilitados para la fase final de evaluación.
        </p>
      </div>

     {/* Tarjetas de resumen (estilo exacto a la primera foto) */}
<div className="flex flex-col sm:flex-row gap-4 mb-8">
  {/* Habilitados para final */}
  <div className="card flex-1 p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-slate-500">Habilitados para final</p>
      <p className="text-2xl font-bold text-slate-800">{totalClassified}</p>
    </div>
    <div className="text-blue-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0012 20.907a48.62 48.62 0 008.214-4.095M6 6h12v4M6 10h12v4m-6-4a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    </div>
  </div>

  {/* Áreas habilitadas */}
  <div className="card flex-1 p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-slate-500">Áreas habilitadas</p>
      <p className="text-2xl font-bold text-green-600">{totalEnabled}</p>
    </div>
    <div className="text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>

  {/* Pendientes */}
  <div className="card flex-1 p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-slate-500">Pendientes</p>
      <p className="text-2xl font-bold text-amber-500">{pendingAreas}</p>
    </div>
    <div className="text-amber-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
  </div>
</div>

      {/* Preparación por Área */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Preparación de Entorno Final por Área</h2>
        <p className="text-slate-600 mb-6">
          Habilita la fase final para áreas que han completado la clasificatoria
        </p>

        <div className="space-y-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 gap-3"
            >
              <div className="flex items-center flex-wrap gap-3">
                <span className="font-medium text-primary">{area.name}</span>
                <span className="text-slate-600">{area.level}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    area.status === "Confirmado"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {area.status}
                </span>
                {area.enabled && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-600 text-white">
                    Final habilitada
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-500 text-right sm:text-left">
                  {area.classifiedCount} clasificados • {area.enabledDate}
                </span>
                {!area.enabled && (
                  <button
                    onClick={() => handlePrepare(area)}
                    className="btn btn-cta text-sm whitespace-nowrap"
                  >
                    Preparar Fase Final
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón a Lista Oficial */}
      <div className="text-center">
        <button
          onClick={() => window.location.href = "/lista-oficial"}
          className="btn btn-cta px-6 py-3 font-medium"
        >
          Ver Lista Oficial de Habilitados
        </button>
      </div>

      {/* Modal de Confirmación */}
      {selectedArea && (
        <ConfirmationModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmFinalSetup}
          title="¿Desea habilitar la fase final?"
          message={`Se transferirán automáticamente ${selectedArea.classifiedCount} competidores clasificados de la área ${selectedArea.name} a la fase final.`}
          confirmText="Habilitar Fase Final"
          cancelText="Cancelar"
        />
      )}

      {/* Modal de Éxito */}
      <SuccessDialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Entorno Final Habilitado"
        subtitle="Fase final preparada con éxito"
        message={successMessage}
        confirmLabel="Aceptar"
      />
    </div>
  );
}