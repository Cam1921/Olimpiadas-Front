// src/pages/Home.jsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/features/auth/components/LoginModal";
import { useState } from "react";
import { GrTrophy } from "react-icons/gr";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { FiDownload } from "react-icons/fi";
import olimpiadas from "@/assets/olimpiadas.png";
import { Link } from 'react-router-dom';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fbfb]">
      <Navbar onLoginClick={() => setOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* HERO */}
        <section
          aria-label="Hero"
          className="grid items-center  md:grid-cols-1"
        >
          {/* Texto */}
          <div className="space-y-5 grid grid-cols-2 gap-10">
            <div className="grid gap-4">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-ink">
                <span className="block">Bienvenidos a las</span>
                <span className="block">Olimpiadas en</span>
                <span className="block">Ciencia y Tecnología</span>
              </h1>

              <p className="text-ink/70 leading-relaxed">
                Plataforma oficial para la gestión y participación en las
                olimpiadas en ciencia y tecnología estudiantiles. Descubre tu
                potencial académico y compite con los mejores estudiantes del
                país.
              </p>
            </div>
            {/* Placeholder derecha */}
            {/*<div className="h-56 md:h-72 lg:h-80 rounded-2xl bg-surface shadow-soft self-center -mt-4" />*/}
            <img
              src={olimpiadas}
              alt="Olimpiadas en Ciencia y Tecnología"
              className="h-56 md:h-72 lg:h-80 rounded-2xl shadow-soft self-center "
              loading="eager"
              decoding="async"
            />
          </div>
          {/* Botones */}
          <div className="mt-4 md:mt-6 flex gap-3 flex-wrap md:flex-nowrap">
