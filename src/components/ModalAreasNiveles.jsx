import { X } from "lucide-react";
import { Button } from "./Button";

export default function ModalAreasNiveles({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-[95%] max-w-5xl h-[85vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Guía de Áreas, Niveles y Grados
            </h2>
            <p className="text-sm text-gray-500">Referencia para registro</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Área</th>
                <th className="border px-3 py-2 text-left">Nivel</th>
                <th className="border px-3 py-2 text-left">Grados</th>
              </tr>
            </thead>
            <tbody>
              {/* ASTRONOMÍA */}
              <tr className="bg-indigo-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  ASTRONOMÍA – ASTROFÍSICA
                </td>
              </tr>
              {[
                ["3P", "3ro Primaria"],
                ["4P", "4to Primaria"],
                ["5P", "5to Primaria"],
                ["6P", "6to Primaria"],
                ["1S", "1ro Secundaria"],
                ["2S", "2do Secundaria"],
                ["3S", "3ro Secundaria"],
                ["4S", "4to Secundaria"],
                ["5S", "5to Secundaria"],
                ["6S", "6to Secundaria"],
              ].map(([nivel, grado]) => (
                <tr key={nivel}>
                  <td className="border px-3 py-2">Astronomía - Astrofísica</td>
                  <td className="border px-3 py-2">{nivel}</td>
                  <td className="border px-3 py-2">{grado}</td>
                </tr>
              ))}

              {/* BIOLOGÍA */}
              <tr className="bg-emerald-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  BIOLOGÍA
                </td>
              </tr>
              {[
                "2do Secundaria",
                "3ro Secundaria",
                "4to Secundaria",
                "5to Secundaria",
                "6to Secundaria",
              ].map((grado, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">Biología</td>
                  <td className="border px-3 py-2">{i + 2}S</td>
                  <td className="border px-3 py-2">{grado}</td>
                </tr>
              ))}

              {/* FÍSICA */}
              <tr className="bg-amber-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  FÍSICA
                </td>
              </tr>
              {["4to", "5to", "6to"].map((g) => (
                <tr key={g}>
                  <td className="border px-3 py-2">Física</td>
                  <td className="border px-3 py-2">{g}S</td>
                  <td className="border px-3 py-2">{g} Secundaria</td>
                </tr>
              ))}

              {/* INFORMÁTICA */}
              <tr className="bg-sky-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  INFORMÁTICA
                </td>
              </tr>
              {[
                ["Guacamayo", "5to a 6to Primaria"],
                ["Guanaco", "1ro a 3ro Secundaria"],
                ["Londra", "1ro a 3ro Secundaria"],
                ["Jucumari", "4to a 6to Secundaria"],
                ["Bufeo", "1ro a 3ro Secundaria"],
                ["Puma", "4to a 6to Secundaria"],
              ].map(([nivel, grado]) => (
                <tr key={nivel}>
                  <td className="border px-3 py-2">Informática</td>
                  <td className="border px-3 py-2">{nivel}</td>
                  <td className="border px-3 py-2">{grado}</td>
                </tr>
              ))}

              {/* MATEMÁTICAS */}
              <tr className="bg-rose-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  MATEMÁTICAS
                </td>
              </tr>
              {["Primer", "Segundo", "Tercer", "Cuarto", "Quinto", "Sexto"].map(
                (nivel, i) => (
                  <tr key={nivel}>
                    <td className="border px-3 py-2">Matemáticas</td>
                    <td className="border px-3 py-2">{nivel} Nivel</td>
                    <td className="border px-3 py-2">{i + 1}ro Secundaria</td>
                  </tr>
                )
              )}

              {/* QUÍMICA */}
              <tr className="bg-lime-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  QUÍMICA
                </td>
              </tr>
              {["2S", "3S", "4S", "5S", "6S"].map((nivel) => (
                <tr key={nivel}>
                  <td className="border px-3 py-2">Química</td>
                  <td className="border px-3 py-2">{nivel}</td>
                  <td className="border px-3 py-2">
                    {nivel.replace("S", "")}to Secundaria
                  </td>
                </tr>
              ))}

              {/* ROBÓTICA */}
              <tr className="bg-violet-50 font-semibold">
                <td colSpan={3} className="border px-3 py-2">
                  ROBÓTICA
                </td>
              </tr>
              {[
                ["Builders P", "5to a 6to Primaria"],
                ["Builders S", "1ro a 6to Secundaria"],
                ["Lego P", "5to a 6to Primaria"],
                ["Lego S", "1ro a 6to Secundaria"],
              ].map(([nivel, grado]) => (
                <tr key={nivel}>
                  <td className="border px-3 py-2">Robótica</td>
                  <td className="border px-3 py-2">{nivel}</td>
                  <td className="border px-3 py-2">{grado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end border-t px-6 py-3">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
