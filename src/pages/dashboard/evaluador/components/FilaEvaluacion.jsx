// src/pages/dashboard/evaluador/components/FilaEvaluacion.jsx
import { useEffect, useMemo, useState } from "react";
import ToastInline from "@/components/ToastInline.jsx";

/* Utils nota */
function toNumber100(v) {
  if (v === "" || v === null || v === undefined) return NaN;
  const s = String(v).replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
function normalizar1Decimal(n) {
  return Math.round(n * 10) / 10;
}

/* Íconos */
const Lapis = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M16.862 3.487a1.75 1.75 0 0 1 2.476 2.475L7.81 17.49a4 4 0 0 1-1.697 1.01l-3.042.9.9-3.042a4 4 0 0 1 1.01-1.697L16.862 3.487Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 5l4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const ErrorBadge = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-red-400 text-red-500 bg-white">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1.2" fill="currentColor"/>
    </svg>
  </span>
);

/* Draft validator (mientras escribe)
   Acepta: "", 0..99, 0..99 con 1 decimal (coma o punto), 100, 100,0 / 100.0 */
const notaDraftRegex = /^(?:|0|[1-9]\d?|(?:\d{1,2}[.,]\d?)|100|100[.,]0?)$/;
function allowNotaDraft(s) { return notaDraftRegex.test(s); }

