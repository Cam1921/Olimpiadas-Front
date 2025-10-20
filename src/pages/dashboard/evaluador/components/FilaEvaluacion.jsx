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

function calcularEstado(nota, conducta) {
  if (
    nota >= 51 &&
    conducta.integridad &&
    conducta.puntualidad &&
    conducta.respeto
  ) {
    return "Clasificado";
  } else if (
    nota < 51 &&
    conducta.integridad &&
    conducta.puntualidad &&
    conducta.respeto
  ) {
    return "No clasificado";
  } else {
    return "Descalificado";
  }
}

/* Íconos */
const Lapis = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M16.862 3.487a1.75 1.75 0 0 1 2.476 2.475L7.81 17.49a4 4 0 0 1-1.697 1.01l-3.042.9.9-3.042a4 4 0 0 1 1.01-1.697L16.862 3.487Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M15 5l4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const ErrorBadge = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-red-400 text-red-500 bg-white">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </svg>
  </span>
);

/* Draft validator */
const notaDraftRegex = /^(?:|0|[1-9]\d?|(?:\d{1,2}[.,]\d?)|100|100[.,]0?)$/;
function allowNotaDraft(s) {
  return notaDraftRegex.test(s);
}

export default function FilaEvaluacion({ item, onSaved, esClasificados }) {
  const [nota, setNota] = useState(item.nota ?? "");
  const [descripcion, setDescripcion] = useState(item.descripcion ?? "");
  const [cond, setCond] = useState(
    item.conducta ?? { integridad: false, puntualidad: false, respeto: false }
  );
  const [estadoClasificado, setEstadoClasificado] = useState(
    item.estado_clasificado ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [toastErr, setToastErr] = useState("");
  const [toastOk, setToastOk] = useState(false);
  const [notaTouched, setNotaTouched] = useState(false);
  const [descTouched, setDescTouched] = useState(false);
  const [notaDraftMsg, setNotaDraftMsg] = useState("");
  const [notaDraftKey, setNotaDraftKey] = useState(0);
  const [esClasificado, setEsClasificado] = useState(false);

  const nnum = useMemo(() => toNumber100(nota), [nota]);
  const esVacio = String(nota).trim() === "";
  const numValido = !Number.isNaN(nnum);
  const rangoValido = numValido && nnum >= 0 && nnum <= 100;
  const notaValida = !esVacio && rangoValido;
  const descValida =
    descripcion.trim().length >= 5 && descripcion.trim().length <= 60;

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
  useEffect(() => setEsClasificado(esClasificados), [esClasificados]);

  const onNotaChange = (e) => {
    let next = e.target.value.replace(/[^\d.,]/g, "");
    if (allowNotaDraft(next)) {
      setNota(next);
      if (!notaTouched) setNotaTouched(true);
    } else if (next !== nota) {
      setNotaDraftMsg("La nota debe estar entre 0 y 100 (se admite 1 decimal)");
      setNotaDraftKey((k) => k + 1);
      if (!notaTouched) setNotaTouched(true);
    }
  };

  const onNotaBlur = () => {
    if (/^[0-9]{1,2}[.,]$/.test(nota)) setNota(nota.slice(0, -1));
    if (/^100[.,]0$/.test(nota)) setNota("100");
  };

  const estadoColor = {
    Clasificado: "bg-green-100 text-green-700 border border-green-300",
    "No clasificado": "bg-rose-100 text-rose-700 border border-rose-300",
    Descalificado: "bg-gray-200 text-gray-700 border border-gray-300",
  };

  const onGuardar = async () => {
    if (esVacio || !numValido) {
      setNotaTouched(true);
      setToastErr("Debe ingresar una nota válida");
      return;
    }
    if (!rangoValido) {
      setNotaTouched(true);
      setToastErr("La nota debe estar entre 0 y 100 (se admite 1 decimal)");
      return;
    }
    if (!descValida) {
      setDescTouched(true);
      setToastErr("La observación debe ser mayor a 5 y menor a 60 caracteres");
      return;
    }

    setSaving(true);
    setToastErr("");
    try {
      const notaNorm = normalizar1Decimal(nnum);
      const estadoNuevo = calcularEstado(notaNorm, cond);
      const payload = {
        id_evaluacion: item.id_evaluacion,
        nota: notaNorm,
        conducta: cond,
        descripcion: descripcion.trim(),
      };
      item.estado_clasificado = estadoNuevo;
      await new Promise((r) => setTimeout(r, 350));
      onSaved?.(payload);
      setNota(String(notaNorm));
      setToastOk(true);
    } catch {
      setToastErr("No se pudo guardar. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const showErrorNota =
    notaTouched && nota !== "" && (!numValido || !rangoValido);
  const showErrorDesc = descTouched && descripcion !== "" && !descValida;

  // ✨ Responsive: tabla en desktop, card en mobile
  return (
    <tr className="bg-white sm:table-row block sm:table-row my-2 sm:my-0 p-2 sm:p-0 rounded shadow sm:shadow-none">
      {/* Nombre e ID */}
      <td className="px-4 py-3 sm:table-cell block">
        <div className="font-medium text-gray-800">{item.nombre}</div>
        <div className="text-gray-400 text-xs mt-1">
          <span>CI:</span> {item.ci}
        </div>
        <div className="text-xs text-gray-400 sm:hidden mt-1">
          ID: {item.id_inscrito} <br />
          Área: {item.area} <br />
          Nivel: {item.nivel} <br />
          Nota: {item.nota}
        </div>
      </td>

      {/* Área y Nivel */}
      <td className="px-4 py-3 hidden sm:table-cell">{item.area}</td>
      <td className="px-4 py-3 hidden sm:table-cell">{item.nivel}</td>

      {/* Nota */}
      <td className="px-4 py-3   w-[150px] sm:table-cell">
        <div className="relative">
          <input
            className={`bg-white rounded-2xl border px-4 py-3 pr-12 w-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:outline-none ${
              showErrorNota ? "border-red-400" : "border-gray-300"
            }`}
            value={nota}
            onChange={onNotaChange}
            onBlur={onNotaBlur}
            placeholder="0–100"
            inputMode="decimal"
          />
          {!esClasificado && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80">
              {showErrorNota ? <ErrorBadge /> : <Lapis />}
            </span>
          )}
        </div>
        {notaDraftMsg && (
          <ToastInline
            key={`nota-draft-${item.id}-${notaDraftKey}`}
            show
            text={notaDraftMsg}
            onHide={() => setNotaDraftMsg("")}
          />
        )}
        {showErrorNota && (
          <ToastInline
            key={`nota-${item.id}-${nota}`}
            show
            text={
              esVacio || !numValido
                ? "Debe ingresar una nota válida"
                : "La nota debe estar entre 0 y 100 (se admite 1 decimal)"
            }
            onHide={() => {}}
          />
        )}
      </td>

      {/* Conducta */}
      <td className="px-4 py-3 w-[210px] sm:w-auto">
        <div className="space-y-1 flex flex-col sm:flex sm:space-y-0 sm:gap-2 sm:flex-wrap">
          {["respeto", "integridad", "puntualidad"].map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cond[c]}
                onChange={(e) =>
                  setCond((prev) => ({ ...prev, [c]: e.target.checked }))
                }
                className="accent-[var(--primary)] w-4 h-4"
                disabled={esClasificado}
              />
              <span className="text-gray-700 capitalize">{c}</span>
            </label>
          ))}
        </div>
      </td>

      {/* Descripción */}
      <td className="px-4 py-3 w-[320px] sm:w-auto">
        <div className="relative">
          <textarea
            className={`bg-white rounded-2xl border px-4 py-3 resize-none pr-12 w-full min-h-[76px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] focus:outline-none ${
              showErrorDesc ? "border-red-400" : "border-gray-300"
            }`}
            value={descripcion}
            disabled={esClasificado}
            onChange={(e) => {
              setDescripcion(e.target.value);
              if (!descTouched) setDescTouched(true);
            }}
            onBlur={() => setDescTouched(true)}
            placeholder="Observación (5–60 caracteres)"
          />
          {!esClasificado && (
            <span className="absolute right-3 top-3 opacity-80">
              {showErrorDesc ? <ErrorBadge /> : <Lapis />}
            </span>
          )}
        </div>
        {showErrorDesc && (
          <ToastInline
            key={`desc-${item.id_evaluacion}-${descripcion.length}`}
            show
            text="La observación debe ser mayor a 5 y menor a 60 caracteres"
            onHide={() => {}}
          />
        )}
      </td>

      {/* Estado */}
      <td className="px-4 py-3 align-top text-start sm:table-cell block mt-2 sm:mt-0">
        {item.estado_clasificado ? (
          <span
            className={`inline-block px-3 py-1 rounded-2xl text-xs ${
              estadoColor[item.estado_clasificado] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {item.estado_clasificado}
          </span>
        ) : (
          <span className="text-gray-400 italic">Sin estado</span>
        )}
      </td>

      {/* Acción */}
      {!esClasificado && (
        <td className="px-4 py-3 align-top w-[150px] sm:w-auto block sm:table-cell mt-2 sm:mt-0">
          <button
            onClick={onGuardar}
            disabled={!(cambios && notaValida && descValida) || saving}
            className={`rounded-2xl px-4 py-2.5 w-full text-white transition ${
              cambios && notaValida && descValida && !saving
                ? "hover:bg-[var(--primary)] bg-[var(--primary)]"
                : "bg-[color:rgb(var(--primary-rgb)/0.5)] cursor-not-allowed"
            }`}
          >
            {saving ? "Guardando…" : "Registrar"}
          </button>
          {cambios && !saving && (
            <span className="text-center text-orange-500 block mt-2">
              Pendiente
            </span>
          )}

          {toastErr && (
            <ToastInline
              key={`err-${item.id_evaluacion}-${toastErr}`}
              show
              text={toastErr}
              onHide={() => setToastErr("")}
            />
          )}
          {toastOk && (
            <ToastInline
              key={`ok-${item.id_evaluacion}-${Date.now()}`}
              show
              type="success"
              text="Calificación guardada"
              onHide={() => setToastOk(false)}
            />
          )}
        </td>
      )}
    </tr>
  );
}
