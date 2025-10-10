import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({
  items = [],
  onSelect,
  defaultLabel = "",
  icon: Icon,
  buttonClass = "",
  menuClass = "",
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultLabel);
  const dropdownRef = useRef(null); // referencia al contenedor

  // 🔹 Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-flex flex-col items-center"
    >
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex justify-center items-center gap-x-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 ${buttonClass}`}
      >
        <span>{selected}</span>
        {Icon && <Icon className="size-3" />}
      </button>

      {/* Menú desplegable */}
      {open && (
        <div
          className={`absolute top-11 left-0 w-48 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-1 ${menuClass}`}
          role="menu"
        >
          <div className="max-h-60 overflow-y-auto rounded-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left py-1.5 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
