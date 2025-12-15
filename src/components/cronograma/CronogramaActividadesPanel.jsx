// src/components/CronogramaActividadesPanel.jsx
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import ConfirmationModal from "../ConfirmationModal";
import SuccessDialog from "../SuccessDialog";
import { actividadService } from "@/services/actividadService";
import { faseService } from "@/services/faseService";
import Dropdown from "../Dropdown";
import { FaChevronDown } from "react-icons/fa";
import { Label } from "@headlessui/react";
import { Button } from "../Button";
import ButtonIo from "@/shared/ui/ButtonIo";

const parseLocalDate = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    const d = new Date(dateInput);
    d.setHours(12, 0, 0, 0);
    return d;
  }
  if (typeof dateInput === "string") {
    const cleaned = dateInput.trim();
    if (!cleaned) return null;
    const parts = cleaned.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day, 12, 0, 0, 0);
      }
    }
  }
  return null;
};

const getDateString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function CronogramaActividadesPanel({ userRole = "admin" }) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  const [fases, setFases] = useState([]);
  const [fase, setFase] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [actividad, setActividad] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    setCurrentMonth(new Date(selectedYear, selectedMonth, 1));
  }, [selectedYear, selectedMonth]);

  // === FETCH FUNCTIONS ===
  const fetchActivities = async (faseid) => {
    setActividades([]); // ✅ Limpia para evitar duplicados
    if (!faseid) return;
    try {
      setLoading(true);
      const res = await actividadService.porFase(faseid);
      const data = res.data;
      const adaptedData = data.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setActividades(adaptedData);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error al cargar actividades");
      setLoading(false);
    }
  };

  const fetchFases = async () => {
    try {
      setLoading(true);
      const res = await faseService.getDropdown();
      const data = res.data;
      const adaptedData = data.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setFases(adaptedData);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error al cargar fases");
      setLoading(false);
    }
  };

  const fetchAllfases = async () => {
    try {
      setLoading(true);
      const res = await faseService.getAll();
      const data = res.data;

      const adaptedData = data
        .filter((item) => item.fecha_inicio || item.fecha_fin)
        .map((item) => {
          const dates = [];
          if (item.fecha_inicio && item.fecha_fin) {
            const start = parseLocalDate(item.fecha_inicio.split("T")[0]);
            const end = parseLocalDate(item.fecha_fin.split("T")[0]);

            const current = new Date(start);
            while (current <= end) {
              const dateStr = getDateString(current);
              if (dateStr === getDateString(start)) {
                dates.push({
                  date: dateStr,
                  time: item.hora_inicio_ini || "09:00",
                });
              } else if (dateStr === getDateString(end)) {
                dates.push({
                  date: dateStr,
                  time: item.hora_fin_fin || "17:00",
                });
              } else {
                dates.push({ date: dateStr, time: "00:00" });
              }
              current.setDate(current.getDate() + 1);
            }
          } else if (item.fecha_inicio) {
            dates.push({
              date: item.fecha_inicio.split("T")[0],
              time: item.hora_inicio_ini || "09:00",
            });
          }

          return {
            id: item.id,
            name: item.nombre,
            description: item.descripcion,
            fase: item.nombre,
            fase_id: null,
            color: getRandomColor(),
            published: item.estado_publicado,
            dates,
            fecha_inicio_original: item.fecha_inicio
              ? item.fecha_inicio.split("T")[0]
              : "",
            fecha_fin_original: item.fecha_fin
              ? item.fecha_fin.split("T")[0]
              : "",
            hora_ini_original: item.hora_inicio_ini || "09:00",
            hora_fin_original: item.hora_fin_fin || "17:00",
          };
        });
      console.log(adaptedData);
      setActivities(adaptedData);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error al cargar fases");
      setLoading(false);
    }
  };

  const fetchAllActividades = async () => {
    try {
      setLoading(true);
      const res = await actividadService.getAll();
      const data = res.data;
      console.log(res);
      const adaptedData = data
        .filter((item) => item.fecha_inicio || item.fecha_fin)
        .map((item) => {
          const dates = [];
          if (item.fecha_inicio && item.fecha_fin) {
            const start = parseLocalDate(item.fecha_inicio.split("T")[0]);
            const end = parseLocalDate(item.fecha_fin.split("T")[0]);
            const current = new Date(start);
            while (current <= end) {
              const dateStr = getDateString(current);
              if (dateStr === getDateString(start)) {
                dates.push({
                  date: dateStr,
                  time: item.hora_inicio_ini || "09:00",
                });
              } else if (dateStr === getDateString(end)) {
                dates.push({
                  date: dateStr,
                  time: item.hora_fin_fin || "17:00",
                });
              } else {
                dates.push({ date: dateStr, time: "00:00" });
              }
              current.setDate(current.getDate() + 1);
            }
          } else if (item.fecha_inicio) {
            dates.push({
              date: item.fecha_inicio.split("T")[0],
              time: item.hora_inicio_ini || "09:00",
            });
          }
          return {
            id: item.id,
            name: item.nombre,
            description: item.descripcion,
            fase: item.fase || "",
            fase_id: item.fase_id,
            color: getRandomColor(),
            published: item.estado_publicado,
            dates,
            fecha_inicio_original: item.fecha_inicio
              ? item.fecha_inicio.split("T")[0]
              : "",
            fecha_fin_original: item.fecha_fin
              ? item.fecha_fin.split("T")[0]
              : "",
            hora_ini_original: item.hora_inicio_ini || "09:00",
            hora_fin_original: item.hora_fin_fin || "17:00",
          };
        });
      setActivities((prev) => [...prev, ...adaptedData]);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error al cargar actividades");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllfases();
    fetchAllActividades();
    fetchFases();
  }, []);

  useEffect(() => {
    if (fase) fetchActivities(fase.value);
  }, [fase]);

  // === UTILS ===
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
      const date = new Date(year, month, day, 12, 0, 0, 0);
      if (!isNaN(date.getTime())) days.push(date);
    }
    return days;
  };

  const days = generateDays();

  const isFutureOrToday = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
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

  // === NAVIGATION FUNCTIONS (must be BEFORE renderAdminView) ===
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

  // === HANDLERS ===
  const resetForm = () => {
    setFase(null);
    setActividad(null);
    setNewActivityName(null);
    setNewActivityDescription("");
    setSelectedDates([
      { date: "", time: "09:00" },
      { date: "", time: "17:00" },
    ]);
    setEditingActivity(null);
    setShowAddActivity(false);
  };

  const handleAddActivity = () => {
    if (!selectedDay) {
      alert("Por favor, seleccione un día en el calendario.");
      return;
    }
    const dateStr = getDateString(selectedDay);
    resetForm();
    setSelectedDates([
      { date: dateStr, time: "09:00" },
      { date: dateStr, time: "17:00" },
    ]);
    setShowAddActivity(true);
  };

  const saveActivity = async (isEditing) => {
    try {
      setLoading(true);
      const data = {
        mode: isEditing ? "edit" : "create",
        estado_publicado: "borrador",
        descripcion: newActivityDescription.trim() || "",
      };

      if (selectedDates[0]?.date) {
        data.fecha_inicio = selectedDates[0].date;
        data.hora_inicio_ini = selectedDates[0].time;
      }
      if (selectedDates[1]?.date) {
        data.fecha_fin = selectedDates[1].date;
        data.hora_fin_fin = selectedDates[1].time;
      }

      if (actividad && fase) {
        await actividadService.update(actividad.value, data);
      } else {
        await faseService.update(fase.value, data);
      }

      await fetchAllfases();
      await fetchAllActividades();
      setSuccessTitle(
        isEditing ? "Actividad Actualizada" : "Actividad Programada"
      );
      setSuccessSubtitle(
        isEditing
          ? "Los cambios han sido guardados"
          : "La actividad ha sido creada con éxito"
      );
      setSuccessMessage(
        `"${newActivityName?.label || newActivityName}" ${
          isEditing ? "ha sido actualizada" : "se ha programado"
        }.`
      );
      setShowSuccess(true);
      resetForm();
      setSelectedDay(null);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error desconocido"
      );
    } finally {
      setTimeout(() => setError(""), 5000);
      setLoading(false);
    }
  };

  const handleUpdateActivity = () => saveActivity(true);

  const confirmDeleteActivity = async (activity) => {
    try {
      const data = {
        mode: "edit",
        estado_publicado: "sin_fechas",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio_ini: "",
        hora_fin_fin: "",
      };
      if (activity.fase && activity.fase_id) {
        await actividadService.update(activity.id, data);
      } else {
        await faseService.update(activity.id, data);
      }
      await fetchAllfases();
      await fetchAllActividades();
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
      await fetchAllfases();
      await fetchAllActividades();
      setSuccessTitle("Cronograma Publicado");
      setSuccessSubtitle("Todos los participantes pueden ver las fechas");
      setSuccessMessage("El cronograma ha sido publicado exitosamente.");
      setShowSuccess(true);
      setShowConfirmPublish(false);
    } catch (error) {
      setError("Error al publicar el cronograma");
      console.error("Error al publicar:", error);
    }
  };

  const openEventDetail = (activity, eventDate) => {
    setShowEventDetail({ activity, eventDate });
  };

  const editFromDetail = (activity) => {
    if (!activity?.id)
      return alert("Error: La actividad no tiene un ID válido.");

    handleEditActivity(activity);
    setEditingActivity(activity);
    setNewActivityName(activity.name);
    setNewActivityDescription(activity.description || "");
    console.log("actificad a editar", activity);
    const startDate = activity.fecha_inicio_original || "";
    const endDate = activity.fecha_fin_original || "";
    const startTime = (activity.hora_ini_original || "09:00:00").slice(0, 5); // "HH:MM"
    const endTime = (activity.hora_fin_original || "17:00:00").slice(0, 5); // "HH:MM"

    const dates = [
      { date: startDate, time: startTime },
      { date: endDate, time: endTime },
    ];
    console.log(dates);

    setSelectedDates(dates);
    setShowAddActivity(true);
    setShowEventDetail(null);
    setSelectedDay(null);
  };
  const isSelected = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return false;
    const dStr = getDateString(date);
    return getDateString(selectedDay) === dStr;
  };

  const toggleDay = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return;
    if (!isFutureOrToday(date)) return;

    const dStr = getDateString(date);

    setSelectedDay((prev) => {
      const exists = getDateString(prev) === dStr;
      if (exists) {
        return null;
      }

      // Reemplazar cualquier fecha existente con la nueva
      return date;
    });
  };
  const handleEditActivity = (activityData) => {
    if (!activityData) return;
    if (activityData.fase && activityData.fase_id) {
      setActividad({ label: activityData.name, value: activityData.id });
      setNewActivityName({ label: activityData.name, value: activityData.id });
      setFase({ label: activityData.fase, value: activityData.fase_id });
    } else {
      setActividad(null);
      setFase({ label: activityData.name, value: activityData.id });
    }
  };

  const estado_publicado = {
    publicado: "Publicado",
    borrador: "Borrador",
  };

  // === VIEWS ===
  const renderAdminView = () => (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Cronograma de Actividades
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {selectedDay
              ? `Día seleccionado: ${selectedDay.toLocaleDateString()}`
              : "Seleccione un día en el calendario para programar una actividad."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            className={`btn btn-outline flex items-center justify-center gap-2 w-full sm:w-auto ${
              !selectedDay ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddActivity}
            disabled={!selectedDay}
          >
            <PlusIcon className="w-4 h-4" /> Nueva Actividad
          </button>

          <button
            className={`btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto ${
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
          <button
            onClick={goToPreviousMonth}
            className="btn btn-sm btn-outline"
          >
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
                className={`flex flex-col items-center justify-center text-xs rounded-md p-1 transition-colors cursor-pointer ${
                  !isValidDate
                    ? ""
                    : !isFutureOrToday(date)
                    ? "text-slate-300 bg-slate-50 cursor-not-allowed"
                    : isSelected(date)
                    ? "bg-blue-200 border border-blue-500"
                    : info
                    ? "bg-white border border-slate-200 hover:bg-slate-100"
                    : "hover:bg-slate-100"
                } ${showAddActivity ? "pointer-events-none opacity-70" : ""}`}
                onClick={() => {
                  if (isValidDate && isFutureOrToday(date)) {
                    toggleDay(date);
                  }
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
                          openEventDetail(event.activity, date);
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
          activities.map((activity, index) => {
            const firstDate = activity.dates[0];
            const lastDate = activity.dates[activity.dates.length - 1];
            console.log("actividad", activity);
            return (
              <div
                key={index}
                className="card p-4 flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                {/* IZQUIERDA */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${activity.color}`}
                  >
                    {activity.fase_id
                      ? activity.name + "-" + activity.fase
                      : activity.name}
                  </span>

                  <div className="text-sm text-slate-600">
                    {activity.fecha_inicio_original &&
                      activity.hora_ini_original && (
                        <>
                          {new Date(
                            activity.fecha_inicio_original + "T00:00:00"
                          ).toLocaleDateString()}{" "}
                          ({activity.hora_ini_original})
                        </>
                      )}

                    {activity.fecha_fin_original &&
                      activity.hora_fin_original && (
                        <>
                          {" • "}
                          {new Date(
                            activity.fecha_fin_original + "T00:00:00"
                          ).toLocaleDateString()}{" "}
                          ({activity.hora_fin_original})
                        </>
                      )}
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

                {/* DERECHA */}
                <div className="flex gap-2 justify-end">
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
                    {activity.published
                      ? estado_publicado[activity.published]
                      : "Borrador"}
                  </span>
                </div>
              </div>
            );
          })
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
                            openEventDetail(event.activity, date);
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
                    const dt = parseLocalDate(d.date);
                    return `${dt.toLocaleDateString()} (${d.time})`;
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
                    const dt = parseLocalDate(d.date);
                    return `${dt.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })} • ${d.time}`;
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

  return (
    <div className="space-y-6">
      {userRole === "admin" && renderAdminView()}
      {userRole === "evaluator" && renderEvaluatorView()}
      {userRole === "competitor" && renderCompetidorView()}

      {/* Modal: Descripción */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              {showDescriptionModal.name}
            </h3>
            <div className="text-sm text-slate-600 mb-4">
              {showDescriptionModal.fecha_inicio_original &&
                showDescriptionModal.hora_ini_original && (
                  <>
                    {new Date(
                      showDescriptionModal.fecha_inicio_original + "T00:00:00"
                    ).toLocaleDateString()}{" "}
                    ({showDescriptionModal.hora_ini_original})
                  </>
                )}

              {showDescriptionModal.fecha_fin_original &&
                showDescriptionModal.hora_fin_original && (
                  <>
                    {" • "}
                    {new Date(
                      showDescriptionModal.fecha_fin_original + "T00:00:00"
                    ).toLocaleDateString()}{" "}
                    ({showDescriptionModal.hora_fin_original})
                  </>
                )}
            </div>
            <div className="text-sm text-slate-500 italic mb-4">
              {showDescriptionModal.description || "Sin descripción"}
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="btn btn-outline text-sm"
                onClick={() => setShowDescriptionModal(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nueva/Editar Actividad */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">
              {editingActivity ? "Editar Actividad" : "Nueva Actividad"}
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded mb-4">
                {typeof error === "string"
                  ? error
                  : error.message || "Error desconocido"}
              </div>
            )}

            <Dropdown
              items={actividades || []}
              defaultLabel="Selecciona una actividad"
              selectedLabel={
                actividad
                  ? actividad.label
                  : "Selecciona una actividad (seleccione una fase antes)"
              }
              icon={FaChevronDown}
              menuClass="w-full"
              dropdowClass="w-full"
              buttonClass="px-3 py-2 w-full border border-slate-300 rounded mb-3 text-sm text-left flex justify-between items-center"
              disabled={editingActivity || !fase}
              onSelect={(item) => {
                setActividad(item);
                setNewActivityName(item);
                setActividad(item);
              }}
            />
            <Dropdown
              items={fases || []}
              defaultLabel="Selecciona una fase*"
              selectedLabel={fase ? fase.label : "Selecciona una fase*"}
              icon={FaChevronDown}
              menuClass="w-full"
              buttonClass="px-3 py-2 w-full border border-slate-300 rounded mb-3 text-sm text-left flex justify-between items-center"
              disabled={editingActivity}
              dropdowClass="w-full"
              onSelect={(item) => {
                setActividad(null);
                setFase(item);
                setNewActivityName(item);
              }}
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newActivityDescription}
              onChange={(e) => setNewActivityDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded mb-3 text-sm h-16"
            />

            <div className="p-2 bg-blue-50 w-full flex flex-col rounded mb-2">
              <div className="text-xs font-medium text-blue-800 mb-1">
                Fecha de inicio
              </div>
              <div className="flex justify-between gap-2">
                <input
                  type="date"
                  value={selectedDates[0]?.date || ""}
                  onChange={(e) => {
                    const newDates = [...selectedDates];

                    if (newDates.length < 2) newDates.push({ ...newDates[0] });
                    newDates[0].date = e.target.value;
                    setSelectedDates(newDates);
                  }}
                  className="border border-slate-300 w-full rounded px-2 py-1 text-sm"
                />
                <select
                  value={selectedDates[0]?.time || "09:00"}
                  onChange={(e) => {
                    const newDates = [...selectedDates];
                    if (newDates.length < 2) newDates.push({ ...newDates[0] });
                    newDates[0].time = e.target.value;
                    setSelectedDates(newDates);
                  }}
                  className="border border-slate-300 w-1/2 rounded px-2 py-1 text-sm"
                >
                  {Array.from({ length: 24 * 60 }, (_, i) => {
                    const hours = String(Math.floor(i / 60)).padStart(2, "0");
                    const minutes = String(i % 60).padStart(2, "0");
                    const value = `${hours}:${minutes}`;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="p-2 bg-purple-50 w-full flex flex-col rounded">
              <div className="text-xs font-medium text-purple-800 mb-1">
                Fecha de fin
              </div>
              <div className="flex justify-between  gap-2">
                <input
                  type="date"
                  value={selectedDates[1]?.date || ""}
                  onChange={(e) => {
                    const newDates = [...selectedDates];

                    if (newDates.length < 2) newDates.push({ ...newDates[0] });
                    newDates[1].date = e.target.value;
                    setSelectedDates(newDates);
                  }}
                  className="border border-slate-300 w-full rounded px-2 py-1 text-sm"
                />
                <select
                  value={selectedDates[1]?.time || "17:00"}
                  onChange={(e) => {
                    const newDates = [...selectedDates];

                    if (newDates.length < 2) newDates.push({ ...newDates[0] });
                    newDates[1].time = e.target.value;
                    setSelectedDates(newDates);
                  }}
                  className="border border-slate-300 w-1/2 rounded px-2 py-1 text-sm"
                >
                  {Array.from({ length: 24 * 60 }, (_, i) => {
                    const hours = String(Math.floor(i / 60)).padStart(2, "0");
                    const minutes = String(i % 60).padStart(2, "0");
                    const value = `${hours}:${minutes}`;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className=" flex-1 rounded-xl  text-sm"
                onClick={() => {
                  resetForm();
                  setSelectedDay(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 rounded-xl text-sm"
                onClick={
                  editingActivity
                    ? handleUpdateActivity
                    : () => saveActivity(false)
                }
                disabled={!newActivityName || !fase}
              >
                {editingActivity ? "Actualizar" : "Guardar"}
              </Button>
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
              {showEventDetail.activity.fecha_inicio_original &&
                showEventDetail.activity.hora_ini_original && (
                  <>
                    {new Date(
                      showEventDetail.activity.fecha_inicio_original +
                        "T00:00:00"
                    ).toLocaleDateString()}{" "}
                    ({showEventDetail.activity.hora_ini_original})
                  </>
                )}
              {showEventDetail.activity.fecha_fin_original &&
                showEventDetail.activity.hora_fin_original && (
                  <>
                    {" "}
                    •{" "}
                    {new Date(
                      showEventDetail.activity.fecha_fin_original + "T00:00:00"
                    ).toLocaleDateString()}{" "}
                    ({showEventDetail.activity.hora_fin_original})
                  </>
                )}
            </p>
            {showEventDetail.activity.description && (
              <p className="text-sm text-slate-500 mb-4 italic">
                {showEventDetail.activity.description}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="btn btn-outline flex-1 text-sm"
                onClick={() => setShowEventDetail(null)}
              >
                Cerrar
              </Button>
              {userRole === "admin" && (
                <Button
                  className="btn btn-primary flex-1 text-sm"
                  onClick={() => editFromDetail(showEventDetail.activity)}
                >
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modales de confirmación y éxito */}
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
