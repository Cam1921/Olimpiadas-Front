// src/components/RegisterEvaluadorModal.jsx
import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";

export default function RegisterEvaluadorModal({
  open,
  onClose,
  form,
  setField,
  errors,
  submitting,
  onSubmit,
  takenAreas = [],
}) {
  const [searchTermArea, setSearchTermArea] = useState("");
  const [searchTermNivel, setSearchTermNivel] = useState("");
  const [showDropdownArea, setShowDropdownArea] = useState(false);
  const [showDropdownNivel, setShowDropdownNivel] = useState(false);
  const [areasConNiveles, setAreasConNiveles] = useState([]);
  const [availableNiveles, setAvailableNiveles] = useState([]);

  // Cargar áreas al montar
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreasConNiveles();
        setAreasConNiveles(data);
      } catch (err) {
        console.error("Error al cargar áreas con niveles:", err);
      }
    };
    fetchAreas();
  }, []);

  // Resetear al cerrar
  useEffect(() => {
    if (!open) {
      setShowDropdownArea(false);
      setShowDropdownNivel(false);
      setSearchTermArea("");
      setSearchTermNivel("");
    }
  }, [open]);

  // Actualizar niveles disponibles cuando cambia el área
  useEffect(() => {
    if (form.area) {
      const selectedArea = areasConNiveles.find((a) => a.nombre === form.area);
      if (selectedArea) {
        const takenForArea = takenAreas.filter((a) => a.area === form.area);
        const available = selectedArea.niveles.filter(
          (n) => !takenForArea.some((t) => t.nivel === n.nombre_nivel)
        );
        setAvailableNiveles(available);
      } else {
        setAvailableNiveles([]);
      }
    } else {
      setAvailableNiveles([]);
    }
  }, [form.area, takenAreas]);

  if (!open) return null;

  // Filtrar áreas por búsqueda y excluir tomadas
  const filteredAreas = areasConNiveles
    .filter((a) => {
      const matchesSearch = a.nombre.toLowerCase().includes(searchTermArea.toLowerCase());
      const notTaken = !takenAreas.some((ta) => ta.area === a.nombre);
      return matchesSearch && notTaken;
    })
    .filter((a, index, self) =>
      index === self.findIndex((b) => b.nombre === a.nombre)
    );

  // Filtrar niveles por búsqueda
  const filteredNiveles = availableNiveles.filter((n) =>
    n.nombre_nivel.toLowerCase().includes(searchTermNivel.toLowerCase())
  );

  const errClass = (field) =>
    errors[field]
      ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300"
      : "";
  const getErrorMsg = (field) => errors[field] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
          Registrar Nuevo Evaluador
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
          Completa los datos del evaluador
        </p>

        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm font-medium">
              ⚠️ Algunos datos ya están registrados o son inválidos. Revisa los
              campos marcados en rojo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Nombre */}
          <div>
            <label className="label text-sm">Nombre *</label>
            <input
              className={`input text-sm ${errClass("nombre")}`}
              value={form.nombre}
              onChange={(e) => {
                const cleaned = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  ""
                );
                setField("nombre", cleaned);
              }}
              placeholder="ej: María"
            />
            {getErrorMsg("nombre") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("nombre")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 letras.
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="label text-sm">Apellidos *</label>
            <input
              className={`input text-sm ${errClass("apellidos")}`}
              value={form.apellidos}
              onChange={(e) => {
                const cleaned = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  ""
                );
                setField("apellidos", cleaned);
              }}
              placeholder="ej: González Pérez"
            />
            {getErrorMsg("apellidos") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("apellidos")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe tener al menos 3 letras.
              </p>
            )}
          </div>

          {/* Correo */}
          <div className="md:col-span-2">
            <label className="label text-sm">Correo electrónico *</label>
            <input
              className={`input text-sm ${errClass("correo")}`}
              value={form.correo}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 70) {
                  setField("correo", value);
                }
              }}
              placeholder="ej: maria@gmail.com"
              maxLength={70}
            />
            {getErrorMsg("correo") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("correo")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Debe contener "@" y ".com". Máximo 70 caracteres.
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="label text-sm">Teléfono *</label>
            <input
              className={`input text-sm ${errClass("telefono")}`}
              value={form.telefono}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
                setField("telefono", cleaned);
              }}
              placeholder="ej: 71234567"
            />
            {getErrorMsg("telefono") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("telefono")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                8 dígitos, empieza con 6 o 7.
              </p>
            )}
          </div>

          {/* CI */}
          <div>
            <label className="label text-sm">CI *</label>
            <input
              className={`input text-sm ${errClass("ci")}`}
              value={form.ci}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                setField("ci", cleaned);
              }}
              placeholder="ej: 12345678"
            />
            {getErrorMsg("ci") ? (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("ci")}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Entre 6 y 10 dígitos.
              </p>
            )}
          </div>

          {/* Área - BUSCADOR */}
          <div className="md:col-span-2 relative">
            <label className="label text-sm">Área *</label>
            <input
              type="text"
              placeholder="Buscar área..."
              value={searchTermArea}
              onChange={(e) => {
                setSearchTermArea(e.target.value);
                setShowDropdownArea(true);
              }}
              onFocus={() => setShowDropdownArea(true)}
              onBlur={() => setTimeout(() => setShowDropdownArea(false), 200)}
              className={`input text-sm ${errClass("area")} w-full`}
            />

            {showDropdownArea && filteredAreas.length > 0 && (
              <div className="absolute z-10 mt-1 w-full card max-h-56 overflow-auto p-0">
                <ul>
                  {filteredAreas.map((a) => (
                    <li key={a.id}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setField("area", a.nombre);
                          setField("nivel", "");
                          setSearchTermArea(a.nombre);
                          setShowDropdownArea(false);
                        }}
                      >
                        {a.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showDropdownArea && filteredAreas.length === 0 && searchTermArea && (
              <div className="absolute z-10 mt-1 w-full card p-3 text-sm text-slate-500">
                No se encontraron áreas que coincidan con "{searchTermArea}"
              </div>
            )}

            {getErrorMsg("area") && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("area")}
              </p>
            )}
          </div>

          {/* Nivel - BUSCADOR */}
          <div className="md:col-span-2 relative">
            <label className="label text-sm">Nivel *</label>
            <input
              type="text"
              placeholder={
                form.area
                  ? "Buscar nivel..."
                  : "Primero selecciona un área"
              }
              value={searchTermNivel}
              onChange={(e) => {
                setSearchTermNivel(e.target.value);
                setShowDropdownNivel(true);
              }}
              onFocus={() => form.area && setShowDropdownNivel(true)}
              onBlur={() => setTimeout(() => setShowDropdownNivel(false), 200)}
              className={`input text-sm ${errClass("nivel")} w-full ${
                !form.area ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!form.area}
            />

            {showDropdownNivel && form.area && (
              <div className="absolute z-10 mt-1 w-full card max-h-56 overflow-auto p-0">
                {availableNiveles.length > 0 ? (
                  <ul>
                    {filteredNiveles.map((n) => (
                      <li key={n.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setField("nivel", n.nombre_nivel);
                            setSearchTermNivel(n.nombre_nivel);
                            setShowDropdownNivel(false);
                          }}
                        >
                          {n.nombre_nivel}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-sm text-slate-500">
                    Todos los niveles para esta área ya están asignados.
                  </div>
                )}
              </div>
            )}

            {getErrorMsg("nivel") && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getErrorMsg("nivel")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6">
          <button className="btn btn-ghost w-full sm:w-auto" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-cta w-full sm:w-auto"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}