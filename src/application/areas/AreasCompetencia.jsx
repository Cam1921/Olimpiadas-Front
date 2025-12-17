import React from "react";
import {
  HiArrowLeft,
  HiOutlineGlobeAlt,
  HiOutlineBeaker,
  HiOutlineCalculator,
  HiOutlineBolt,
  HiOutlineAcademicCap,
  HiOutlineComputerDesktop, // 👈 Laptop / informática
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const AREAS = [
  {
    id: 1,
    nombre: "Matemáticas",
    descripcion:
      "Desarrolla habilidades de razonamiento lógico, pensamiento abstracto y resolución de problemas matemáticos. Incluye contenidos de álgebra, geometría, cálculo, estadística y matemática aplicada, fomentando la precisión y el análisis crítico.",
    grados: "1° a 6° de Secundaria",
    icono: HiOutlineCalculator,
  },
  {
    id: 2,
    nombre: "Física",
    descripcion:
      "Analiza los fenómenos naturales relacionados con el movimiento, la energía, las fuerzas y la materia. Promueve el uso de modelos matemáticos, la experimentación y el pensamiento científico para comprender leyes físicas fundamentales.",
    grados: "3° a 6° de Secundaria",
    icono: HiOutlineBolt,
  },
  {
    id: 3,
    nombre: "Química",
    descripcion:
      "Estudia la composición, estructura y transformaciones de la materia. Incluye el análisis de reacciones químicas, propiedades de los elementos y compuestos, y su aplicación en contextos científicos, industriales y cotidianos.",
    grados: "3° a 6° de Secundaria",
    icono: HiOutlineBeaker,
  },
  {
    id: 4,
    nombre: "Biología",
    descripcion:
      "Explora los seres vivos, su estructura, funciones, evolución y relación con el entorno. Fomenta la comprensión de los sistemas biológicos, la biodiversidad y los procesos vitales desde un enfoque científico.",
    grados: "2° a 6° de Secundaria",
    icono: HiOutlineAcademicCap,
  },
  {
    id: 5,
    nombre: "Informática",
    descripcion:
      "Introduce al pensamiento computacional mediante la programación, el diseño de algoritmos y el uso responsable de la tecnología. Desarrolla habilidades para resolver problemas usando herramientas digitales y lenguajes de programación.",
    grados: "1° a 6° de Secundaria",
    icono: HiOutlineComputerDesktop, // 👈 Laptop
  },
  {
    id: 6,
    nombre: "Astronomía y Astrofísica",
    descripcion:
      "Investiga los cuerpos celestes, el origen y la evolución del universo. Incluye el estudio de planetas, estrellas, galaxias y fenómenos astronómicos, promoviendo la observación científica y la curiosidad por el cosmos.",
    grados: "3° primaria a 6° secundaria",
    icono: HiOutlineGlobeAlt,
  },
];

export default function AreasCompetencia() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Volver */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0284c7] hover:underline"
          >
            <HiArrowLeft className="h-5 w-5" />
            Volver al inicio
          </Link>
        </div>

        {/* Encabezado */}
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Áreas de competencia
          </h1>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto">
            Explora las diferentes áreas de competencia de las Olimpiadas en
            Ciencia y Tecnología y conoce los grados habilitados para participar
            en cada una de ellas.
          </p>
        </header>

        {/* Tarjetas */}
        <div className="space-y-6">
          {AREAS.map((area) => (
            <article
              key={area.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
                {/* Icono */}
                <div className="shrink-0">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/25">
                    {React.createElement(area.icono, {
                      className: "h-8 w-8 sm:h-9 sm:w-9",
                    })}
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    {area.nombre}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {area.descripcion}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-[#0284c7]">
                      Grados habilitados:
                    </span>
                    <span className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {area.grados}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
