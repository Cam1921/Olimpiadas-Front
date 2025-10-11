// src/utils/areaUtils.js
export const isAreaCompleta = (area, takenAreas) => {
  const asignaciones = takenAreas.filter(a => a.area === area);
  return asignaciones.some(a => a.nivel === 'Primaria') && 
         asignaciones.some(a => a.nivel === 'Secundaria');
};