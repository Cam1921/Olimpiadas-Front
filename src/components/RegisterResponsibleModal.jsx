import { useEffect, useMemo, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { AREAS } from "../services/areas";

export default function RegisterResponsibleModal({
  open,
  onClose,
  onCreate,
  takenAreas = [], // ⬅️ NUEVO: áreas ya ocupadas
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    area: "",
  });

  const [showAreas, setShowAreas] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Helpers
  const isEmpty = (v) => !v || v.trim() === "";

  // === Validaciones de correo (las que ya tenías) ===
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

  // === Área: requerido + única ===
  const areaEmpty = isEmpty(form.area);
  const areaTaken = form.area ? takenAreas.includes(form.area) : false;
  const areaOk = !areaEmpty && !areaTaken;

  // canSubmit
  const canSubmit =
    nomOk &&
    apeOk &&
    !isEmpty(form.correo) &&
    emailLenOk &&
    emailSyntaxOk &&
    telOk &&
    areaOk;

  // Mostrar errores si ya intentaste enviar o si el campo fue tocado
  const shouldShow = (key) => submitted || touched[key];

  // Mensajes
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
    if (areaTaken) return "Ya existe un responsable asignado a esta área";
    return null;
  };

  // Clase de borde rojo si hay error
  const errClass = (hasError) =>
    hasError ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-300" : "";

  useEffect(() => {
    if (!open) {
      setForm({ nombre: "", apellidos: "", correo: "", telefono: "", area: "" });
      setTouched({});
      setSubmitted(false);
      setShowAreas(false);
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return; // 🔒 bloquea envío si área ya está tomada (o cualquier otro error)
    const payload = {
      ...form,
      telefono: `+591 ${form.telefono}`,
      fecha: new Date().toISOString().slice(0, 10),
    };
    onCreate?.(payload);
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
          Registrar Nuevo <br /> Responsable Académico
        </h2>
        <p className="text-slate-500 mt-2">
          Completa los datos del responsable académico
        </p>

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
                  {AREAS.map((a) => (
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
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 mt-7">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-cta" onClick={onSubmit}>Registrar</button>
        </div>
      </div>
    </div>
  );
}
