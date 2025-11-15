// src/pages/dashboard/publicacion/components/ToastInline.jsx
import { useEffect } from "react";

export default function ToastInline({ type="info", message, duration=5000, onClose }) {
  useEffect(() => { const t=setTimeout(onClose, duration); return () => clearTimeout(t); }, [duration, onClose]);
  const styles = {
    info:    "bg-brand/10 border-brand/30 text-ink",
    success: "bg-success/10 border-success/30 text-ink",
    error:   "bg-danger/10 border-danger/30 text-ink",
  }[type];
  return <div className={`fixed top-4 right-4 z-50 border ${styles} rounded-xl px-3 py-2 text-sm shadow`}>{message}</div>;
}