export default function FilaEvaluacion({ item, onSaved }) {
  const [nota, setNota] = useState(item.nota ?? "");
  const [descripcion, setDescripcion] = useState(item.descripcion ?? "");
  const [cond, setCond] = useState(
    item.conducta ?? { integridad: false, puntualidad: false, respeto: false }
  );

  const [saving, setSaving] = useState(false);
  const [toastErr, setToastErr] = useState("");
  const [toastOk, setToastOk] = useState(false);

  // para mostrar toasts de campo “como antes”
  const [notaTouched, setNotaTouched] = useState(false);
  const [descTouched, setDescTouched] = useState(false);

  // NUEVO: mensaje cuando el usuario intenta teclear algo no permitido
  const [notaDraftMsg, setNotaDraftMsg] = useState("");
  const [notaDraftKey, setNotaDraftKey] = useState(0);

  /* Validaciones */
  const nnum = useMemo(() => toNumber100(nota), [nota]);
  const esVacio = String(nota).trim() === "";
  const numValido = !Number.isNaN(nnum);
  const rangoValido = numValido && nnum >= 0 && nnum <= 100;
  const notaValida = !esVacio && rangoValido;

  const descValida = descripcion.trim().length >= 5 && descripcion.trim().length <= 60;

  const cambios = useMemo(() => {
    return (
      String(nota) !== String(item.nota ?? "") ||
      descripcion !== (item.descripcion ?? "") ||
      cond.integridad !== !!item.conducta?.integridad ||
      cond.puntualidad !== !!item.conducta?.puntualidad ||
      cond.respeto !== !!item.conducta?.respeto
    );
  }, [nota, descripcion, cond, item]);

  useEffect(() => setToastOk(false), [nota, descripcion, cond]);

  /* Nota (restricción + toasts) */
  const onNotaChange = (e) => {
    let next = e.target.value.replace(/[^\d.,]/g, "");
    if (allowNotaDraft(next)) {
      setNota(next);
    } else {
      // ❗ Intento inválido: no cambiamos el valor y mostramos el mensaje
      if (next !== "") {
        setNotaTouched(true);
        setNotaDraftMsg("La nota debe estar entre 0 y 100 (se admite 1 decimal)");
        setNotaDraftKey((k) => k + 1); // fuerza remount del toast (5s)
      }
    }
    if (!notaTouched) setNotaTouched(true);
  };

  const onNotaBlur = () => {
    setNotaTouched(true);
    // "10," -> "10"
    if (/^[0-9]{1,2}[.,]$/.test(nota)) {
      setNota(nota.slice(0, -1));
      return;
    }
    // "100,0" -> "100"
    if (/^100[.,]0$/.test(nota)) setNota("100");
  };

  /* Guardado */
  const onGuardar = async () => {
    if (esVacio || !numValido) { setNotaTouched(true); setToastErr("Debe ingresar una nota válida"); return; }
    if (!rangoValido) { setNotaTouched(true); setToastErr("La nota debe estar entre 0 y 100 (se admite 1 decimal)"); return; }
    if (!descValida) { setDescTouched(true); setToastErr("La observación debe ser mayor a 5 y menor a 60 caracteres"); return; }

    setSaving(true);
    setToastErr("");
    try {
      const notaNorm = normalizar1Decimal(nnum);
      const payload = {
        id: item.id,
        nota: notaNorm,
        conducta: cond,
        descripcion: descripcion.trim(),
      };
      await new Promise((r) => setTimeout(r, 350)); // MOCK
      onSaved?.(payload);
      setNota(String(notaNorm));
      setToastOk(true);
    } catch {
      setToastErr("No se pudo guardar. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const showErrorNota = (notaTouched && (esVacio || !numValido || !rangoValido));
  const showErrorDesc = (descTouched && descripcion !== "" && !descValida);

  return (
    <tr className="bg-white">
      {/* Informativos */}
      <td className="px-4 py-3 align-top">
        <div className="text-gray-800 font-medium leading-tight">{item.nombre}</div>
        <div className="text-gray-400 text-xs mt-1">{item.codigo}</div>
      </td>
      <td className="px-4 py-3 align-top text-gray-700">{item.area}</td>
      <td className="px-4 py-3 align-top text-gray-700">{item.nivel}</td>

      {/* Nota */}
      <td className="px-4 py-3 align-top w-[180px]">
        <div className="relative">
          <input
            className={`bg-white rounded-2xl border px-4 py-3 pr-12 w-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:outline-none
            ${showErrorNota ? "border-red-400" : "border-gray-300"}`}
            value={nota}
            onChange={onNotaChange}
            onBlur={onNotaBlur}
            placeholder="0–100"
            inputMode="decimal"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80">
            {showErrorNota ? <ErrorBadge /> : <Lapis />}
          </span>
        </div>

        {/* Error por intento inválido de digitación */}
        {notaDraftMsg && (
          <ToastInline
            key={`nota-draft-${item.id}-${notaDraftKey}`}
            show
            text={notaDraftMsg}
            onHide={() => setNotaDraftMsg("")}
          />
        )}

        {/* Error por valor actual inválido */}
        {showErrorNota && (
          <ToastInline
            key={`nota-${item.id}-${nota}`}
            show
            text={
              esVacio || !numValido
                ? "Debe ingresar una nota válida"
                : "La nota debe estar entre 0 y 100 (se admite 1 decimal)"
            }
            onHide={() => { /* autohide 5s */ }}
          />
        )}
      </td>

      {/* Conducta */}
      <td className="px-4 py-3 align-top w-[210px]">
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cond.respeto}
              onChange={(e) => setCond((c) => ({ ...c, respeto: e.target.checked }))}
            />
            <span className="text-gray-700">Respeto</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cond.integridad}
              onChange={(e) => setCond((c) => ({ ...c, integridad: e.target.checked }))}
            />
            <span className="text-gray-700">Integridad</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cond.puntualidad}
              onChange={(e) => setCond((c) => ({ ...c, puntualidad: e.target.checked }))}
            />
            <span className="text-gray-700">Puntualidad</span>
          </label>
        </div>
      </td>

      {/* Descripción */}
      <td className="px-4 py-3 align-top w-[320px]">
        <div className="relative">
          <textarea
            className={`bg-white rounded-2xl border px-4 py-3 pr-12 w-full min-h-[76px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:outline-none
            ${showErrorDesc ? "border-red-400" : "border-gray-300"}`}
            value={descripcion}
            onChange={(e) => { setDescripcion(e.target.value); if (!descTouched) setDescTouched(true); }}
            onBlur={() => setDescTouched(true)}
            placeholder="Observación (5–60 caracteres)"
          />
          <span className="absolute right-3 top-3 opacity-80">
            {showErrorDesc ? <ErrorBadge /> : <Lapis />}
          </span>
        </div>
        {showErrorDesc && (
          <ToastInline
            key={`desc-${item.id}-${descripcion.length}`}
            show
            text="La observación debe ser mayor a 5 y menor a 60 caracteres"
            onHide={() => { /* autohide 5s */ }}
          />
        )}
      </td>

      {/* Acción */}
      <td className="px-4 py-3 align-top w-[150px]">
        <button
          onClick={onGuardar}
          disabled={!(cambios && notaValida && descValida) || saving}
          className={`rounded-2xl px-4 py-2.5 w-full text-white transition
            ${cambios && notaValida && descValida && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400/50 cursor-not-allowed"}`}
        >
          {saving ? "Guardando…" : "Registrar"}
        </button>

        {toastErr && (
          <ToastInline
            key={`err-${item.id}-${toastErr}`}
            show
            text={toastErr}
            onHide={() => setToastErr("")}
          />
        )}
        {toastOk && (
          <ToastInline
            key={`ok-${item.id}-${Date.now()}`}
            show
            type="success"
            text="Calificación guardada"
            onHide={() => setToastOk(false)}
          />
        )}
      </td>
    </tr>
  );
}
