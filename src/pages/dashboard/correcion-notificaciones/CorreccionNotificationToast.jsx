import { useEffect } from "react";

export default function CorreccionNotificationToast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
}