<Link
  to="/results"
  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 md:px-5 md:py-3
               border border-[var(--primary)] text-[var(--primary)] bg-white
               hover:bg-[#ebf4f8] hover:text-black
               active:bg-[var(--primary)] active:text-white active:border-[var(--primary)]
               focus:bg-[var(--primary)] focus:text-white focus:border-[var(--primary)]
               focus:hover:bg-[var(--primary)] focus:hover:text-white
               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
               transition select-none whitespace-nowrap"
>
  <GrTrophy size={18} className="shrink-0" />
  <span className="font-medium">Ver Resultados Oficiales</span>
</Link>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 md:px-5 md:py-3
                           border border-[var(--primary)] text-[var(--primary)] bg-white
                           hover:bg-[#ebf4f8] hover:text-black
                           active:bg-[var(--primary)] active:text-white active:border-[var(--primary)]
                           focus:bg-[var(--primary)] focus:text-white focus:border-[var(--primary)]
                           focus:hover:bg-[var(--primary)] focus:hover:text-white
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
                           transition select-none whitespace-nowrap"
            >
              <HiAdjustmentsVertical size={18} className="shrink-0" />
              <span className="font-medium">Información de Clasificación</span>
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 md:px-5 md:py-3
                           border border-[var(--primary)] text-[var(--primary)] bg-white
                           hover:bg-[#ebf4f8] hover:text-black
                           active:bg-[var(--primary)] active:text-white active:border-[var(--primary)]
                           focus:bg-[var(--primary)] focus:text-white focus:border-[var(--primary)]
                           focus:hover:bg-[var(--primary)] focus:hover:text-white
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
                           transition select-none whitespace-nowrap"
            >
              <FiDownload size={18} className="shrink-0" />
              <span className="font-medium">Descargar Convocatoria</span>
            </a>
          </div>
        </section>

        {/* PRESENTACIÓN */}
        <section className="mt-20">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-ink mb-6">
            Presentación
          </h2>
          <p className="mx-auto max-w-4xl text-center text-ink/70 leading-relaxed">
            El Comité de la Olimpiadas Científica Nacional San Simón Oh! SanSi, a
            través de la Facultad de Ciencias y Tecnología de la Universidad
            Mayor de San Simón, convoca a los estudiantes del Sistema de
            Educación Regular a participar en las Olimpiadas Oh! SanSi 2025.
          </p>

          <h2 className="text-center text-2xl md:text-3xl font-semibold text-ink mt-14 mb-6">
            Participantes
          </h2>
          <p className="mx-auto max-w-4xl text-center text-ink/70 leading-relaxed mb-8">
            Estudiantes del Subsistema de Educación Regular del Estado
            Plurinacional de Bolivia; en las áreas de: MATEMÁTICA, FÍSICA,
            QUÍMICA, BIOLOGÍA, ASTRONOMÍA Y ASTROFÍSICA, e INFORMÁTICA; de
            acuerdo al siguiente detalle:
          </p>

          {/* Tabla */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-surface text-ink/90 font-semibold px-4 py-3">
              <div>Área</div>
              <div>Año de escolaridad</div>
            </div>

            <ul className="divide-y divide-slate-200">
              {[
                [
                  "Astronomía y Astrofísica",
                  "De tercero de primaria a 6to de secundaria",
                ],
                ["Biología", "De segundo de secundaria a sexto de secundaria"],
                ["Física", "De cuarto a sexto de secundaria"],
                ["Informática", "De quinto de primaria a sexto de secundaria"],
                ["Matemática", "De primero a sexto de secundaria"],
                ["Química", "De segundo a sexto de secundaria"],
              ].map(([area, anios]) => (
                <li
                  key={area}
                  className="grid grid-cols-1 md:grid-cols-2 px-4 py-4"
                >
                  <div className="text-ink">{area}</div>
                  <div className="text-ink/70">{anios}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón Descargar Convocatorias */}
          <div className="flex justify-center mt-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3
                         border border-[var(--primary)] text-[var(--primary)] bg-white
                         hover:bg-[#ebf4f8] hover:text-black
                         active:bg-[var(--primary)] active:text-white active:border-[var(--primary)]
                         focus:bg-[var(--primary)] focus:text-white focus:border-[var(--primary)]
                         focus:hover:bg-[var(--primary)] focus:hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2
                         transition select-none whitespace-nowrap"
            >
              <FiDownload size={18} className="shrink-0" />
              <span className="font-medium">Descargar Convocatorias</span>
            </a>
          </div>
        </section>

        {/* INFORMACIÓN (dentro del Home) */}
        <section className="mt-20">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-ink mb-8 tracking-wide">
            INFORMACIÓN
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1 */}
            <article className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6">
              <h3 className="text-[var(--primary)] font-semibold mb-4">
                Contacto General
              </h3>
              <dl className="space-y-3 text-ink">
                <div>
                  <dt className="font-semibold text-lg">Email:</dt>
                  <dd className="text-ink/80">
                    <a
                      href="mailto:olimpiadas@fcyt.umss.edu.bo"
                      className="underline-offset-2 hover:underline"
                    >
                      olimpiadas@fcyt.umss.edu.bo
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-lg">Teléfono:</dt>
                  <dd className="text-ink/80">+591 4 4542563</dd>
                </div>
                <div>
                  <dt className="font-semibold text-lg">Dirección:</dt>
                  <dd className="text-ink/80">
                    Facultad de Ciencias y Tecnología
                    <br />
                    Universidad Mayor de San Simón
                    <br />
                    Cochabamba, Bolivia
                  </dd>
                </div>
              </dl>
            </article>

            {/* Card 2 */}
            <article className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6">
              <h3 className="text-[var(--primary)] font-semibold mb-4">
                Soporte Técnico
              </h3>
              <dl className="space-y-3 text-ink">
                <div>
                  <dt className="font-semibold text-lg">Plataforma Digital:</dt>
                  <dd className="text-ink/80">
                    <a
                      href="mailto:soporte.olimpiadas@umss.edu.bo"
                      className="underline-offset-2 hover:underline"
                    >
                      soporte.olimpiadas@umss.edu.bo
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-lg">
                    Horario de Atención:
                  </dt>
                  <dd className="text-ink/80">
                    Lunes a Viernes: 8:00 - 18:00
                    <br />
                    Sábados: 9:00 - 13:00
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-lg">Redes Sociales:</dt>
                  <dd className="text-ink/80">
                    Facebook: @OlimpiadasCyT
                    <br />
                    Instagram: @olimpiadas_cyt
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <p className="mx-auto max-w-3xl text-center text-ink/60 mt-10">
            Para consultas específicas sobre cada área de competencia, favor
            contactar directamente con los responsables de área a través de la
            plataforma oficial o los canales de comunicación proporcionados.
          </p>
        </section>
      </main>

      {/* Footer solo barra azul */}
      <Footer />
      {open && <LoginModal open onClose={() => setOpen(false)} />}
    </div>
  );
}
