import React from 'react';

// Datos de prueba simulando exactamente la imagen
const mockDataFinal = [
  { 
    posicion: "1º", 
    nombre: "Carlos Pérez López", 
    area: "Físico", 
    nivel: "Secundaria", 
    puntaje: "95 pts", 
    premio: "Oro" 
  },
  { 
    posicion: "2º", 
    nombre: "Luis Torrez", 
    area: "Astronomía", 
    nivel: "Secundaria", 
    puntaje: "91 pts", 
    premio: "Plata" 
  },
  { 
    posicion: "3º", 
    nombre: "Ana María Rodríguez", 
    area: "Matemáticas", 
    nivel: "Primaria", 
    puntaje: "87 pts", 
    premio: "Bronce" 
  },
  { 
    posicion: "4º", 
    nombre: "María González", 
    area: "Química", 
    nivel: "Secundaria", 
    puntaje: "82 pts", 
    premio: "Mención Honorífica" 
  },
];

const ResultsFinalTable = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">Resultados Fase Final</h2>
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Área
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Puntaje
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Premio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockDataFinal.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.posicion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.nivel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.puntaje}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.premio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsFinalTable;