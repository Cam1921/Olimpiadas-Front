import { FaRegEye, FaFileDownload } from "react-icons/fa";

export default function PublishActions({ fase, disabled, onPreview, onDownload }) {
  const inFinal = fase === "final";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="px-4 py-2 rounded-xl border flex items-center gap-2"
        onClick={onPreview}
        disabled={disabled || inFinal}
      >
        <FaRegEye /> Previsualizar
      </button>
      <button
        className="px-4 py-2 rounded-xl border flex items-center gap-2"
        onClick={onDownload}
        disabled={disabled || inFinal}
      >
        <FaFileDownload /> Descargar XLSX
      </button>
      {inFinal && (
        <span className="text-sm text-gray-500 self-center">
          Vista no funcional (en preparación)
        </span>
      )}
    </div>
  );
}
