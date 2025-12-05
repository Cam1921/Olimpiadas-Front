import React from "react";
import { useCorreccionNotificaciones } from "@/hooks/useCorreccionNotificaciones";

export default function CorreccionNotificationToast() {
  const { toastMessage } = useCorreccionNotificaciones();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-xl shadow-xl px-4 py-3 min-w-[260px]">
      <p className="text-sm font-semibold text-gray-900">
        Abriendo notificación
      </p>
      <p className="text-xs text-gray-600 mt-1">{toastMessage}</p>
    </div>
  );
}
