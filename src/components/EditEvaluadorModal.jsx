// src/components/EditEvaluadorModal.jsx
import { useEffect, useMemo, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";
import { isAreaCompleta } from "../utils/areaUtils";

export default function EditEvaluadorModal({
  open,
  onClose,
  onUpdate,
  initial = null,      // { nombre, apellidos, correo, telefono, area, fecha, nivel }
  takenAreas = [],     // TODAS las áreas asignadas en la tabla
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    area: "",
    nivel: "", // ✅ Campo nuevo
  });
  const [showAreas, setShowAreas] = useState(false);
  const [showNiveles, setShowNiveles] = useState(false);
  const [availableNiveles, setAvailableNiveles] = useState(["Primaria", "Secundaria"]); // Inicialmente ambos
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const isEmpty = (v) => !v || v.trim() === "";

  // Carga inicial
  useEffect(() => {
    if (open && initial) {
      setForm({
        nombre: initial.nombre || "",
        apellidos: initial.apellidos || "",
        correo: initial.correo || "",
        telefono: (initial.telefono || "").replace(/\+591\s?/, ""),
        area: initial.area || "",
        nivel: initial.nivel || "", // ✅ Cargar nivel
      });
      setTouched({});
      setSubmitted(false);
      setShowAreas(false);
      setShowNiveles(false);
    }
  }, [open, initial]);

  // Actualiza los niveles disponibles cuando cambia el área
  useEffect(() => {
    if (form.area) {
      const takenForArea = takenAreas.filter(a => a.area === form.area);
      const available = ["Primaria", "Secundaria"].filter(n => 
        !takenForArea.some(t => t.nivel === n)
      );
      setAvailableNiveles(available);
    } else {
      setAvailableNiveles(["Primaria", "Secundaria"]);
    }
  }, [form.area, takenAreas]);

  // === Validaciones (mismas reglas que registro) ===
  const hasAt = useMemo(() => form.correo.includes("@"), [form.correo]);
  const [userPart, domainPart] = useMemo(
    () => (hasAt ? form.correo.split("@") : ["", ""]),
    [form.correo, hasAt]
  );
  const emailLenOk = form.correo.length <= 70;
  const emailSyntaxOk =
    hasAt && userPart.trim() !== "" && domainPart.trim() !== "";
  const telOk = useMemo(() => /^(6|7)\d{7}$/.test(form.telefono), [form.telefono]);
  const nomOk = form.nombre.trim().length >= 2;
  const apeOk = form.apellidos.trim().length >= 2;
  const nivelOk = ["Primaria", "Secundaria"].includes(form.nivel);

  // === Área: requerido + única (permitiendo su área original) ===
  const areaEmpty = isEmpty(form.area);
  const areaTakenByOther =
    form.area &&
    form.area !== (initial?.area || "") &&      // ⬅️ permite su misma área
    takenAreas.some(a => a.area === form.area && a.nivel === form.nivel); // ✅ Combinación area+nivel
  const areaOk = !areaEmpty && !areaTakenByOther;

  const canSubmit =
    nomOk &&
    apeOk &&
    !isEmpty(form.correo) &&
    emailLenOk &&
    emailSyntaxOk &&
    telOk &&
    areaOk &&
    nivelOk;

  const shouldShow = (key) => submitted || touched[key];

  const emailErrMsg = () => {
    if (!shouldShow("correo")) return null;
    if (isEmpty(form.correo)) return "El correo es obligatorio";
    if (!hasAt) return "Incluye un signo de @ en la dirección de correo electrónico";
    if (userPart.trim() === "") return "Ingrese nombre de usuario antes del signo @";
    if (domainPart.trim() === "") return "Ingrese un dominio después del signo @";
    if (!emailLenOk) return "Cantidad máxima 70 caracteres";
    return null;
  };

  const nameErrMsg = () => {
    if (!shouldShow("nombre")) return null;
    if (isEmpty(form.nombre)) return "Completa este campo";
    if (!nomOk) return "Mínimo 2 caracteres";
    return null;
  };

  const lastErrMsg = () => {
    if (!shouldShow("apellidos")) return null;
    if (isEmpty(form.apellidos)) return "Completa este campo";
    if (!apeOk) return "Mínimo 2 caracteres";
    return null;
  };

  const phoneErrMsg = () => {
    if (!shouldShow("telefono")) return null;
    if (isEmpty(form.telefono)) return "Completa este campo";
    if (!telOk) return "Formato: 8 dígitos, inicia con 6 o 7";
    return null;
  };

  const areaErrMsg = () => {
    if (!shouldShow("area")) return null;
    if (areaEmpty) return "Completa este campo";
    if (areaTakenByOther) return "Ya existe un evaluador asignado a esta área y nivel";
    return null;
  };

  const nivelErrMsg = () => {
    if (!shouldShow("nivel")) return null;
    if (isEmpty(form.nivel)) return "Completa este campo";
    if (!nivelOk) return "El nivel debe ser 'Primaria' o 'Secundaria'";
    return null;
  };

  const errClass = (hasError) =>
    hasError ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300" : "";

  if (!open) return null;

  const onSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;
    const payload = {
      ...form,
      telefono: `+591 ${form.telefono}`,
      fecha: initial?.fecha || new Date().toISOString().slice(0, 10),
    };
    onUpdate?.(payload); // <- el padre reemplaza la fila
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative card w-[720px] p-8">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
          Editar Evaluador
        </h2>
        <p className="text-slate-500 mt-2">Actualiza los datos del evaluador</p>
        <div className="grid grid-cols-2 gap-5 mt-6">
          {/* Nombre */}
          <div>
            <label className="label">Nombre *</label>
            <input
              className={`input ${errClass(!!nameErrMsg())}`}
              value={form.nombre}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {nameErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {nameErrMsg()}
              </p>
            )}
          </div>
          {/* Apellidos */}
          <div>
            <label className="label">Apellidos *</label>
            <input
              className={`input ${errClass(!!lastErrMsg())}`}
              value={form.apellidos}
              onBlur={() => setTouched((t) => ({ ...t, apellidos: true }))}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            />
            {lastErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {lastErrMsg()}
              </p>
            )}
          </div>
          {/* Correo */}
          <div className="col-span-2">
            <label className="label">Correo electrónico *</label>
            <div className="relative">
              <input
                className={`input pr-10 ${errClass(!!emailErrMsg())}`}
                value={form.correo}
                maxLength={70}
                onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                // readOnly // si quieres bloquear edición del correo, descomenta
              />
              <LockClosedIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {emailErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {emailErrMsg()}
              </p>
            )}
          </div>
          {/* Teléfono */}
          <div>
            <label className="label">Teléfono *</label>
            <input
              className={`input ${errClass(!!phoneErrMsg())}`}
              placeholder="+591 7 XXXXXXX (8 dígitos)"
              value={form.telefono}
              onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value.replace(/\D/g, "") })
              }
            />
            {phoneErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {phoneErrMsg()}
              </p>
            )}
          </div>
          {/* Área */}
          <div className="relative">
            <label className="label">Área *</label>
            <button
              type="button"
              onClick={() => setShowAreas((v) => !v)}
              onBlur={() => setTouched((t) => ({ ...t, area: true }))}
              className={`input flex items-center justify-between ${errClass(!!areaErrMsg())}`}
            >
              <span className={form.area ? "text-slate-900" : "text-slate-400"}>
                {form.area || "Selecciona un área"}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showAreas && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {AREAS.filter(area => {
  // Si el usuario está editando, permitir su área actual aunque esté completa
  if (initial?.area === area) return true;
  return !isAreaCompleta(area, takenAreas);
}).map(a => (
  <li key={a}>
    <button
      className="w-full text-left px-4 py-3 hover:bg-slate-50"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        setForm({ ...form, area: a });
        setShowAreas(false);
      }}
    >
      {a}
    </button>
  </li>
))}
                </ul>
              </div>
            )}
            {areaErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {areaErrMsg()}
              </p>
            )}
          </div>
          {/* Nivel */}
          <div className="relative">
            <label className="label">Nivel *</label>
            <button
              type="button"
              onClick={() => setShowNiveles((v) => !v)}
              onBlur={() => setTouched((t) => ({ ...t, nivel: true }))}
              className={`input flex items-center justify-between ${errClass(!!nivelErrMsg())}`}
              disabled={!form.area} // ✅ Deshabilita si no hay área seleccionada
            >
              <span className={form.nivel ? "text-slate-900" : "text-slate-400"}>
                {form.nivel || (form.area ? "Selecciona un nivel" : "Primero selecciona un área")}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </button>
            {showNiveles && (
              <div className="absolute z-10 mt-1 w-full card p-0 overflow-hidden">
                <ul className="max-h-56 overflow-auto">
                  {availableNiveles.length > 0 ? (
                    availableNiveles.map((n) => (
                      <li key={n}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setForm({ ...form, nivel: n });
                            setShowNiveles(false);
                          }}
                        >
                          {n}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p className="px-4 py-3 text-slate-400">Todos los niveles para esta área ya están asignados.</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {nivelErrMsg() && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {nivelErrMsg()}
              </p>
            )}
          </div>
        </div>
        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-cta" onClick={onSubmit}>Actualizar</button>
        </div>
      </div>
    </div>
  );
}