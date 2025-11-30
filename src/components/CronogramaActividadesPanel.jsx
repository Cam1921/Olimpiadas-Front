// src/components/CronogramaActividadesPanel.jsx
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import ConfirmationModal from "./ConfirmationModal";
import SuccessDialog from "./SuccessDialog";
import { actividadService } from "@/services/actividadService";
import { faseService } from "@/services/faseService";
import Dropdown from "./Dropdown";
import { FaChevronDown } from "react-icons/fa";
export default function CronogramaActividadesPanel({ userRole = "admin" }) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditDateModal, setShowEditDateModal] = useState(null); 
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivityName, setNewActivityName] = useState(null);
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Operación Exitosa");
  const [successSubtitle, setSuccessSubtitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [fases, setFases] = useState([]);
  const [fase, setFase] = useState(null);
  const [actividades, SetActividades] = useState([]);
  const [actividad, setActividad] = useState(null);

  useEffect(() => {
    setCurrentMonth(new Date(selectedYear, selectedMonth, 1));
  }, [selectedYear, selectedMonth]);

  const fetchActivities = async (faseid) => {
    if (!faseid) return;
    try {
      setLoading(true);
      const res = await actividadService.porFase(faseid);
      const data = res.data;

      // adaptamos el backend a lo que la tabla necesita
      const adaptedData = data.map((item) => ({
        label: item.nombre,
        value: item.id,
      }));
      SetActividades(adaptedData);
      setLoading(false);
   } catch (error) {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Error desconocido al cargar los datos";
  setError(message); // ✅ Solo un string
  setLoading(false);
}
  };
  const fetchFases = async () => {
    try {
      setLoading(true);
      const res = await faseService.getDropdown();
      const data = res.data;

      // adaptamos el backend a lo que la tabla necesita
      const adaptedData = data.map((item) => ({
        label: item.nombre,
        value: item.id,
      }));

      setFases(adaptedData);
      setLoading(false);
    } catch (error) {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Error desconocido al cargar los datos";
  setError(message); // ✅ Solo un string
  setLoading(false);
}
  };
  const fetchAllfases = async () => {
    try {
      setLoading(true);
      const res = await faseService.getAll();
      const data = res.data;
      console.log(data);
      // adaptamos el backend a lo que la tabla necesita
      const adaptedData = data
        .filter((item) => item.fecha_inicio || item.fecha_fin)
        .map((item) => ({
          id: item.id,
          name: item.nombre,
          description: item.descripcion,
          fase: item.fase,
          fase_id: item.fase_id,
          color: getRandomColor(),
          published: item.estado_publicado,
          dates: [
            item.fecha_inicio
              ? {
                  date: item.fecha_inicio.split("T")[0],
                  startTime: item.hora_inicio_ini,
                  endTime: item.hora_fin_ini,
                }
              : null,
            item.fecha_fin
              ? {
                  date: item.fecha_fin.split("T")[0],
                  startTime: item.hora_inicio_fin,
                  endTime: item.hora_fin_fin,
                }
              : null,
          ].filter(Boolean),
        }));

      setActivities(adaptedData);
      setLoading(false);
    } catch (error) {
  const message =
    error.response?.data?.message ||
    error.message ||
    "Error desconocido al cargar las fases";
  setError(message); // ✅ Solo un string
  setLoading(false);
}
  };

  const fetchAllActividades = async () => {
  try {
    setLoading(true);
    const res = await actividadService.getAll();
    const data = res.data;
    const adaptedData = data
      .filter((item) => item.fecha_inicio || item.fecha_fin)
      .map((item) => ({
        id: item.id,
        name: `${item.nombre} - ${item.fase}`,
        description: item.descripcion,
        fase: item.fase,
        fase_id: item.fase_id,
        color: getRandomColor(),
        published: item.estado_publicado,
        dates: [
          item.fecha_inicio
            ? {
                date: item.fecha_inicio.split("T")[0],
                startTime: item.hora_inicio_ini,
                endTime: item.hora_fin_ini,
              }
            : null,
          item.fecha_fin
            ? {
                date: item.fecha_fin.split("T")[0],
                startTime: item.hora_inicio_fin,
                endTime: item.hora_fin_fin,
              }
            : null,
        ].filter(Boolean),
      }));
    setActivities((prev) => [...prev, ...adaptedData]);
    setLoading(false);
  } catch (error) {
    console.error("Error en fetchAllActividades:", error);
    // ✅ Extrae un mensaje amigable
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al cargar las actividades";
    setError(message); // ← solo un string
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAllfases();
    fetchAllActividades();
    fetchFases();
  }, []);

  useEffect(() => {
    if (fase) {
      fetchActivities(fase.value);
    } else {
      fetchFases();
    }
  }, [fase]);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offsetFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < offsetFirstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) days.push(date);
    }
    return days;
  };

  const days = generateDays();

  const getDateString = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isFutureOrToday = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
  };

  const isSelected = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return false;
    const dStr = getDateString(date);
    return selectedDates.some((item) => item.date === dStr);
  };

  const getActivityInfo = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
    const dStr = getDateString(date);
    const eventsOnDate = activities
      .filter((act) => act.dates.some((d) => d.date === dStr))
      .map((act) => {
        const event = act.dates.find((d) => d.date === dStr);
        return {
          ...event,
          id: act.id,
          name: act.name,
          fase: act.fase,
          id_fase: act.id_fase,
          description: act.description,
          color: act.color,
          published: act.published,
          activity: act,
        };
      });
    return eventsOnDate.length > 0 ? eventsOnDate : null;
  };

  const toggleDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return;
    if (!isFutureOrToday(date)) return;

    const dStr = getDateString(date);

    setSelectedDates((prev) => {
      const exists = prev.find((item) => item.date === dStr);

      // Si ya estaba seleccionada → quitarla
      if (exists) {
        return prev.filter((item) => item.date !== dStr);
      }

      // Si NO existe y ya hay 2 fechas → NO permitir agregar más
      if (prev.length >= 2) {
        console.log(
          "Solo puedes seleccionar la fecha de inicio y la fecha de fin."
        );
        return prev;
      }

      // Agregar nueva fecha
      const newDates = [
        ...prev,
        { date: dStr, startTime: "09:00", endTime: "17:00" },
      ];

      // Ordenar las fechas (inicio → fin)
      newDates.sort((a, b) => new Date(a.date) - new Date(b.date));

      return newDates;
    });
  };

  const getRandomColor = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-teal-100 text-teal-800",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetForm = () => {
    setFase(null);
    setActividad(null);
    setNewActivityDescription("");
    setSelectedDates([]);
    setEditingActivity(null);
    setShowAddActivity(false);
  };

  const handleAddActivity = async () => {
    try {
      setLoading(true);

      const data = {
        estado_publicado: "borrador",
        fecha_inicio: selectedDates[0].date,
        fecha_fin: selectedDates[selectedDates.length - 1].date,
        hora_inicio_ini: selectedDates[0].startTime,
        hora_fin_ini: selectedDates[0].endTime,
        hora_fin_fin: selectedDates[selectedDates.length - 1].endTime,
        hora_inicio_fin: selectedDates[selectedDates.length - 1].startTime,
        descripcion: newActivityDescription.trim() || "",
      };

      let id = null;

      if (actividad && fase) {
        const res = await actividadService.update(actividad.value, data);
        id = actividad.value;
      } else {
        const res = await faseService.update(fase.value, data);
        id = fase.value;
      }

      fetchAllfases();
      fetchAllActividades();
      setSuccessTitle("Actividad Programada");
      setSuccessSubtitle("La actividad ha sido creada con éxito");
      setSuccessMessage(
        `"${newActivityName.label}" se ha programado para ${selectedDates.length} día(s).`
      );
      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.log("Error al agregar la actividad:", error);
      if (error.response) {
        setError(
          error.response.data?.message || "Error al agregar la actividad."
        );
      } else if (error.request) {
        setError("El servidor no responde");
      } else {
        setError("Error desconocido al agregar la actividad.");
      }
    } finally {
      setTimeout(() => {
        setError("");
      }, 5000);
      setLoading(false);
    }
  };

  const handleUpdateActivity = async () => {
    setLoading(true);
    try {
      const hasPastDate = selectedDates.some((item) => {
        const selectedDate = new Date(item.date);
        return !isFutureOrToday(selectedDate);
      });

      const activityIdToEdit = editingActivity?.id;
      if (!activityIdToEdit) {
        alert("Error: No se pudo encontrar la actividad a editar.");
        return;
      }

      const data = {
        estado_publicado: "borrador",
        fecha_inicio: selectedDates[0].date,
        fecha_fin: selectedDates[selectedDates.length - 1].date,
        hora_inicio_ini: selectedDates[0].startTime,
        hora_fin_ini: selectedDates[0].endTime,
        hora_fin_fin: selectedDates[selectedDates.length - 1].endTime,
        hora_inicio_fin: selectedDates[selectedDates.length - 1].startTime,
        descripcion: newActivityDescription.trim() || null,
      };
      console.log(data);
      if (actividad && fase) {
        const res = await actividadService.update(actividad.value, data);
      } else {
        const res = await faseService.update(fase.value, data);
      }

      fetchAllfases();
      fetchAllActividades();

      setSuccessTitle("Actividad Actualizada");
      setSuccessSubtitle("Los cambios han sido guardados");
      setSuccessMessage(
        `"${newActivityName}" ha sido actualizada correctamente.`
      );
      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.log("Error al agregar la actividad:", error);
      if (error.response) {
        setError(
          error.response.data?.message || "Error al agregar la actividad."
        );
      } else if (error.request) {
        setError("El servidor no responde");
      } else {
        setError("Error desconocido al agregar la actividad.");
      }
    } finally {
      setTimeout(() => {
        setError("");
      }, 5000);
      setLoading(false);
    }
  };
