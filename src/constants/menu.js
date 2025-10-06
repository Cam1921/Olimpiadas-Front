// src/constants/menu.js
export const ROLE_NAMES = {
  ADMINISTRADOR: "ADMINISTRADOR",
  EVALUADOR: "EVALUADOR",
  RESPONSABLE_DE_AREA: "RESPONSABLE_DE_AREA",
};

export const MENU_BY_ROLE = {
  [ROLE_NAMES.ADMINISTRADOR]: [
    { icon: "BiHome", label: "Panel Principal", path: "panel-principal" },
    { icon: "GoPeople", label: "Gestion de inscripciones", path: "gestion-inscripciones" },
    { icon: "HiOutlineUserGroup", label: "Evaluadores", path: "evaluadores" },
    { icon: "BsSliders2", label: "Responsables", path: "responsables" },
    { icon: "HiAcademicCap", label: "Evaluaciones", path: "evaluaciones" },
    { icon: "GrTrophy", label: "Control de Fases", path: "control-fases" },
    { icon: "FaRegFileAlt", label: "Reportes", path: "reportes" },
    { icon: "LuFileCheck", label: "Evaluación Móvil", path: "evaluacion-movil" },
    { icon: "ImSphere", label: "Registro de Actividades", path: "registro-actividades" },
    { icon: "IoTimeOutline", label: "Configuración", path: "configuracion" },
  ],
  [ROLE_NAMES.EVALUADOR]: [
    { icon: "BiHome", label: "Panel Principal", path: "panel-principal" },
    { icon: "HiOutlinePencilSquare", label: "Evaluaciones", path: "evaluaciones" },
  ],
  [ROLE_NAMES.RESPONSABLE_DE_AREA]: [
    { icon: "BiHome", label: "Panel Principal", path: "panel-principal" },
    { icon: "BsSliders2", label: "Control de Fases", path: "control-fases" },
    { icon: "FaRegFileAlt", label: "Reportes", path: "reportes" },
  ],
};
