// src/components/ToastInline.jsx
import { useEffect, useState } from "react";

export default function ToastInline({ text = "", type = "error", show = false, onHide }) {
  const [visible, setVisible] = useState(show);
  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onHide?.(); }, 5000);
      return () => clearTimeout(t);
    }
  }, [show, onHide]);
  if (!visible) return null;
  const color = type === "success" ? "text-green-700" : "text-red-600";
  return <p className={`${color} text-sm mt-1`}>{text}</p>;
}
