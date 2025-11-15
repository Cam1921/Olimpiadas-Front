// src/pages/dashboard/publicacion/components/CustomSelect.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  className = "w-full",
  maxHeight = 288,
}) {
  const [open, setOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!rootRef.current || rootRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useLayoutEffect(() => {
    const update = () => btnRef.current && setMenuWidth(btnRef.current.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    if (btnRef.current) ro.observe(btnRef.current);
    return () => ro.disconnect();
  }, []);

  const idx = options.findIndex((o) => o === value);

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-sm text-ink/70 pr-5 py-1"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{value}</span>
        <MdKeyboardArrowDown className={`text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Menú con el mismo ancho */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-2 bg-white rounded-lg shadow-[0_8px_24px_rgba(0,0,0,.12)] border border-ink/10 overflow-hidden"
          style={{ width: menuWidth }}
        >
          <ul className="overflow-auto" style={{ maxHeight }}>
            {options.map((opt, i) => {
              const selected = i === idx;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`px-3 py-2 text-sm flex items-center justify-between cursor-pointer
                    ${selected ? "bg-surface" : "bg-white"} hover:bg-gray-100`}
                >
                  <span className="truncate">{opt}</span>
                  {selected && <FiCheck className="text-ink/60 shrink-0" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
