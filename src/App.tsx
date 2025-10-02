import React, { useEffect, useState } from "react";

/* =================== CONFIG =================== */
const CFG = {
  nome: "MADALA CROSSFIT",
  titulo: "CrossFit & Judô & Ginástica & Competições & Workshop & Seminários ",
  whatsapp:
    "https://api.whatsapp.com/send/?phone=5511977181677&text&type=phone_number&app_absent=0",
  whatsMsg: "Olá! Quero agendar um treino particular de CrossFit.",
  endereco: "Rua do Treino, 123 – São Paulo/SP",
  mapsExt: "https://www.google.com/maps/place/Rua+do+Treino,+123",
  texto_teleprompt:
    "CrossFit & Judô & Ginástica & Competições & Workshop & Seminários",
  // Imagens (coloque em /public/img/)
  left: "/img/dr-left.jpg",
  center: "/img/dr-center.jpg",
  right: "/img/dr-right.jpg",
  heroBg:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600",
};

/* =================== STYLES (animações) =================== */
function MotionStyles() {
  return (
    <style>{`
      /* ===== flutuação suave ===== */
      @keyframes floatY {
        0% { transform: translateY(0) }
        50% { transform: translateY(-6px) }
        100% { transform: translateY(0) }
      }

      /* ===== revelar de baixo pra cima ===== */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px) }
        to   { opacity: 1; transform: translateY(0) }
      }
      .reveal { animation: fadeUp .6s ease forwards; opacity: 0 }
      .reveal-delay-0 { animation-delay: .15s }
      .reveal-delay-1 { animation-delay: .35s }
      .reveal-delay-2 { animation-delay: .55s }
      .reveal-delay-3 { animation-delay: .75s }

      /* ===== marquee direita -> esquerda ===== */
      @keyframes marqueeX {
        0%   { transform: translateX(100%) }
        100% { transform: translateX(-100%) }
      }
      .marquee-track {
        display: inline-block;
        white-space: nowrap;
        min-width: 100%;
        animation: marqueeX 20s linear infinite;
      }

      /* ===== splash sobe e some ===== */
      @keyframes slideUpSplash {
        0%   { transform: translateY(0);     opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }
      .animate-slide-up-splash {
        animation: slideUpSplash 5s ease-in-out forwards;
      }

      /* ===== esconder a barra de rolagem no carrossel (mobile) ===== */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

/* =================== CARD COM TILT 3D =================== */
type TiltCardProps = {
  title: string;
  desc: string;
  cta?: {
    label: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  };
  badge?: string;
};

function TiltCard({ title, desc, cta, badge }: TiltCardProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  function onMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -10;
    const ry = ((x - rect.width / 2) / rect.width) * 10;
    setStyle({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.02)`,
    });
  }
  function onLeave() {
    setStyle({
      transform:
        "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)",
    });
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className="group relative rounded-3xl border border-zinc-500 bg-zinc-800 p-2 transition will-change-transform"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 50%, rgba(255,255,255,.06), transparent 40%)",
        }}
      />
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}
      <div className="font-semibold text-white">{title}</div>
      <p className="mt-1 text-sm text-zinc-400">{desc}</p>

      {cta &&
        (cta.onClick ? (
          <button
            onClick={cta.onClick}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            {cta.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3l7 7-1.41 1.41L16 8.83V21h-2V8.83l-3.59 3.58L9 10l7-7z" />
            </svg>
          </button>
        ) : (
          <a
            href={cta.href!}
            {...(cta.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            {cta.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3l7 7-1.41 1.41L16 8.83V21h-2V8.83l-3.59 3.58L9 10l7-7z" />
            </svg>
          </a>
        ))}
    </div>
  );
}

/* =================== MODAL DE AGENDAMENTO =================== */
function BookingModal({
  open,
  url,
  onClose,
}: {
  open: boolean;
  url: string | null;
  onClose: () => void;
}) {
  if (!open || !url) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 rounded-full bg-zinc-900 px-2 py-2 text-white shadow ring-1 ring-white/40"
        >
          Fechar
        </button>
        <iframe
          src={url}
          title="Agendamento"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[70vh] w-full rounded-3xl bg-white"
        />
      </div>
    </div>
  );
}

/* =================== SEÇÃO DE PLANOS =================== */
function PlansSection({ whats }: { whats: string }) {
  const CAL_URL =
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3Ia65JtVBg0zZOihaPcN8AAU4DxProMlpgLLQnB2x1nEUDXU3En6Ptm7Ctvb8aUdmy_7AXbrbK?gv=true";
  const CAL_EMBED = `${CAL_URL}&embed=true`;

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const openBooking = (u: string) => {
    setUrl(u);
    setOpen(true);
  };
  const closeBooking = () => {
    setOpen(false);
    setUrl(null);
  };

  return (
    <section id="treinos" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Treinos & Planos</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="reveal reveal-delay-0">
          <TiltCard
            title="CrossFit"
            desc="Estamos abertos de segunda à sexta-feira das 6h às 21h. Sábados das 10h às 12h."
            cta={{ label: "Agendar", onClick: () => openBooking(CAL_EMBED) }}
          />
        </div>

        <div className="reveal reveal-delay-1">
          <TiltCard
            title="Aulas de Judô"
            desc="Toda quarta-feira às 21h."
            cta={{ label: "Agendar", onClick: () => openBooking(CAL_EMBED) }}
          />
        </div>

        <div className="reveal reveal-delay-2">
          <TiltCard
            title="Ginástica"
            desc="Quartas e sextas às 19h."
            cta={{ label: "Falar no WhatsApp", href: whats, external: true }}
          />
        </div>

        <div className="reveal reveal-delay-3">
          <TiltCard
            title="Levantamento de Peso Olímpico"
            desc="Todas as sextas às 19h."
            cta={{ label: "Saiba mais", href: "#contato" }}
          />
        </div>
      </div>

      {/* Modal com iframe do Google Calendar */}
      <BookingModal open={open} url={url} onClose={closeBooking} />
    </section>
  );
}

/* =================== APP =================== */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const whats = `https://wa.me/${CFG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    CFG.whatsMsg
  )}`;

  return (
    <main
      className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden pb-28 md:pb-24"
      style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
    >
      <MotionStyles />

      {/* ===== SPLASH: logo que sobe e some ===== */}
      {showSplash && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950 animate-slide-up-splash">
          <img
            src="/img/slogan.jpg"
            alt="Logo Madala CrossFit"
            className="h-40 md:h-48 object-contain"
          />
        </div>
      )}

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="max-w-[60vw] truncate text-base font-semibold md:max-w-none md:text-xl">
            CF • {CFG.nome}
          </span>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#treinos" className="hover:text-white">
              Treinos
            </a>
            <a href="#sobre" className="hover:text-white">
              Sobre
            </a>
            <a href="#contato" className="hover:text-white">
              Contato
            </a>
          </nav>

          <a
            href="#treinos"
            className="shrink-0 whitespace-nowrap rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 md:px-4 md:text-base"
          >
            Agendar
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        {/* BG imagem + gradiente */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.65), rgba(0,0,0,.65)),
                              url('${CFG.heroBg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--noise)" }}
        />

        {/* Slogan */}
        <div className="w-full flex justify-center mt-3 md:mt-4">
          <img
            src="/img/slogan.jpg"
            alt="Logo Madala CrossFit"
            className="w-[68vw] max-w-[380px] md:w-[42vw] md:max-w-[560px] lg:max-w-[640px] h-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 md:py-1">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
              DESEMPENHO • FORÇA • RESISTÊNCIA
            </h1>
          </div>

          {/* BARRA ROLANTE (telejornal) */}
          <div className="w-full overflow-hidden border-y border-red-600 bg-zinc-900 py-2 mt-5">
            <div className="marquee-track text-red-500 font-semibold text-sm md:text-base tracking-wider">
              {CFG.texto_teleprompt.repeat(2)}
            </div>
          </div>

          {/* 3 CARDS — carrossel no mobile, grid no desktop */}
          <div
            className="
              mt-10
              flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar
              md:grid md:grid-cols-3 md:gap-6 md:overflow-visible
            "
            aria-label="Galeria de cards: fotos, vídeo e mapa"
          >
            {/* Card 1 — IMAGEM */}
            <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-auto md:shrink md:snap-none">
              <img
                src="/img/mada_treinamento.jpg"
                alt="Treinamento Madala CrossFit"
                className="mx-auto h-[520px] w-auto rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[520px]"
                loading="lazy"
              />
            </figure>

            {/* Card 2 — VÍDEO */}
            <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-auto md:shrink md:snap-none">
              <video
                src="/videos/rotina_madala.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="mx-auto h-[580px] w-auto rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.75)] md:h-[580px]"
              />
            </figure>

            {/* Card 3 — MAPS */}
            <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-auto md:shrink md:snap-none">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.9844739509986!2d-46.62814792378698!3d-23.604889763194443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bb6f69f4ef7%3A0x14594a08a9df8bf5!2sMadala%20CF!5e0!3m2!1spt-BR!2sbr!4v1759288545144!5m2!1spt-BR!2sbr"
                className="mx-auto h-[520px] w-full rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Madala CF"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* BARRA DE VALORES */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <ul className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
            {[
              "Ajuste de carga",
              "Mobilidade",
              "Metcon",
              "Técnica de LPO",
              "Recuperação",
            ].map((t) => (
              <li
                key={t}
                className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PLANOS (cards com tilt) */}
      <PlansSection whats={whats} />

      {/* FOOTER */}
      <footer
        id="contato"
        className="fixed bottom-0 inset-x-0 z-30 border-t border-zinc-800 bg-zinc-950/85 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75 min-h-[64px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {CFG.nome}. {CFG.titulo}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whats}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              WhatsApp
            </a>
            <a
              href={CFG.mapsExt}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-700 px-4 py-2 font-semibold hover:bg-zinc-900"
            >
              Maps
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
