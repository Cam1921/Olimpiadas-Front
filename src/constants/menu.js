  // src/constants/menu.js
  export const ROLE_NAMES = {
    ADMINISTRADOR: "administrador",
    EVALUADOR: "evaluador",
    RESPONSABLE_DE_AREA: "responsable",
  };

  export const MENU_BY_ROLE = {
    [ROLE_NAMES.ADMINISTRADOR]: [
      { icon: "BiHome", label: "Panel Principal", path: "panel-principal" },
      { icon: "GoPeople", label: "Gestion de Inscripciones", path: "gestion-inscripciones" },
       { icon: "CalendarCheck", label: "Cronograma de Actividades", path: "gestion-cronograma" },
      { icon: "HiOutlineUserGroup", label: "Gestion de Roles", path: "gestion-roles" },
      { icon: "AiOutlineEdit", label: "Asignación de Competidores", path: "asignacion-competidores" },
      { icon: "GoMail", label: "Notificaciones de acceso", path: "notificaciones" },
      { icon: "BsSliders2", label: "Control de Fases", path: "control-fases" },
      { icon: "HiAcademicCap", label: "Entorno Final", path: "entorno-final" },
      { icon: "GrTrophy", label: "Medallero y Premiación", path: "medallero-premiacion" },
      
      { icon: "LuFileCheck", label: "Certificados", path: "certificados" },
      { icon: "ImSphere", label: "Publicación", path: "publicacion" },
      { icon: "IoTimeOutline", label: "Trazabilidad/Log", path: "trazabilidad-log" },
    ],
    [ROLE_NAMES.EVALUADOR]: [
      { icon: "BiHome", label: "Panel Principal", path: "panel-evaluador" },
      { icon: "HiOutlinePencilSquare", label: "Registrar Notas", path: "registrar-notas" },
      { icon: "BiCategoryAlt", label: "Clasificación", path: "clasificacion" },
      { icon: "BsPersonCheck", label: "Información Personal", path: "informacion-personal" },
    ],
    [ROLE_NAMES.RESPONSABLE_DE_AREA]: [
      { icon: "BiHome", label: "Panel Principal", path: "control-fases" },
      { icon: "BsSliders2", label: "Control de Fases de mi Área", path: "control-fases-area" },
      { icon: "BsPersonCheck", label: "Información Personal", path: "informacion-personal" },
    ],
  };
