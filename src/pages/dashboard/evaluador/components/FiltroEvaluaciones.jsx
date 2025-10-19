import { useState } from "react";

export default function FiltroEvaluaciones({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <input
        className="border rounded-xl px-3 py-2 w-full"
        placeholder="Buscar por nombre…"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
