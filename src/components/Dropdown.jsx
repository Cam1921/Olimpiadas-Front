import React, { useState, useEffect, useRef } from "react";
import { FiCheck } from "react-icons/fi";

export default function Dropdown({
  items = [],
  selectedLabel,
  onSelect,
  defaultLabel = "",
  icon: Icon,
  buttonClass = "",
  menuClass = "",
  disabled = false,
  dropdowClass = "",
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedLabel || defaultLabel);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedLabel !== undefined) {
      setSelected(selectedLabel || defaultLabel);
    }
  }, [selectedLabel, defaultLabel]);

  const handleSelect = (item) => {
    const label = item.label || item;
    setSelected(label);
    setOpen(false);
    onSelect?.(item);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative flex  flex-col ${dropdowClass}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`flex justify-between items-center gap-x-2 px-3 py-2 text-sm bg-white border rounded-lg ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
        } ${buttonClass}`}
      >
        <span>{selected}</span>
        {Icon && <Icon className="size-3" />}
      </button>

      {open && !disabled && (
        <div
          className={`absolute top-11 z-20 bg-white border rounded-xl shadow-lg p-1 ${menuClass}`}
        >
          <div className="max-h-60 overflow-y-auto">
            {items.map((item, index) => {
              const label = item.label || item;
              const isSelected = label === selected;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full flex justify-between items-center text-left py-1.5 px-3 rounded-lg text-sm hover:bg-gray-100"
                >
                  <span>{label}</span>
                  {isSelected && <FiCheck className="text-gray-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
