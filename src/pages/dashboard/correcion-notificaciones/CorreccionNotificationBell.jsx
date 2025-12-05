import { useCorreccionNotificaciones } from "../../hooks/useCorreccionNotificaciones";

export default function CorreccionNotificationBell({ onOpen }) {
  const { notificaciones, loading } = useCorreccionNotificaciones();

  if (loading) return null;

  const pendientes = notificaciones?.length || 0;

  return (
    <button
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
      onClick={onOpen}
    >
      <img
        src="/icons/bell.svg"
        alt="Notificaciones"
        className="w-6 h-6"
      />

      {pendientes > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
          {pendientes}
        </span>
      )}
    </button>
  );
}