import React from "react";
import { useCorreccionNotificaciones } from "@/hooks/useCorreccionNotificaciones";

export default function CorreccionNotificationBell() {
  const { unreadCount, openModal } = useCorreccionNotificaciones();

  return (
    <button
      type="button"
      onClick={openModal}
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-[var(--grisClaro)] focus:outline-none"
      aria-label="Notificaciones de corrección de notas"
    >
      <span role="img" aria-hidden="true" className="text-[18px]">
        🔔
      </span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#0284C7] text-white text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow">
          {unreadCount}
        </span>
      )}
    </button>
  );
}