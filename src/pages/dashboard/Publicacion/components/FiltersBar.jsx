// src/pages/dashboard/publicacion/components/FiltersBar.jsx
import { AREAS_NIVELES, esPrimaria, esSecundaria } from "../constants";
import { FaFilter } from "react-icons/fa";

export default function FiltersBar({
  area,
  nivel,
  onChangeArea,
  onChangeNivel,
  loading,
}) {
  const nivelesArea = AREAS_NIVELES.find((a) => a.area === area)?.niveles || [];
  const habilitaPrimaria = nivelesArea.some(esPrimaria);
  const habilitaSecundaria = nivelesArea.some(esSecundaria);

  return (
    <div className="rounded-2xl border p-3 gap-3 grid grid-cols-1 md:grid-cols-3">
      <div className="flex items-center gap-2">
        <FaFilter />
        <select
          className="border rounded-xl p-2 w-full"
          value={area}
          onChange={(e) => onChangeArea(e.target.value)}
          disabled={loading}
        >
          <option value="">Área…</option>
          {AREAS_NIVELES.map((a) => (
            <option key={a.area} value={a.area}>
              {a.area}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!habilitaPrimaria || loading}
          onClick={() => onChangeNivel(nivelesArea.find(esPrimaria) || "")}
          className={`px-3 py-2 rounded-xl border w-full
            ${nivel && esPrimaria(nivel) ? "bg-green-600 text-white" : ""}
            ${!habilitaPrimaria ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Primaria
        </button>

        <button
          type="button"
          disabled={!habilitaSecundaria || loading}
          onClick={() => onChangeNivel(nivelesArea.find(esSecundaria) || "")}
          className={`px-3 py-2 rounded-xl border w-full
            ${nivel && esSecundaria(nivel) ? "bg-purple-600 text-white" : ""}
            ${!habilitaSecundaria ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Secundaria
        </button>
      </div>

      <div className="text-sm self-center">
        {area ? (
          <span
            className={`px-2 py-1 rounded-lg border
          ${
            nivel && esPrimaria(nivel)
              ? "border-green-600 text-green-700"
              : nivel && esSecundaria(nivel)
              ? "border-purple-600 text-purple-700"
              : "text-gray-500"
          }`}
          >
            {nivel
              ? esPrimaria(nivel)
                ? "Primaria"
                : "Secundaria"
              : "Seleccione nivel"}
          </span>
        ) : (
          <span className="text-gray-500">Seleccione área</span>
        )}
      </div>
    </div>
  );
}
