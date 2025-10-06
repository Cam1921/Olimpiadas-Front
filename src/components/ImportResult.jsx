import React from "react";
import { Download } from "lucide-react";

const ImportResult = () => {
  const errores = [
    {
      fila: 23,
      motivo: "CI duplicado en la base de datos",
      columna: "CI",
      valor: "12345678",
    },
    { fila: 45, motivo: "Área no válida", columna: "Área", valor: "Robótica" },
    {
      fila: 67,
      motivo: "Campo Nivel es obligatorio",
      columna: "Nivel",
      valor: "—",
    },
    {
      fila: 89,
      motivo: "Formato de CI inválido",
      columna: "CI",
      valor: "12AB3456",
    },
    {
      fila: 112,
      motivo: "Unidad Educativa muy larga",
      columna: "Unidad Educativa",
      valor: "Colegio Nacional San Andrés …",
    },
    {
      fila: 134,
      motivo: "Departamento no válido",
      columna: "Departamento",
      valor: "Lima",
    },
    {
      fila: 145,
      motivo: "Grado debe ser numérico",
      columna: "Grado",
      valor: "Primero",
    },
    {
      fila: 178,
      motivo: "Contacto tutor legal faltante",
      columna: "Contacto Tutor Legal",
      valor: "—",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Mensaje de archivo validado */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold">
              ✓ Archivo validado correctamente.
            </span>
            <span className="text-gray-700">
              Se detectaron <strong>153 filas de datos.</strong>
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow">
            Importar inscritos
          </button>
        </div>
      </div>

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-green-700 font-medium">
            ✓ Inscritos importados correctamente
          </p>
          <span className="text-sm text-green-800">
            156 filas procesadas, <strong>148 competidores creados</strong>, 8
            con errores.
          </span>
        </div>
        <div className="mt-3">
          <button className="flex items-center text-green-700 hover:text-green-800 text-sm font-medium">
            <Download size={18} className="mr-2" />
            Descargar reporte de errores (.CSV)
          </button>
        </div>
      </div>

      {/* Detalle de errores */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            Detalle de errores por fila
          </h2>
          <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
            8 errores
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 font-medium">Fila</th>
              <th className="py-3 px-4 font-medium">Motivo del error</th>
              <th className="py-3 px-4 font-medium">Columna</th>
              <th className="py-3 px-4 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {errores.map((err, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-red-50 transition"
              >
                <td className="py-2 px-4 text-red-600 font-semibold">
                  #{err.fila}
                </td>
                <td className="py-2 px-4 text-red-600">{err.motivo}</td>
                <td>
                  <span className="ml-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {err.columna}
                  </span>
                </td>
                <td className="py-2 px-4 text-gray-700">{err.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportResult;
