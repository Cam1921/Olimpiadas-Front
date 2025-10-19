// src/pages/dashboard/evaluador/components/FiltroEvaluaciones.jsx
import { useState } from "react";

export default function FiltroEvaluaciones({ onChange }) {
  const [q, setQ] = useState("");
  return (
    <div className="flex gap-2">
      <input
        className="border rounded-xl px-3 py-2 w-full"
        placeholder="Buscar por código o nombre…"
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onChange?.(v);
        }}
      />
    </div>
  );
}

