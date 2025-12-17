import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";

const PDF_URL = "/convocatorias/convocatoria-general-2025.pdf";

export default function ConvocatoriaPage({ onLoginClick }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb]">
      <Navbar onLoginClick={onLoginClick} />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          {/* Volver */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
            >
              <HiArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          {/* Título */}
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Convocatoria General 2025
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Documento oficial con la información general, requisitos y fechas
              de las Olimpiadas Científicas Estudiantiles.
            </p>
          </header>

          {/* Card principal */}
          <div className="mt-8 rounded-[1.8rem] bg-white border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
            <div className="px-6 sm:px-10 py-8 text-center">
              {/* Ícono */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0284c7] text-white shadow-lg shadow-[#0284c7]/30">
                <HiOutlineDocumentText className="h-8 w-8" />
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Convocatoria General – Oh! SanSi 2025
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Documento PDF oficial
              </p>

              {/* Botones */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0284c7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0284c7]/35 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <HiOutlineEye className="h-5 w-5" />
                  Ver PDF
                </a>

                <a
                  href={PDF_URL}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <HiOutlineArrowDownTray className="h-5 w-5" />
                  Descargar
                </a>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Contenido de la convocatoria
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Objetivos generales de las Olimpiadas Científicas 2025</li>
              <li>Áreas de competencia disponibles y modalidades</li>
              <li>Requisitos de inscripción y participación</li>
              <li>Cronograma oficial: fase clasificatoria y fase final</li>
              <li>Criterios de evaluación y sistema de premiación</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}