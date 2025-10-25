// src/components/ControlFasesTable.jsx
import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';
import SuccessDialog from './SuccessDialog';
import VistaPreviaFase from './VistaPreviaFase'; // 👈 nuevo

async function verificarCalificacionesCompletas(areaId) {
  console.log("Verificando calificaciones para el área:", areaId);
  return areaId !== "2";
}

export default function ControlFasesTable({ areas = [], rolUsuario, onEstadoActualizado }) {
  const [loadingArea, setLoadingArea] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [mensajeModal, setMensajeModal] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [vistaPreviaFase, setVistaPreviaFase] = useState(null); // 👈 nuevo estado

  const esAdmin = rolUsuario === 'Administrador';

  const getColorChip = (estado) => {
    switch (estado) {
      case 'En evaluación': return 'bg-blue-100 text-blue-800';
      case 'Concluido': return 'bg-green-100 text-green-800';
      case 'Confirmado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = async (areaId, accion, areaNombre) => {
    setLoadingArea(areaId);
    setError(null);

    try {
      let nuevoEstado;
      let mensajeExito;

      if (accion === 'concluir') {
        const completo = await verificarCalificacionesCompletas(areaId);
        if (!completo) {
          throw new Error('No es posible concluir, faltan evaluaciones por registrar');
        }
        nuevoEstado = 'Concluido';
        mensajeExito = `Fase de ${areaNombre} concluida correctamente.`;
      }

      if (accion === 'confirmar') {
        nuevoEstado = 'Confirmado';
        mensajeExito = `Resultados de ${areaNombre} confirmados correctamente.`;
      }

      if (accion === 'publicar') {
        mensajeExito = `Resultados de ${areaNombre} publicados correctamente.`;
      }

      if (accion === 'cerrar') {
        mensajeExito = `Fase de ${areaNombre} cerrada correctamente.`;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      setSuccessMessage(mensajeExito);
      setShowSuccess(true);

      if (onEstadoActualizado && nuevoEstado) {
        onEstadoActualizado({
          id: areaId,
          estado: nuevoEstado,
        });
      }

    } catch (err) {
      setError(err.message || 'No se pudo completar la acción');
    } finally {
      setLoadingArea(null);
      setAccionPendiente(null);
      setShowModal(false);
    }
  };

  const handleConcluir = (area) => {
    setError(null);
    const completo = verificarCalificacionesCompletas(area.id);
    if (!completo) {
      setError('No es posible concluir, faltan evaluaciones por registrar');
      return;
    }
    setMensajeModal(`¿Está seguro de concluir la fase de ${area.nombre}? Esta acción no se puede deshacer.`);
    setAccionPendiente({ tipo: 'concluir', areaId: area.id, areaNombre: area.nombre });
    setShowModal(true);
  };

  const handleConfirmar = (area) => {
    setError(null);
    setMensajeModal(`¿Confirmar resultados de ${area.nombre}? Esta acción habilitará la emisión de certificados y publicación.`);
    setAccionPendiente({ tipo: 'confirmar', areaId: area.id, areaNombre: area.nombre });
    setShowModal(true);
  };

  const handlePublicar = (area) => {
    setError(null);
    setMensajeModal(`¿Publicar resultados de ${area.nombre}? Esta acción no se puede deshacer.`);
    setAccionPendiente({ tipo: 'publicar', areaId: area.id, areaNombre: area.nombre });
    setShowModal(true);
  };

  const handleCerrar = (area) => {
    setError(null);
    setMensajeModal(`¿Cerrar la fase de ${area.nombre}? Esta acción no se puede deshacer.`);
    setAccionPendiente({ tipo: 'cerrar', areaId: area.id, areaNombre: area.nombre });
    setShowModal(true);
  };

  const ejecutarAccion = async () => {
    if (!accionPendiente) return;
    const { tipo, areaId, areaNombre } = accionPendiente;
    await handleAction(areaId, tipo, areaNombre);
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Área / Nivel</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fase actual</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progreso</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Clasificación</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Responsable</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {areas.map(area => (
            <tr key={area.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium">{area.nombre}</div>
                <div className="text-sm text-slate-500">{area.nivel}</div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded">
                  {area.faseActual}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${area.progreso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{area.progreso}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">
                <div>✅ {area.clasificados}</div>
                <div>❌ {area.noClasificados}</div>
                <div>🚫 {area.descalificados}</div>
              </td>
              <td className="px-4 py-3">{area.responsable}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getColorChip(area.estado)}`}>
                  {area.estado}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {/* 👁️ Botón de vista previa */}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setVistaPreviaFase(area)}
                    title="Ver detalles de la fase"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>

                  {esAdmin && area.estado === 'En evaluación' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleConcluir(area)}
                      disabled={loadingArea === area.id}
                    >
                      {loadingArea === area.id ? '...' : 'Concluir'}
                    </button>
                  )}

                  {esAdmin && area.estado === 'Concluido' && (
                    <button
                      className="btn btn-purple btn-sm"
                      onClick={() => handleConfirmar(area)}
                      disabled={loadingArea === area.id}
                    >
                      {loadingArea === area.id ? '...' : 'Confirmar'}
                    </button>
                  )}

                  {esAdmin && area.estado === 'Confirmado' && (
                    <>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          alert("Vista previa de certificados en desarrollo.");
                        }}
                      >
                        Certificados
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handlePublicar(area)}
                        disabled={loadingArea === area.id}
                      >
                        {loadingArea === area.id ? '...' : 'Publicar'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCerrar(area)}
                        disabled={loadingArea === area.id}
                      >
                        {loadingArea === area.id ? '...' : 'Cerrar'}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales */}
      <ConfirmationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={ejecutarAccion}
        title="Confirmar acción"
        message={mensajeModal}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
      />

      <SuccessDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Operación Exitosa"
        subtitle="La operación se completó correctamente"
        message={successMessage}
        confirmLabel="Aceptar"
      />

      <VistaPreviaFase
        open={!!vistaPreviaFase}
        onClose={() => setVistaPreviaFase(null)}
        area={vistaPreviaFase || {}}
      />
    </div>
  );
}