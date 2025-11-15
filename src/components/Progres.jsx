// src/components/Progress.jsx
import React from "react";

export function Progress({ value = 0, className = "" }) {
  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-200"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