const handleEditDateOnly = async () => {
  if (!showEditDateModal || selectedDates.length === 0) return;

  const { activity, date } = showEditDateModal;
  setLoading(true);

  try {
    // Asumiendo que `selectedDates[0]` es la única fecha seleccionada (ya que solo queremos editar una)
    const data = {
      fecha_inicio: selectedDates[0].date,
      fecha_fin: selectedDates[0].date, // Mismo día
      hora_inicio_ini: selectedDates[0].startTime,
      hora_fin_ini: selectedDates[0].endTime,
      hora_inicio_fin: selectedDates[0].startTime, // Mismo horario
      hora_fin_fin: selectedDates[0].endTime,
      // No cambiamos nombre, descripción, fase, etc.
    };

    let res;
    if (activity.fase) {
      res = await actividadService.update(activity.id, data);
    } else {
      res = await faseService.update(activity.id, data);
    }

    fetchAllfases();
    fetchAllActividades();

    setSuccessTitle("Fecha Actualizada");
    setSuccessSubtitle("La hora de la actividad ha sido modificada");
    setSuccessMessage(
      `"${activity.name}" ahora se realiza el ${new Date(selectedDates[0].date).toLocaleDateString()} de ${selectedDates[0].startTime} a ${selectedDates[0].endTime}.`
    );
    setShowSuccess(true);
    setShowEditDateModal(null);
    setSelectedDates([]); // Limpiar selección

  } catch (error) {
    console.log("Error al actualizar la fecha:", error);
    setError(error.response?.data?.message || "Error al actualizar la fecha.");
  } finally {
    setLoading(false);
  }
};
  const confirmDeleteActivity = async (activity) => {
    try {
      const first = selectedDates?.[0];
      const last = selectedDates?.[selectedDates.length - 1];

      const data = {
        estado_publicado: "sin_fechas",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio_ini: "",
        hora_fin_ini: "",
        hora_inicio_fin: "",
        hora_fin_fin: "",
      };

      if (activity.fase) {
        const res = await actividadService.update(activity.id, data);
      } else {
        const res = await faseService.update(activity.id, data);
      }
      fetchAllfases();
      fetchAllActividades();

      setSuccessTitle("Actividad Eliminada");
      setSuccessSubtitle("La actividad ya no está programada");
      setShowSuccess(true);
      setShowConfirmDelete(null);
    } catch (error) {
      console.log("Error al eliminar la actividad:", error);
    }
  };

  const handlePublish = async () => {
    try {
      await faseService.publicarTodo();
      fetchAllfases();
      fetchAllActividades();
      setActivities(activities.map((a) => ({ ...a, published: true })));
      setSuccessTitle("Cronograma Publicado");
      setSuccessSubtitle("Todos los participantes pueden ver las fechas");
      setSuccessMessage("El cronograma ha sido publicado exitosamente.");
      setShowSuccess(true);
      setShowConfirmPublish(false);
    } catch (error) {}
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth());
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth());
  };

  const openEventDetail = (activity, eventDate) => {
    setShowEventDetail({ activity, eventDate });
  };

  const editFromDetail = (activity) => {
    if (!activity?.id) {
      alert("Error: La actividad no tiene un ID válido.");
      return;
    }
    const fixTime = (time) => time?.slice(0, 5) ?? "00:00";
    handleEditActivity(activity);
    setEditingActivity(activity);
    setNewActivityName(activity.name);
    setNewActivityDescription(activity.description || "");
    setSelectedDates(
      activity.dates.map((d) => ({
        date: d.date,
        startTime: fixTime(d.startTime),
        endTime: fixTime(d.endTime),
      }))
    );
    setShowAddActivity(true);
    setShowEventDetail(null);
  };

  const handleEditActivity = (activityData) => {
    // activityData: objeto de la actividad a editar

    if (activityData == null) return;
    if (activityData.fase && activityData.fase_id) {
      setActividad({ label: activityData.name, value: activityData.id });
      setNewActivityName({ label: activityData.name, value: activityData.id });
      setFase({ label: activityData.fase, value: activityData.fase_id });
      setEditingActivity(true); // si manejas un estado de edición
    } else {
      setActividad(null);
      setFase({ label: activityData.name, value: activityData.id });
      setEditingActivity(true);
    }
  };
 const renderAdminView = () => (
  <>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Cronograma de Actividades
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona tus actividades con fechas y horarios.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          className="btn btn-outline flex items-center gap-2"
          onClick={() => {
              setEditingActivity(null);
            setFase(null);
            setActividad(null);
            setNewActivityName(null);
            setNewActivityDescription("");
            setSelectedDates([]);
            setShowAddActivity(true);
          }}
        >
          <PlusIcon className="w-4 h-4" /> Nueva Actividad
        </button>
        <button
          className={`btn btn-primary flex items-center gap-2 ${
            activities.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setShowConfirmPublish(true)}
          disabled={activities.length === 0}
        >
 <ArrowUpTrayIcon className="w-4 h-4" /> Publicar Cronograma
        </button>
      </div>
    </div>

      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-700">Año:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-slate-300 rounded px-2 py-1 text-xs w-20"
        >
            {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
       <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-700">Mes:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border border-slate-300 rounded px-2 py-1 text-xs w-24"
        >
            {monthNames.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>

     <div className="card p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="btn btn-sm btn-outline">
          {"<"}
        </button>
        <h3 className="text-lg font-medium">
          {monthNames[selectedMonth]} de {selectedYear}
        </h3>
        <button onClick={goToNextMonth} className="btn btn-sm btn-outline">
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-slate-500">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="text-center py-2">
            {day}
          </div>
        ))}
      </div>

              <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((date, idx) => {
          const isValidDate = date instanceof Date && !isNaN(date.getTime());
          const info = isValidDate ? getActivityInfo(date) : null;
          return (
            <div

   key={idx}
              className={`flex flex-col items-center justify-center text-xs rounded-md p-1 transition-colors ${
                !isValidDate
                  ? ""
                  : !isFutureOrToday(date)
                  ? "text-slate-300 bg-slate-50 cursor-not-allowed"
                  : info
                  ? "bg-white border border-slate-200 cursor-pointer"
                  : "bg-white hover:bg-slate-50 cursor-default"
              }`}
              onClick={(e) => {
   e.stopPropagation();
                if (isValidDate && isFutureOrToday(date) && info) {
                  // Solo si hay evento: abrir modal de edición completa
                  const firstEvent = info[0];
                  editFromDetail(firstEvent);
                }
                // Si no hay evento, no hacer nada (la creación se inicia desde el botón)
              }}
            >
      {isValidDate ? date.getDate() : ""}
              {isValidDate && info && (
                <div className="mt-1 space-y-1 w-full">
                  {info.map((event, i) => (
                    <div
                      key={i}
                      className={`px-1 py-0.5 text-[10px] rounded truncate ${event.color} text-xs cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEventDetail(event, date);
                      }}
                    >
                      {event.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
          })}
      </div>
    </div>
                

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Actividades Programadas
        </h2>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No hay actividades aún.
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className="card p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${activity.color}`}
                >
                  {activity.name}
                </span>
                <div className="text-sm text-slate-600">
                  {activity.dates
                    .map((d) => {
                      const dt = new Date(d.date);
                      return `${dt.toLocaleDateString()} (${d.startTime}–${
                        d.endTime
                      })`;
                    })
                    .join(", ")}
                </div>
                {activity.description && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 italic">
                      Descripción:
                    </span>
                    <button
                      onClick={() => setShowDescriptionModal(activity)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver descripción completa"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => editFromDetail(activity)}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  className="btn btn-sm btn-outline text-red-600"
                  onClick={() => setShowConfirmDelete(activity)}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activity.published
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {activity.published}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderEvaluatorView = () => (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Cronograma de Actividades
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Fechas clave para evaluadores.
      </p>

      <div className="card p-4">
        <div className="grid grid-cols-7 gap-1 text-xs font-medium text-slate-500 mb-2">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div key={day} className="text-center py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            const info = getActivityInfo(date);
            return (
              <div
                key={idx}
                className={`h-16 flex flex-col items-center justify-center text-xs rounded-md p-1 ${
                  info ? "bg-white border border-slate-200" : "bg-white"
                }`}
              >
                {date ? date.getDate() : ""}
                {info && (
                  <div className="mt-1 space-y-1 w-full">
                    {info
                      .filter((e) => e.published)
                      .map((event, i) => (
                        <div
                          key={i}
                          className={`px-1 py-0.5 text-[10px] rounded truncate ${event.color} text-xs cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventDetail(event, date);
                          }}
                        >
                          {event.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Eventos Confirmados
        </h2>
        {activities
          .filter((a) => a.published)
          .map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-md"
            >
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full ${activity.color}`}
              >
                {activity.name}
              </span>
              <div className="text-sm text-slate-600">
                {activity.dates
                  .map((d) => {
                    const dt = new Date(d.date);
                    return `${dt.toLocaleDateString()} (${d.startTime}–${
                      d.endTime
                    })`;
                  })
                  .join(", ")}
              </div>
              {activity.description && (
                <div className="text-xs text-slate-500 italic ml-2">
                  {activity.description}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  const renderCompetidorView = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        📅 Fechas Importantes
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        ¡No te pierdas ninguna fecha!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {activities
          .filter((a) => a.published)
          .map((activity) => (
            <div key={activity.id} className="p-4 border rounded-lg">
              <div
                className={`inline-block px-3 py-1 text-xs rounded-full ${activity.color} mb-2`}
              >
                {activity.name}
              </div>
              <div className="text-sm text-slate-600">
                {activity.dates
                  .map((d) => {
                    const dt = new Date(d.date);
                    return `${dt.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })} • ${d.startTime}–${d.endTime}`;
                  })
                  .join(", ")}
              </div>
              {activity.description && (
                <div className="text-xs text-slate-500 mt-2 italic">
                  {activity.description}
                </div>
              )}
            </div>
          ))}
      </div>

      {activities.filter((a) => a.published).length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Próximamente se publicarán las fechas.
        </div>
      )}
    </div>
  );
{/* Modal: Editar solo fecha/hora */}
{showEditDateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-5 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-3">Editar Fecha y Hora</h2>
      <p className="text-sm text-slate-600 mb-4">
        Actividad: <strong>{showEditDateModal.activity.name}</strong>
      </p>

      {/* Mostrar la fecha seleccionada */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          value={selectedDates[0]?.date || ""}
          onChange={(e) => {
            const newSelected = [...selectedDates];
            newSelected[0].date = e.target.value;
            setSelectedDates(newSelected);
          }}
          className="w-full p-2 border border-slate-300 rounded text-sm"
        />
      </div>

      {/* Horario */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Hora Inicio
          </label>
          <input
            type="time"
            value={selectedDates[0]?.startTime || "09:00"}
            onChange={(e) => {
              const newSelected = [...selectedDates];
              newSelected[0].startTime = e.target.value;
              setSelectedDates(newSelected);
            }}
            className="w-full p-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Hora Fin
          </label>
          <input
            type="time"
            value={selectedDates[0]?.endTime || "17:00"}
            onChange={(e) => {
              const newSelected = [...selectedDates];
              newSelected[0].endTime = e.target.value;
              setSelectedDates(newSelected);
            }}
            className="w-full p-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-outline flex-1 text-sm"
          onClick={() => {
            setShowEditDateModal(null);
            setSelectedDates([]);
          }}
        >
          Cancelar
        </button>
        <button
          className="btn btn-primary flex-1 text-sm"
          onClick={handleEditDateOnly}
          disabled={selectedDates.length === 0}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
// Componente personalizado para seleccionar fecha y hora
const DateTimePicker = ({ label, value, onChange, isEndDate = false }) => {
  // Generar opciones para días, meses, años, horas y minutos
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, '0'));
    }
    return days;
  };

  const generateMonths = () => {
    return [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }
    return years;
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 30) { // Solo 00 y 30 para simplificar
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  };

  // Parsear el valor actual
  let dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  // Manejar cambios
  const handleDateChange = (newDay, newMonth, newYear) => {
    const newDate = new Date(newYear, newMonth, newDay);
    const newTime = new Date(value);
    newTime.setFullYear(newYear);
    newTime.setMonth(newMonth);
    newTime.setDate(newDay);
    onChange(newTime.toISOString());
  };

  const handleTimeChange = (newHour, newMinute) => {
    const newTime = new Date(value);
    newTime.setHours(parseInt(newHour));
    newTime.setMinutes(parseInt(newMinute));
    onChange(newTime.toISOString());
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-700 mb-1">
        {label}
      </p>
      <div className="bg-white rounded-lg p-4 shadow">
        {/* Selector de Fecha */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <Picker
              selectedValue={day}
              onValueChange={(itemValue) => handleDateChange(itemValue, monthIndex, year)}
              style={{ height: 150 }}
            >
              {generateDays().map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </div>
          <div className="flex-1">
            <Picker
              selectedValue={monthIndex}
              onValueChange={(itemValue) => handleDateChange(day, itemValue, year)}
              style={{ height: 150 }}
            >
              {generateMonths().map((m, idx) => (
                <Picker.Item key={idx} label={m} value={idx} />
              ))}
            </Picker>
          </div>
          <div className="flex-1">
            <Picker
              selectedValue={year}
              onValueChange={(itemValue) => handleDateChange(day, monthIndex, itemValue)}
              style={{ height: 150 }}
            >
              {generateYears().map((y) => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
          </div>
        </div>

        {/* Selector de Hora */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Picker
              selectedValue={hour}
              onValueChange={(itemValue) => handleTimeChange(itemValue, minute)}
              style={{ height: 150 }}
            >
              {generateHours().map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
          </div>
          <div className="flex-1">
            <Picker
              selectedValue={minute}
              onValueChange={(itemValue) => handleTimeChange(hour, itemValue)}
              style={{ height: 150 }}
            >
              {generateMinutes().map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="space-y-6">
    {userRole === "admin" && renderAdminView()}
    {userRole === "evaluator" && renderEvaluatorView()}
    {userRole === "competitor" && renderCompetidorView()}

      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              {showDescriptionModal.name}
            </h3>
            <div className="text-sm text-slate-600 mb-4">
              {showDescriptionModal.dates
                .map((d) => {
                  const dt = new Date(d.date);
                  return `${dt.toLocaleDateString()} (${d.startTime}–${
                    d.endTime
                  })`;
                })
                .join(", ")}
            </div>
            <div className="text-sm text-slate-500 italic mb-4">
              {showDescriptionModal.description || "Sin descripción"}
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-outline text-sm"
                onClick={() => setShowDescriptionModal(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
  {showAddActivity && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-5 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-3">
        {editingActivity ? "Editar Actividad" : "Nueva Actividad"}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded mb-4">
          {typeof error === 'string' ? error : 'Ocurrió un error inesperado.'}
        </div>
      )}
      <Dropdown
            items={actividades || []}
            defaultLabel="Selecciona una actividad"
            selectedLabel={
              actividad?.label ||
              "Selecciona una actividad (seleccione una fase antes)"
            }
            icon={FaChevronDown}
            menuClass="w-full"
            buttonClass="px-3 py-2 w-full border border-slate-300 rounded mb-3 text-sm text-left flex justify-between items-center"
            disabled={editingActivity || !fase}
            onSelect={(item) => {
              if (!editingActivity) {
                setNewActivityName(item);
                setActividad(item);
              }
 }}
          />
          <Dropdown
            items={fases || []}
            defaultLabel="Selecciona una fase*"
            icon={FaChevronDown}
            selectedLabel={fase?.label || "Selecciona una fase*"}
            menuClass="w-full"
            buttonClass="px-3 py-2 w-full border border-slate-300 rounded mb-3 text-sm text-left flex justify-between items-center"
            disabled={editingActivity}
            onSelect={(item) => {
              if (!editingActivity) {
                setActividad(null);
                setFase(item);
                setNewActivityName(item);
              }
            }}
          />
           <textarea
            placeholder="Descripción (opcional)"
            value={newActivityDescription}
            onChange={(e) => setNewActivityDescription(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded mb-3 text-sm h-16"
          />

          
{/* ✅ NUEVOS CAMPOS: Desde y Hasta con inputs separados */}
<div className="space-y-4 mb-4">
  {/* Fecha y hora de inicio */}
  <div>
    <p className="text-sm font-medium text-slate-700 mb-1">
      Elige una fecha y hora de inicio
    </p>
    <div className="flex gap-2 mb-2">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
        <input
          type="date"
          value={selectedDates[0]?.date || ""}
          onChange={(e) => {
            const newSelected = [...selectedDates];
            newSelected[0].date = e.target.value;
            setSelectedDates(newSelected);
          }}
          className="w-full p-2 border border-slate-300 rounded text-sm"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">Hora</label>
        <input
          type="time"
          value={selectedDates[0]?.startTime || "09:00"}
          onChange={(e) => {
            const newSelected = [...selectedDates];
            newSelected[0].startTime = e.target.value;
            setSelectedDates(newSelected);
          }}
          className="w-full p-2 border border-slate-300 rounded text-sm"
          required
        />
      </div>
    </div>
  </div>

  {/* Fecha y hora de fin */}
  <div>
    <p className="text-sm font-medium text-slate-700 mb-1">
      Elige una fecha y hora de fin
    </p>
    <div className="flex gap-2 mb-2">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
        <input
          type="date"
          value={selectedDates[1]?.date || ""}
          onChange={(e) => {
            const newSelected = [...selectedDates];
            if (newSelected.length < 2) {
              newSelected.push({
                date: e.target.value,
                startTime: "09:00",
                endTime: "17:00",
              });
            } else {
              newSelected[1].date = e.target.value;
            }
            setSelectedDates(newSelected);
          }}
          className="w-full p-2 border border-slate-300 rounded text-sm"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-700 mb-1">Hora</label>
        <input
          type="time"
          value={selectedDates[1]?.startTime || "17:00"}
          onChange={(e) => {
            const newSelected = [...selectedDates];
            if (newSelected.length < 2) {
              newSelected.push({
                date: "",
                startTime: e.target.value,
                endTime: e.target.value,
              });
            } else {
              newSelected[1].startTime = e.target.value;
            }
            setSelectedDates(newSelected);
          }}
          className="w-full p-2 border border-slate-300 rounded text-sm"
          required
        />
      </div>
    </div>
  </div>
</div>
          <div className="flex gap-2">
            <button className="btn btn-outline flex-1 text-sm" onClick={resetForm}>
              Cancelar
            </button>
            <button
              className="btn btn-primary flex-1 text-sm"
              onClick={editingActivity ? handleUpdateActivity : handleAddActivity}
              disabled={!fase || selectedDates.length < 2}
            >
              {editingActivity ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
          )}
      {/* Modal: Detalle de Evento */}
      {showEventDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <div
              className={`inline-block px-3 py-1 text-xs rounded-full ${showEventDetail.activity.color} mb-3`}
            >
              {showEventDetail.activity.name}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {showEventDetail.activity.name}
            </h3>
            <p className="text-sm text-slate-600 mb-2">
              {new Date(showEventDetail.eventDate).toLocaleDateString()} •{" "}
              {showEventDetail.activity.startTime} –{" "}
              {showEventDetail.activity.endTime}
            </p>
            {showEventDetail.activity.description && (
              <p className="text-sm text-slate-500 mb-4 italic">
                {showEventDetail.activity.description}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="btn btn-outline flex-1 text-sm"
                onClick={() => setShowEventDetail(null)}
              >
                Cerrar
              </button>
              {userRole === "admin" && (
                <button
                  className="btn btn-primary flex-1 text-sm"
                  onClick={() => editFromDetail(showEventDetail.activity)}
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modales de confirmación */}
      {showConfirmDelete !== null && (
        <ConfirmationModal
          open={true}
          onClose={() => setShowConfirmDelete(null)}
          onConfirm={() => confirmDeleteActivity(showConfirmDelete)}
          title="Eliminar Actividad"
          message="¿Está seguro? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      <ConfirmationModal
        open={showConfirmPublish}
        onClose={() => setShowConfirmPublish(false)}
        onConfirm={handlePublish}
        title="Publicar Cronograma"
        message="¿Desea publicar todas las actividades? Serán visibles para todos los participantes."
        confirmText="Publicar"
        cancelText="Cancelar"
      />

      <SuccessDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successTitle}
        subtitle={successSubtitle}
        message={successMessage}
      />
    </div>
  );
}
