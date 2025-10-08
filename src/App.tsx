import React, { useEffect, useState, useRef } from "react"

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
      @keyframes floatY { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      .reveal{animation:fadeUp .6s ease forwards;opacity:0}
      .reveal-delay-0{animation-delay:.15s}.reveal-delay-1{animation-delay:.35s}.reveal-delay-2{animation-delay:.55s}.reveal-delay-3{animation-delay:.75s}
      @keyframes marqueeX { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
      .marquee-track{display:inline-block;white-space:nowrap;min-width:100%;animation:marqueeX 20s linear infinite}
      @keyframes splashInHoldOut { 0%{} 40%{} 75%{} 100%{filter:blur(0);opacity:50;transform:translateY(-1px)} }
      .animate-splash-in-hold-out{animation:splashInHoldOut 3.2s ease-out forwards}
      .no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
    `}</style>
  );
}

/* =================== CARD COM TILT 3D =================== */
type Cta = { label: string; href?: string; external?: boolean; onClick?: () => void };

/* tipos p/ preços */
type PriceItem = { price: string; per?: string; note?: string; color?: string };

type TiltCardProps = {
  title: string;
  desc: string;
  cta?: Cta;
  ctas?: Cta[];
  badge?: string;
  /* único preço (compatível) */
  price?: string;
  per?: string;
  priceNote?: string;
  priceColor?: string;
  /* vários preços (CrossFit) */
  prices?: PriceItem[];
};

/* ===== Botão pill ===== */
import { Calendar } from "lucide-react";
function ActionButton({
  children, onClick, href, external, icon = <Calendar className="h-4 w-4" />,
}: {
  children: React.ReactNode; onClick?: () => void; href?: string; external?: boolean; icon?: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-full bg-zinc-800/90 text-white px-5 py-2 " +
    "ring-1 ring-white/15 shadow-sm hover:bg-zinc-700 active:scale-[0.98] transition";
  if (onClick) return <button onClick={onClick} className={cls}>{icon}{children}</button>;
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className={cls}>
      {icon}{children}
    </a>
  );
}

/* ===== PriceCard ===== */
function PriceCard({
  price, per = "/mês", note, color = "bg-zinc-900/80",
}: { price: string; per?: string; note?: string; color?: string }) {
  return (
    <aside
      className={`shrink-0 w-36 md:w-50 ${color} text-white rounded-4xl ring-3 ring-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)]
                  p-4 md:p-5 text-center grid place-items-center`}
    >
      <div className="leading-tight">
        <div className="text-3x3 md:text-3x3 font-extrabold">{price}</div>
        <div className="text-xs md:text-sm opacity-80">{per}</div>
        {note && <div className="mt-1 text-xs md:text-sm opacity-70">{note}</div>}
      </div>
    </aside>
  );
}

/* ===== PriceGroup: SEMPRE VERTICAL ===== */
function PriceGroup({ items }: { items: PriceItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 md:w-full">
      {items.map((it, i) => (
        <PriceCard key={i} price={it.price} per={it.per} note={it.note} color={it.color} />
      ))}
    </div>
  );
}

function TiltCard({
  title, desc, cta, ctas, badge,
  price, per, priceNote, priceColor,
  prices,
}: TiltCardProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  function onMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -10;
    const ry = ((x - rect.width / 2) / rect.width) * 10;
    setStyle({ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.02)` });
  }
  function onLeave() { setStyle({ transform: "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)" }); }

  const ctasToRender: Cta[] = ctas && ctas.length ? ctas : (cta ? [cta] : []);

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className="group relative rounded-3xl border border-zinc-500 bg-zinc-800 p-4 transition will-change-transform min-h-[220px]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{ background: "radial-gradient(600px circle at 50% 50%, rgba(255,255,255,.06), transparent 40%)" }}
      />

      {/* conteúdo à esquerda e preços à direita */}
      <div className="md:min-h-[160px] flex flex-col md:flex-row md:items-stretch md:justify-between gap-4 md:gap-6">
        <div className="flex-1">
          {badge && (
            <span className="mb-2 inline-block rounded-full bg-red-600 px-6.5 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
          <div className="font-semibold text-white">{title}</div>
          <p className="mt-1 text-sm text-zinc-300">{desc}</p>

          {ctasToRender.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {ctasToRender.map((c, i) =>
                c.onClick ? (
                  <ActionButton key={`cta-btn-${i}`} onClick={c.onClick}>Agendar</ActionButton>
                ) : (
                  <ActionButton key={`cta-a-${i}`} href={c.href!} external={c.external}>{c.label}</ActionButton>
                )
              )}
            </div>
          )}
        </div>

        {/* preços */}
        {(prices?.length ?? 0) > 0 ? (
          <div className="md:ml-6 md:self-start">
            <PriceGroup items={prices!} />
          </div>
        ) : price ? (
          <div className="md:ml-6 md:self-start">
            <PriceCard price={price} per={per} note={priceNote} color={priceColor} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =================== MODAL DE AGENDAMENTO =================== */
function BookingModal({
  open, url, onClose,
}: { open: boolean; url: string | null; onClose: () => void }) {
  if (!open || !url) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl">
        <button onClick={onClose} className="absolute -top-4 -right-4 rounded-full bg-zinc-900 px-2 py-2 text-white shadow ring-1 ring-white/40">
          Fechar
        </button>
        <iframe src={url} title="Agendamento" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[70vh] w-full rounded-3xl bg-white" />
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

  const openBooking = (u: string) => { setUrl(u); setOpen(true); };
  const closeBooking = () => { setOpen(false); setUrl(null); };

  return (
    <section id="treinos" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-5xl font-bold text-white">Treinos & Planos</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">

        {/* CrossFit — 3 cards de preço (vertical) */}
        <div className="reveal reveal-delay-0">
          <TiltCard
            title="CrossFit"
            desc="Estamos abertos de segunda à sexta-feira das 6h às 21h. Sábados das 10h às 12h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
            prices={[
              { price: "R$ 399,99", per: "/mês", note: "Plano anual" },
              { price: "R$ 489,90", per: "/mês", note: "Semestral" },
              { price: "R$ 569,90", per: "/mês", note: "Trimestral" },
            ]}
          />
        </div>

        {/* Demais — Judô */}
        <div className="reveal reveal-delay-1">
          <TiltCard
            title="Aulas de Judô"
            desc="Toda quarta-feira às 21h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
            price="R$ 200,00"
            per="/mês"
            priceNote="Mensal"
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
            price="R$ 200,00"
            per="/mês"
          />
        </div>

        <div className="reveal reveal-delay-3">
          <TiltCard
            title="Levantamento de Peso Olímpico"
            desc="Todas as sextas às 19h."
            ctas={[
              { label: "Agendar", onClick: () => openBooking(CAL_EMBED) },
              { label: "Falar no WhatsApp", href: whats, external: true },
            ]}
            price="R$ 200,00"
            per="/mês"
          />
        </div>

      </div>

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

const socialCarouselRef = useRef<HTMLDivElement>(null);
function scrollSocial(dir: 1 | -1) {
  const el = socialCarouselRef.current;
  if (!el) return;
  const amount = Math.round(el.clientWidth * 0.85);
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
              src="/img/víde_logo_nova.gif"
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
        <div className="w-full flex justify-center mt-50 md:mt-1 mb-4 md:mb-5 px-4">
          <div
            className="relative"
            style={{
              ["--logoSize" as any]: "clamp(400px, 34vw, 520px)",
              width: "var(--logoSize)",
              height: "var(--logoSize)",
            }}
          >
              {/* BACK CARD: full-width, altura = logo */}
              <div
                className="
                  absolute left-1/2 -translate-x-1/2 z-0
                  w-[100vw]
                  overflow-hidden rounded-[2rem]
                  ring-1 ring-white/10
                  shadow-[0_18px_60px_-20px_rgba(0,0,0,.75)]
                  bg-[#4B5320]
                "
                style={{ height: "var(--logoSize)" }}
>
            {/* VÍDEO: cobre 100% do card (sem letterbox) */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/img/poster_logo.jpg"          // (opcional) mostra algo antes do vídeo carregar
              onLoadedData={() => console.log("🎬 vídeo carregado")}
              onError={(e) => console.error("❌ erro no vídeo", e)}
              controls={false}
              disablePictureInPicture
              style={{ objectPosition: "50% 50%" }}  // ajuste fino do foco
            >
              <source src="/videos/capa_fundo_site.webm" type="video/webm" />
              <source src="/videos/capa_fundo_site.mp4"  type="video/mp4"  />
            </video>

            {/* tinta verde (opcional) */}
            <div className="absolute inset-0 bg-[#4B5320]/40 mix-blend-multiply pointer-events-none" />
            {/* gradiente sutil (opcional) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </div>





            {/* FRONT CARD: sua logo, acima do vídeo */}
            <div
              className="
                relative z-10                               /* 👈 garante que a logo fica na frente */
                rounded-full overflow-hidden
                ring-1 ring-white/15 ring-offset-2 ring-offset-zinc-950
                shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)]
                bg-zinc-950 h-full w-full
              "
            >
              <img
                src="/img/logo_novo_urso.jpg"
                alt="Logo Madala CrossFit"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "50% 46%", transform: "scale(1.06)" }}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>


        <div className="mx-auto max-w-6xl px-4 py-12 md:py-1">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
              DESEMPENHO • FORÇA • RESISTÊNCIA • TRANSFORMAÇÃO
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
          <h3 className="mt-12 text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            Redes Sociais
          </h3>

          <div className="relative mt-4">
            {/* Gradientes nas bordas (só mobile) */}
            <div className="pointer-events-none md:hidden absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-zinc-950 to-transparent" />
            <div className="pointer-events-none md:hidden absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-zinc-950 to-transparent" />

            {/* Setas (só mobile) */}
            <button
              type="button"
              aria-label="Ver card anterior"
              onClick={() => scrollSocial(-1)}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            <button
              type="button"
              aria-label="Ver próximo card"
              onClick={() => scrollSocial(1)}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </button>

            {/* Carrossel / Grid */}
            <div
              ref={socialCarouselRef}
              className="
                mt-4 -mx-2 px-2
                flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar
                md:mx-0 md:px-0
                md:grid md:overflow-visible
                md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]
                md:gap-4
                lg:[grid-template-columns:repeat(4,minmax(0,1fr))]
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
          </div>
        </section>

 
      <section className="mx-auto max-w-6xl px-4 pb-28 md:pb-32">
      {/* ...seu conteúdo... */}
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
