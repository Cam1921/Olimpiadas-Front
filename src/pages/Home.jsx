// src/pages/Home.jsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/features/auth/components/LoginModal";
import React, { useState, useEffect } from "react";
import { GrTrophy } from "react-icons/gr";
import {
  HiAdjustmentsVertical,
  HiOutlineDocumentText,
  HiOutlineMegaphone,
  HiOutlineCalendarDays,
  HiOutlineBookOpen,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import olimpiadas from "@/assets/olimpiadas.png";
import { Link, useNavigate } from "react-router-dom";

const AREAS = [
  {
    id: 1,
    nombre: "Matemáticas",
    imagen:
      "https://www.usnews.com/dims4/USNEWS/bf3dbbf/2147483647/thumbnail/970x647/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2Fb1%2F27%2Ff8c548524fe39df2027f706d98c0%2Fgettyimages-173544649.jpg",
  },
  {
    id: 2,
    nombre: "Física",
    imagen:
      "https://blog.turistax.com/wp-content/uploads/2024/08/Historia-del-Parapente.png",
  },
  {
    id: 3,
    nombre: "Química",
    imagen:
      "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    nombre: "Biología",
    imagen:
      "https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 5,
    nombre: "Informática",
    imagen:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 6,
    nombre: "Astronomía - Astrofísica",
    imagen:
      "https://images.pexels.com/photos/52910/pexels-photo-52910.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 7,
    nombre: "Robótica",
    imagen:
      "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const NOVEDADES = [
  {
    id: 1,
    titulo: "Comunicado oficial: Inicio de la Gestión 2025",
    descripcion:
      "Convocatoria abierta para todas las áreas de competencia científica. Inscripciones vigentes.",
    icono: HiOutlineMegaphone,
  },
  {
    id: 2,
    titulo: "Cronograma general 2025",
    descripcion:
      "Fechas clave de la fase clasificatoria y final para cada área de competencia.",
    icono: HiOutlineCalendarDays,
  },
  {
    id: 3,
    titulo: "Misión y propósito de las Olimpiadas",
    descripcion:
      "Promover la excelencia académica y el desarrollo del pensamiento científico.",
    icono: HiOutlineBookOpen,
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // ======== CARRUSEL SIMPLE: ventana de 3 áreas ========
  const [areaIndex, setAreaIndex] = useState(0); // índice del primer área visible

  const getVisibleAreas = () => {
    const visibles = [];
    for (let i = 0; i < 3; i++) {
      const idx = (areaIndex + i) % AREAS.length;
      visibles.push(AREAS[idx]);
    }
    return visibles;
  };

  // auto-slide cada 5s
  useEffect(() => {
    const interval = setInterval(
      () => setAreaIndex((prev) => (prev + 1) % AREAS.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);
  // ======================================================

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb]">
      <Navbar onLoginClick={() => setOpen(true)} />
      <LoginModal open={open} onClose={() => setOpen(false)} />

      <main className="flex-1">
        {/* HERO PRINCIPAL */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0284c7] via-[#38bdf8] to-[#7dd3fc] text-white">
          {/* Ondas SVG */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-64 lg:h-96">
            <svg
              className="absolute inset-x-0 bottom-0 h-full w-full"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                fillOpacity="0.10"
                d="M0,192L60,176C120,160,240,128,360,106.7C480,85,600,75,720,80C840,85,960,107,1080,138.7C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              />
            </svg>
            <svg
              className="absolute inset-x-0 bottom-0 h-full w-full"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                fillOpacity="0.05"
                d="M0,128L48,149.3C96,171,192,213,288,240C384,267,480,277,576,272C672,267,768,245,864,213.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>

          {/* Círculos decorativos */}
          <div className="pointer-events-none absolute top-20 left-10">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full bg-white opacity-10" />
          </div>
          <div className="pointer-events-none absolute top-40 right-20 rotate-45">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white opacity-10" />
          </div>
          <div className="pointer-events-none absolute bottom-40 left-1/4">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 rounded-full bg-white opacity-5" />
          </div>

          {/* Contenido hero */}
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-8 pb-20 md:px-8 md:pt-12 md:pb-24 lg:flex-row lg:items-center lg:pt-16 lg:pb-48">
            {/* Texto */}
            <div className="space-y-6 lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs sm:text-sm font-medium backdrop-blur-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#0284c7]">
                  <GrTrophy />
                </span>
                <span>OHSANSI 2025</span>
              </div>

              <h1 className="font-bold leading-tight text-white text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px]">
                Olimpiadas Científicas Estudiantiles 2025
              </h1>

              <p
                className="max-w-xl text-[14px] sm:text-[16px] lg:text-[18px] text-white/90"
                style={{ lineHeight: 1.5 }}
              >
                Plataforma digital para la gestión integral de las competencias
                científicas estudiantiles. Participa en las fases clasificatoria
                y final, y demuestra tu talento académico en tu disciplina
                favorita.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button className="rounded-xl bg-white px-6 py-3 sm:px-8 sm:py-4 text-sm font-semibold text-[#0284c7] shadow-2xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-gray-50">
                  Explorar áreas
                </button>
                <button className="rounded-xl border-2 border-white bg-transparent px-6 py-3 sm:px-8 sm:py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-white/10">
                  Ver convocatorias
                </button>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative lg:w-1/2">
              <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
              <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl shadow-xl bg-white">
                <img
                  src={olimpiadas}
                  className="w-full h-[280px] md:h-[350px] lg:h-[420px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ÁREAS DE COMPETENCIA */}
        <section className="bg-white py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-[28px] sm:text-[32px] lg:text-[33px] font-semibold text-[#23263d]">
                Áreas de competencia científica
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-600">
                Elige tu disciplina favorita y demuestra tu excelencia académica
              </p>
            </div>

            {/* MOBILE: grid simple */}
            <div className="grid gap-6 sm:grid-cols-2 md:hidden">
              {AREAS.map((area) => (
                <article
                  key={area.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="relative h-40">
                    <img
                      src={area.imagen}
                      alt={area.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="px-4 py-4 text-center">
                    <h3 className="text-sm font-semibold text-[#23263d]">
                      {area.nombre}
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            {/* DESKTOP/TABLET: carrusel mostrando SIEMPRE 3 */}
            <div className="relative hidden md:block">
              {/* Flecha izquierda */}
              <button
                type="button"
                aria-label="Áreas anteriores"
                onClick={() =>
                  setAreaIndex(
                    (prev) => (prev - 1 + AREAS.length) % AREAS.length
                  )
                }
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-xl shadow-black/15 ring-1 ring-slate-200 hover:-translate-y-1/2 hover:-translate-x-0.5 hover:shadow-2xl"
              >
                <HiChevronLeft className="h-5 w-5 text-slate-600" />
              </button>

              <div className="mx-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getVisibleAreas().map((area) => (
                    <article
                      key={area.id}
                      className="group bg-white rounded-[1.8rem] shadow-[0_10px_40px_rgba(15,23,42,0.08)] overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="relative h-44 lg:h-52">
                        <img
                          src={area.imagen}
                          alt={area.nombre}
                          className="h-full w-full object-cover"
                        />
                        {/* overlay azul en hover */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0284c7]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <div className="px-6 pb-6 pt-4 text-center">
                        <h3 className="text-base font-semibold text-[#23263d]">
                          {area.nombre}
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Flecha derecha */}
              <button
                type="button"
                aria-label="Áreas siguientes"
                onClick={() =>
                  setAreaIndex((prev) => (prev + 1) % AREAS.length)
                }
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-xl shadow-black/15 ring-1 ring-slate-200 hover:-translate-y-1/2 hover:translate-x-0.5 hover:shadow-2xl"
              >
                <HiChevronRight className="h-5 w-5 text-slate-600" />
              </button>

              {/* Puntitos: uno por cada área (7) */}
              <div className="mt-6 flex justify-center gap-2">
                {AREAS.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAreaIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      areaIndex === index
                        ? "w-6 bg-[#0284c7]"
                        : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Ir al área ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RESULTADOS OFICIALES */}
        <section className="bg-[#f4f7fb] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
            <div className="rounded-[2rem] bg-white px-6 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.15)] md:px-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0284c7] text-white">
                <HiOutlineDocumentText className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                Resultados Oficiales
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-600">
                Consulta resultados por área, fase y clasificación. Accede a
                toda la información de manera transparente y actualizada.
              </p>
              <button
                onClick={() => {
                  navigate("/results");
                }}
                className="mt-6 rounded-full bg-[#0284c7] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0284c7]/40 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Consultar resultados
              </button>
            </div>
          </div>
        </section>

        {/* SOBRE LAS OLIMPIADAS */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:px-8">
            {/* Texto */}
            <div className="space-y-5 lg:w-1/2">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#e0f4ff] px-4 py-2 text-xs font-semibold text-[#0284c7]">
                <HiAdjustmentsVertical className="h-4 w-4" />
                Sobre las Olimpiadas
              </button>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                ¿Qué son las Olimpiadas Científicas Estudiantiles?
              </h2>

              <p className="text-sm md:text-base text-slate-600">
                Las Olimpiadas Científicas Estudiantiles OHSANSI son
                competencias académicas diseñadas para identificar, reconocer y
                premiar la excelencia estudiantil en áreas fundamentales del
                conocimiento científico.
              </p>

              <p className="text-sm md:text-base text-slate-600">
                Nuestro programa se desarrolla en{" "}
                <span className="font-semibold">dos fases principales:</span>
              </p>

              <div className="space-y-3 border-l-4 border-[#0284c7] pl-4 text-sm md:text-base text-slate-700">
                <div>
                  <p className="font-semibold text-[#0284c7]">
                    Fase Clasificatoria
                  </p>
                  <p>
                    Evaluación inicial abierta a todos los estudiantes inscritos
                    en cada área de competencia.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#0284c7]">Fase Final</p>
                  <p>
                    Los mejores clasificados compiten por medallas de oro, plata
                    y bronce en cada disciplina.
                  </p>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-600">
                Nuestra misión es promover el desarrollo del pensamiento
                científico, el razonamiento lógico y la pasión por el
                conocimiento entre estudiantes de todas las regiones del país.
              </p>
            </div>

            {/* Imagen */}
            <div className="lg:w-1/2">
              <div className="mx-auto max-w-md overflow-hidden rounded-[2.3rem] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
                <img
                  src="https://northernvirginiamag.com/wp-content/uploads/2020/02/students-looking-in-microscope.jpg"
                  alt="Medallas científicas"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* NOVEDADES */}
        <section className="bg-[#f4f7fb] py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold text-[#0284c7]">Novedades</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Mantente informado sobre las últimas actualizaciones
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {NOVEDADES.map((novedad) => {
                const Icon = novedad.icono;
                return (
                  <article
                    key={novedad.id}
                    className="flex h-full flex-col rounded-[1.8rem] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284c7] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {novedad.titulo}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600">
                      {novedad.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
