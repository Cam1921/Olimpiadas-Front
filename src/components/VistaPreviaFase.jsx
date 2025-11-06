// src/components/VistaPreviaFase.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Ban, Check, X } from "lucide-react";

export default function VistaPreviaFase({ open, onClose, area = {} }) {
  if (!open) return null;

  const fechaRegistro = "2025-10-11";
  const ultimaActualizacion = "2025-10-26";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="card w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold text-slate-800">
                  Detalles de la fase: {area.nombre}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-slate-700">Área / Nivel</h3>
                  <p className="text-slate-600">
                    {area.nombre} — {area.nivel}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">Fase actual</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                    {area.faseActual}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">Responsable</h3>
                  <p className="text-slate-600">{area.responsable}</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">Estado</h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                      area.estado === "En evaluación"
                        ? "bg-blue-100 text-blue-800"
                        : area.estado === "Concluido"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {area.estado}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">
                    Fecha de registro
                  </h3>
                  <p className="text-slate-600">{fechaRegistro}</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">
                    Última actualización
                  </h3>
                  <p className="text-slate-600">{ultimaActualizacion}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2">Progreso</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${area.progreso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {area.progreso}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-2">
                  Clasificación
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{area.clasificados} clasificados</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <X className="w-4 h-4 text-red-500" />
                    <span>{area.noClasificados} no clasificados</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ban className="w-4 h-4 text-red-500" />
                    <span>{area.descalificados} descalificados</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
