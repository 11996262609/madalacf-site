import React, { useEffect, useState, useRef } from "react";

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
      @keyframes splashInHoldOut {
        100%   { filter: blur(12px); opacity: 50; transform: translateY(0) }
        40%  { filter: blur(0);    opacity: 50; transform: translateY(0) }
        75%  { filter: blur(0);    opacity: 50; transform: translateY(0) }   /* segura visível */
        100% { filter: blur(0);    opacity: 50; transform: translateY(-1px) } /* sai suave */
      }
      .animate-splash-in-hold-out {
        animation: splashInHoldOut 3.2s ease-out forwards;
      }


      /* ===== esconder a barra de rolagem no carrossel (mobile) ===== */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

/* =================== CARD COM TILT 3D =================== */
type Cta = { label: string; href?: string; external?: boolean; onClick?: () => void };

type TiltCardProps = {
  title: string;
  desc: string;
  cta?: Cta;          // legado: 1 CTA
  ctas?: Cta[];       // novo: N CTAs
  badge?: string;
};

function TiltCard({ title, desc, cta, ctas, badge }: TiltCardProps) {
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
      transform: "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)",
    });
  }

  // Padroniza: se vier só "cta", transforma em array
  const ctasToRender: Cta[] = ctas && ctas.length ? ctas : (cta ? [cta] : []);

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className="
        group relative rounded-3xl border border-zinc-500 bg-zinc-800 p-4
        transition will-change-transform
        flex flex-col justify-between
        min-h-[220px]   /* <-- altura mínima igual pra todos */
      "
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 50%, rgba(255,255,255,.06), transparent 40%)",
        }}
      />

      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        <div className="font-semibold text-white">{title}</div>
        <p className="mt-1 text-sm text-zinc-300">{desc}</p>
      </div>

      {ctasToRender.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ctasToRender.map((c, i) =>
            c.onClick ? (
              <button
                key={`cta-btn-${i}`}
                onClick={c.onClick}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                {c.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </button>
            ) : (
              <a
                key={`cta-a-${i}`}
                href={c.href!}
                {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                {c.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </a>
            )
          )}
        </div>
      )}
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
      <h2 className="text-2xl md:text-5xl font-bold text-white">Treinos & Planos</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">
        <div className="reveal reveal-delay-0">
          <TiltCard
            title="CrossFit"
            desc="Estamos abertos de segunda à sexta-feira das 6h às 21h. Sábados das 10h às 12h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
          />
        </div>

        <div className="reveal reveal-delay-1">
          <TiltCard
            title="Aulas de Judô"
            desc="Toda quarta-feira às 21h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
          />
        </div>

        <div className="reveal reveal-delay-2">
          <TiltCard
            title="Ginástica"
            desc="Quartas e sextas às 19h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
          />
        </div>

        <div className="reveal reveal-delay-3">
          <TiltCard
            title="Levantamento de Peso Olímpico"
            desc="Todas as sextas às 19h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
              // Se quiser manter também um terceiro botão:
              // { label: "Saiba mais", href: "#contato" },
            ]}
          />
        </div>
      </div>

      {/* Modal com iframe do Google Calendar (inalterado) */}
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
const carouselRef = useRef<HTMLDivElement>(null);

    function scrollCarousel(dir: 1 | -1) {
      const el = carouselRef.current;
      if (!el) return;
      const amount = Math.round(el.clientWidth * 0.85); // ~85% da largura visível
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

  return (
    <main
      className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden pb-28 md:pb-24"
      style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
    >
      <MotionStyles />

      {/* ===== SPLASH: logo que sobe e some ===== */}
      {showSplash && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950 animate-splash-in-hold-out"
          onAnimationEnd={() => setShowSplash(false)}
          aria-hidden="true"
        >
          <div
            className="
              relative aspect-square
              w-[52vw] max-w-[320px]
              md:w-[34vw] md:max-w-[460px]
              lg:max-w-[520px]
              rounded-full overflow-hidden
              ring-1 ring-white/15 ring-offset-2 ring-offset-zinc-950
              shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)]
              bg-zinc-950
            "
          >
            <img
              src="/img/urso.gif"
              alt="Logo Madala CrossFit"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: '50% 46%',
                transform: 'scale(1.06)',
              }}
              decoding="async"
              fetchPriority="high"
            />
          </div>
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
          {/* Slogan — círculo centrado e ajustado */}
          <div className="w-full flex justify-center mt-6 md:mt-10">
            <div
              className="
                relative aspect-square
                w-[52vw] max-w-[320px]          /* ↓ reduzir tamanho no mobile */
                md:w-[34vw] md:max-w-[460px]    /* ↓ reduzir no desktop */
                lg:max-w-[520px]
                rounded-full overflow-hidden
                ring-1 ring-white/15 ring-offset-2 ring-offset-zinc-950
                shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)]
                bg-zinc-950
              "
            >
              <img
                src="/img/urso.gif"
                alt="Logo Madala CrossFit"
                className="absolute inset-0 h-full w-full object-cover"
                /* ajuste fino: centralizar e dar um leve zoom */
                style={{
                  objectPosition: '50% 46%',   // mexa 44–52% até ficar perfeito
                  transform: 'scale(1.06)',    // 1.00–1.12 conforme precisar
                }}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>


        <div className="mx-auto max-w-6xl px-4 py-12 md:py-1">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
              DESEMPENHO • FORÇA • RESISTÊNCIA • MUDANÇAS
            </h1>
          </div>

          {/* BARRA ROLANTE (telejornal) */}
          <div className="
            w-screen
            mx-[calc(50%-50vw)]   /* puxa para fora e centraliza, ignorando o padding do pai */
            overflow-hidden border-y border-red-600 bg-zinc-900 py-2 mt-5
          ">
            <div className="marquee-track text-red-500 font-semibold text-sm md:text-base tracking-wider">
              {CFG.texto_teleprompt.repeat(4)}
            </div>
          </div>
        </div>
        
        {/* 3 CARDS — carrossel no mobile, grid no desktop (com setas) */}
        <div className="relative mt-10">
          {/* Gradientes de borda (indicam que há mais conteúdo) */}
          <div className="pointer-events-none md:hidden absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-zinc-950 to-transparent" />
          <div className="pointer-events-none md:hidden absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-zinc-950 to-transparent" />

          {/* Setas (só mobile) */}
          <button
            type="button"
            aria-label="Ver card anterior"
            onClick={() => scrollCarousel(-1)}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <button
            type="button"
            aria-label="Ver próximo card"
            onClick={() => scrollCarousel(1)}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>

          {/* Carrossel / Grid */}
          <div
            ref={carouselRef}
            className="
              flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar
              md:grid md:grid-cols-3 md:gap-6 md:overflow-visible
            "
            aria-label="Galeria de cards: fotos, vídeo e mapa"
          >
          {/* Card 1 — IMAGEM */}
          <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-160 md:shrink md:snap-none">
            <img
              src="/img/mada_treinamento.jpg"
              alt="Treinamento Madala CrossFit"
              className="mx-auto h-[580px] w-auto rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[580px]"
              loading="lazy"
            />
          </figure>

          {/* Card 2 — VÍDEO (referência de tamanho) */}
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

          {/* Card 3 — MAPS (usa wrapper para manter mesma altura e raio) */}
          <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-115 md:shrink md:snap-none">
            <div className="mx-auto h-[580px] w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.9844739509986!2d-46.62814792378698!3d-23.604889763194443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bb6f69f4ef7%3A0x14594a08a9df8bf5!2sMadala%20CF!5e0!3m2!1spt-BR!2sbr!4v1759288545144!5m2!1spt-BR!2sbr"
                className="h-full w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Madala CF"
              />
            </div>
          </figure>
          </div>
        </div>

      </section>

      {/* PLANOS (cards com tilt) */}
      <PlansSection whats={whats} />




      {/* ===== Redes sociais — carrossel com imagens ===== */}
      <section className="mx-auto max-w-6xl px-4">
        {/* limite e centralização */}
        <h3 className="mt-12 text-3xl md:text-4xl font-extrabold text-white tracking-wide">
          Redes Sociais
        </h3>

        <div
          className="
            mt-4 -mx-2 px-2
            flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar
            md:mx-0 md:px-0
            md:grid md:overflow-visible
            md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]
            md:gap-4
            lg:[grid-template-columns:repeat(4,minmax(0,1fr))]  /* fixa 4 colunas em telas grandes */
          "
          aria-label="Redes sociais Madala"
        >
          {/* 1) Instagram Madala CF */}
          <a
            href="https://www.instagram.com/madalacf/"
            target="_blank"
            rel="noreferrer"
            className="snap-center shrink-0 w-[82vw] sm:w-[68vw] md:w-auto md:shrink md:snap-none px-2"
          >
            <div className="group mx-auto w-full h-[360px] rounded-2xl border border-zinc-500 bg-zinc-800 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] flex flex-col">
              <div className="flex-1 w-full overflow-hidden rounded-xl">
                <img
                  src="/img/madalacf.jpg"
                  alt="Instagram @madalacf"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Madala CF</div>
                  <p className="text-xs text-zinc-300">@madalacf</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500">
                  Abrir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </span>
              </div>
            </div>
          </a>

          {/* 2) Instagram Madala Performance */}
          <a
            href="https://www.instagram.com/madalaperformance/"
            target="_blank"
            rel="noreferrer"
            className="snap-center shrink-0 w-[82vw] sm:w-[68vw] md:w-auto md:shrink md:snap-none px-2"
          >
            <div className="group mx-auto w-full h-[360px] rounded-2xl border border-zinc-500 bg-zinc-800 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] flex flex-col">
              <div className="flex-1 w-full overflow-hidden rounded-xl">
                <img
                  src="/img/performance.jpg"
                  alt="Instagram @madalaperformance"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Madala Performance</div>
                  <p className="text-xs text-zinc-300">@madalaperformance</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500">
                  Abrir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </span>
              </div>
            </div>
          </a>

          {/* 3) Instagram Projeto Social */}
          <a
            href="https://www.instagram.com/projetosocialmadalaparatodos/"
            target="_blank"
            rel="noreferrer"
            className="snap-center shrink-0 w-[82vw] sm:w-[68vw] md:w-auto md:shrink md:snap-none px-2"
          >
            <div className="group mx-auto w-full h-[360px] rounded-2xl border border-zinc-500 bg-zinc-800 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] flex flex-col">
              <div className="flex-1 w-full overflow-hidden rounded-xl">
                <img
                  src="/img/projeto.jpg"
                  alt="Instagram @projetosocialmadalaparatodos"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Projeto Social Madala Para Todos</div>
                  <p className="text-xs text-zinc-300">@projetosocialmadalaparatodos</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500">
                  Abrir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </span>
              </div>
            </div>
          </a>

          {/* 4) Facebook Madala CF */}
          <a
            href="https://www.facebook.com/madalacf/?locale=pt_BR"
            target="_blank"
            rel="noreferrer"
            className="snap-center shrink-0 w-[82vw] sm:w-[68vw] md:w-auto md:shrink md:snap-none px-2"
          >
            <div className="group mx-auto w-full h-[360px] rounded-2xl border border-zinc-500 bg-zinc-800 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] flex flex-col">
              <div className="flex-1 w-full overflow-hidden rounded-xl">
                <img
                  src="/img/facebook.jpg"
                  alt="Facebook Madala CF"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Madala CF</div>
                  <p className="text-xs text-zinc-300">Página oficial no Facebook</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500">
                  Abrir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>

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
