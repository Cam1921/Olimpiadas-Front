import React from "react";
import { useCorreccionNotificaciones } from "@/hooks/useCorreccionNotificaciones";
import { Bell } from "lucide-react";

export default function CorreccionNotificationBell() {
  const { unreadCount, openModal } = useCorreccionNotificaciones();

  return (
    <button
      type="button"
      onClick={openModal}
      className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Notificaciones de corrección de notas"
    >
      <Bell className="text-blue-600 w-6 h-6" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-5 px-1 flex items-center justify-center shadow-md animate-pulse">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
