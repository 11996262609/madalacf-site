import React, { useEffect, useState, useRef } from "react";
import {
  Calendar,
  MessageCircle,
  Activity,
  Timer,
  Shield,
  BarChart3,
} from "lucide-react";

/* =================== TIPAGEM GLOBAL =================== */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    calendar?: any;
    GADS?: {
      ID: string;
      LABELS: Record<string, string>;
    };
  }
}

/* =================== CONFIG =================== */
const CFG = {
  nome: "MADALA CROSSFIT",
  titulo: "CrossFit & Judô & Ginástica & Competições & Workshop & Seminários ",
  whatsapp: "https://wa.me/5511977181677",
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

  /** ⬇️ novo */
  logo: "/img/logo_madala.gif",
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

/* =================== TIPOS =================== */
type Cta = { label: string; href?: string; external?: boolean; onClick?: () => void };
type PriceItem = { price: string; per?: string; note?: string; color?: string };

type TiltCardProps = {
  title: string;
  subtitle?: string;
  desc: string;
  cta?: Cta;
  ctas?: Cta[];
  badge?: string;
  price?: string;
  per?: string;
  priceNote?: string;
  priceColor?: string;
  prices?: PriceItem[];
  descNote?: string;
  /** novo: ícone principal do card (ex.: produto) */
  leadIcon?: React.ReactNode;
};

/* =================== CONVERSÕES (lendo do window.GADS) =================== */
const GID = window.GADS?.ID ?? "AW-17614133372";
const L = window.GADS?.LABELS ?? {
  WHATS:      "hm-BCO-A5K0bEPywic9B",
  BOOK_CF:    "ZnXFCOyA5K0bEPywic9B",
  BOOK_HYROX: "Rw93CIzm660bEPywic9B",
  BOOK_JUDO:  "l44JCI_m660bEPywic9B",
  BOOK_LPO:   "KZrNCJLm660bEPywic9B",
};

const SENDTO = {
  crossfit: `${GID}/${L.BOOK_CF}`,
  hyrox:    `${GID}/${L.BOOK_HYROX}`,
  judo:     `${GID}/${L.BOOK_JUDO}`,
  lpo:      `${GID}/${L.BOOK_LPO}`,
  whatsapp: `${GID}/${L.WHATS}`,
} as const;

type Product = "crossfit" | "hyrox" | "judo" | "lpo";

/** Dispara GA4 (opcional) + conversão Ads (opcional) e abre o link */
function openWithConversion(
  url: string,
  sendTo?: string,
  ga4EventName?: string,
  ga4Params?: Record<string, any>,
) {
  const go = () => window.open(url, "_blank", "noopener,noreferrer");
  let done = false;

  if (ga4EventName) {
    window.gtag?.("event", ga4EventName, {
      ...ga4Params,
      event_callback: () => { done = true; go(); },
    });
  }

  if (sendTo) {
    window.gtag?.("event", "conversion", {
      send_to: sendTo,
      event_callback: () => { done = true; go(); },
    });
  }

  setTimeout(() => { if (!done) go(); }, 400);
}

/* =================== BOTÃO PILL =================== */
function ActionButton({
  children, onClick, href, external, icon,
}: {
  children: React.ReactNode; onClick?: () => void; href?: string; external?: boolean; icon?: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-full bg-yellow-600 text-white px-5 py-2 " +
    "ring-1 ring-white/15 shadow-sm hover:bg-zinc-700 active:scale-[0.98] transition";
  if (onClick) return <button onClick={onClick} className={cls}>{icon}{children}</button>;
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className={cls}>
      {icon}{children}
    </a>
  );
}

/* =================== PRICE CARD / GROUP =================== */
function PriceCard({
  price, per = "/mês", note, color = "bg-zinc-900/80",
}: { price: string; per?: string; note?: string; color?: string }) {
  return (
    <aside
      className={`shrink-0
                  w-[6.5rem] sm:w-32 md:w-36 lg:w-40
                  ${color} text-white
                  rounded-2xl md:rounded-3xl overflow-hidden
                  ring-2 ring-inset ring-white/80
                  p-3 md:p-4 lg:p-5 text-center grid place-items-center`}
    >
      <div className="leading-tight">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold">{price}</div>
        <div className="text-[10px] sm:text-xs md:text-sm opacity-80">{per}</div>
        {note && <div className="mt-1 text-[10px] sm:text-xs md:text-sm opacity-70 whitespace-pre-line">{note}</div>}
      </div>
    </aside>
  );
}

function PriceGroup({ items }: { items: PriceItem[] }) {
  return (
    <div
      className="grid grid-cols-3 gap-2 sm:gap-3 place-items-center
                 w-full max-w-[360px] sm:max-w-none mx-auto"
    >
      {items.map((it, i) => (
        <PriceCard key={i} price={it.price} per={it.per} note={it.note} color={it.color} />
      ))}
    </div>
  );
}

/* =================== TILTCARD =================== */
function TiltCard({
  title, subtitle, desc, cta, ctas, badge,
  price, per, priceNote, priceColor, prices, descNote, leadIcon,
}: TiltCardProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  function onMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -10;
    const ry = ((x - rect.width / 2) / rect.width) * 10;
    setStyle({ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.02)` });
  }
  function onLeave() { setStyle({ transform: "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)" }); }

  const ctasToRender: Cta[] = ctas && ctas.length ? ctas : (cta ? [cta] : []);

  const isWhatsApp = (url?: string) =>
    !!url && /(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i.test(url || "");

  const getCTALabel = (c: Cta) => {
    if (c.label) return c.label;
    if (isWhatsApp(c.href)) return "Falar no WhatsApp";
    if (c.onClick) return "Agendar";
    if (c.href) return "Abrir link";
    return "Ação";
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className="group relative rounded-2xl md:rounded-3xl border border-zinc-500 bg-zinc-800 p-4 transition will-change-transform min-h-[220px]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{ background: "radial-gradient(600px circle at 50% 50%, rgba(255,255,255,.06), transparent 40%)" }}
      />

      <div className="md:min-h-[160px] flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6">
        <div className="flex-1 md:pr-[400px]">

          {badge && (
            <span className="mb-2 inline-block rounded-full bg-red-600 px-6.5 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          )}

          {/* Título com ícone do produto */}
          <div className="flex items-center gap-2 text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight">
            {leadIcon && (
              <span className="inline-flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-yellow-600/90 text-white ring-1 ring-white/20">
                {/* o ícone já vem no tamanho desejado (h-4 w-4 controla no caller) */}
                {leadIcon}
              </span>
            )}
            <span>{title}</span>
          </div>

          {subtitle && (
            <p className="mt-3 text-yellow-300 text-base md:text-xl leading-snug">
              {subtitle}
            </p>
          )}

          <p className="mt-2 text-sm md:text-base text-zinc-200 whitespace-pre-line leading-relaxed">
            {desc}
          </p>

          {descNote && (
            <p className="mt-3 text-yellow-300 text-xs md:text-sm leading-snug font-semibold">
              {descNote}
            </p>
          )}

          {(prices?.length ?? 0) > 0 ? (
            <div className="mt-5 md:mt-0 md:absolute md:right-2 md:top-6 md:z-10 w-full md:w-auto">
              <PriceGroup items={prices!} />
            </div>

            ) : price ? (
              <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-6 md:z-10">
                <div className="w-full flex justify-center md:block">
                  <div className="[&>aside]:w-[11rem] sm:[&>aside]:w-36 md:[&>aside]:w-40">
                    <PriceCard price={price} per={per} note={priceNote} color={priceColor} />
                  </div>
                </div>
              </div>
            ) : null}

          {/* CTAs com ícones automáticos */}
          {ctasToRender.length > 0 && (
            <div className="mt-9 flex flex-5 gap-5">
              {ctasToRender.map((c, i) => {
                const autoIcon = c.onClick
                  ? <Calendar className="h-4 w-4" />
                  : (isWhatsApp(c.href) ? <MessageCircle className="h-4 w-4" /> : undefined);

                return c.onClick ? (
                  <ActionButton key={`cta-btn-${i}`} onClick={c.onClick} icon={autoIcon}>
                    {getCTALabel(c)}
                  </ActionButton>
                ) : (
                  <ActionButton key={`cta-a-${i}`} href={c.href!} external={c.external} icon={autoIcon}>
                    {getCTALabel(c)}
                  </ActionButton>
                );
              })}
            </div>
          )}
        </div>
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
  const CAL_ginastica = "https://calendar.app.google/dQCavVwcSa3WCaNL6";
  const CAL_judo = "https://calendar.app.google/CKzDHTFrhPSh9kE87";
  const CAL_levantamento = "https://calendar.app.google/TLWvX7kwDsPLwFDg9";
  const CAL_EMBED = `${CAL_URL}&embed=true`;

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  function trackBooking(p: Product) {
    const gtag = (window as any).gtag;
    if (!gtag) return;
    gtag("event", "conversion", {
      send_to: SENDTO[p],
      value: 1,
      currency: "BRL",
    });
  }

  function onBook(p: Product, link: string) {
    trackBooking(p);
    setUrl(link);
    setOpen(true);
  }

  function onWhats(p: Product, link: string) {
    openWithConversion(link, SENDTO.whatsapp, "whatsapp_click", { product: p });
  }

  const closeBooking = () => { setOpen(false); setUrl(null); };

  return (
    <section id="treinos" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-xl md:text-4xl font-bold text-white">Treinos & Planos</h2>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">

        {/* CrossFit */}
        <div className="reveal reveal-delay-0">
          <TiltCard
            title="CrossFit"
            leadIcon={<Activity className="h-4 w-4" />}   // ícone do card
            subtitle="Todos os dias todos horários."
            desc={
              "• Movimentos funcionais com supervisão do coach.\n" +
              "• Progressão individual: adaptamos peso, volume e ritmo.\n" +
              "• Resultados medidos: carga, tempo, repetições e frequência."
            }
            descNote="Não aceitamos Gympass ou outros convênios"
            ctas={[
              { label: "Agendar aula teste", onClick: () => onBook("crossfit", CAL_EMBED) },
              { label: "Falar no WhatsApp", onClick: () => onWhats("crossfit", whats) },
            ]}
            prices={[
              { price: "R$ 399,99", per: "/mês", note: "Plano anual" },
              { price: "R$ 489,90", per: "/mês", note: "Semestral" },
              { price: "R$ 569,90", per: "/mês", note: "Trimestral" },
            ]}
          />
        </div>

        {/* Judô */}
        <div className="reveal reveal-delay-1">
          <TiltCard
            title="Aulas de Judô"
            leadIcon={<Shield className="h-4 w-4" />}
            subtitle="• Quarta-feira às 21h. Sábado às 10h."
            desc={
              "• Fundamentos: ukemi (quedas), kuzushi (desequilíbrio) e tsukuri/kake (entrada/projeção).\n" +
              "• Técnicas progressivas: projeções, imobilizações, estrangulamentos e chaves — conforme idade/nível.\n" +
              "• Cultura do tatame: respeito, disciplina, etiqueta e espírito esportivo."
            }
            descNote="Não aceitamos Gympass ou outros convênios"
            ctas={[
              { label: "Agendar aula teste", onClick: () => onBook("judo", CAL_judo) },
              { label: "Falar no WhatsApp", onClick: () => onWhats("judo", whats) },
            ]}
            price="R$ 200,00"
            per="/mês"
            priceNote="Mensal"
          />
        </div>

        {/* Ginástica / Hyrox */}
        <div className="reveal reveal-delay-2">
          <TiltCard
            title=" Hyrox "
            leadIcon={<Timer className="h-4 w-4" />}
            subtitle="Segundas e quartas as 20h"
            desc={
              "• Mobilidade e alongamento: amplitude segura para articulações.\n" +
              "• Postura e prevenção de lesões: técnica guiada e consciência corporal."
            }
            descNote="Não aceitamos Gympass ou outros convênios."
            ctas={[
              { label: "Agendar aula teste", onClick: () => onBook("hyrox", CAL_ginastica) },
              { label: "Falar no WhatsApp", onClick: () => onWhats("hyrox", whats) },
            ]}
            price="R$ 250,00"
            per="/mês"
            priceNote="Mensal"
          />
        </div>

        {/* LPO */}
        <div className="reveal reveal-delay-3">
          <TiltCard
            title="Levantamento de Peso Olímpico"
            leadIcon={<BarChart3 className="h-4 w-4" />}
            subtitle="Sextas às 19h."
            desc={
              "• Fundamentos técnicos: pegada, setup, barra próxima e trajetória eficiente.\n" +
              "• Levantes principais: snatch e clean & jerk com progressões seguras.\n" +
              "• Força e potência: pulls, front/back squat, jerk drives e variações."
            }
            descNote="Não aceitamos Gympass ou outros convênios"
            ctas={[
              { label: "Agendar aula teste", onClick: () => onBook("lpo", CAL_levantamento) },
              { label: "Falar no WhatsApp", onClick: () => onWhats("lpo", whats) },
            ]}
            price="R$ 200,00"
            per="/mês"
            priceNote="Mensal"
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
    const amount = Math.round(el.clientWidth * 0.85);
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
      className="relative min-h-screen bg-yellow-950 text-zinc-50 overflow-x-hidden pb-28 md:pb-24"
      style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
    >

      <MotionStyles />

      {/* ===== SPLASH ===== */}
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
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
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
            className="shrink-0 whitespace-nowrap rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500 md:px-4 md:text-base"
          >
            Agendar
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.80), rgba(0,0,0,.80)), url('${CFG.heroBg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.2)"
          }}
        />
        <div className="absolute inset-0 -z-10 md:hidden bg-zinc-950" />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--noise)" }}
        />

        <section className="relative">
          <div
            className="relative w-full mt-0 md:mt-6 mb-4 md:mb-8"
            style={{ height: "var(--heroHeight)" }}
          >
            <div
              className="
                  absolute inset-0 z-0
                  overflow-hidden rounded-none sm:rounded-[2rem]
                  ring-1 ring-white/10
                  shadow-[0_18px_60px_-20px_rgba(0,0,0,.75)]
                  bg-[#4B5320]
                "
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/videos/capa_fundo_site.mp4"
                onLoadedData={() => console.log('🎬 vídeo carregado')}
                onError={(e) => console.error('❌ erro no vídeo', e)}
                controls={false}
                disablePictureInPicture
                style={{ objectPosition: "50% 50%" }}
              >
                <source src="/videos/capa_fundo_site.mp4" type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-[#4B5320]/40 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            </div>

            <div
              className="
                  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  z-10 rounded-full overflow-hidden
                  ring-1 ring-white/15 ring-offset-2 ring-offset-zinc-950
                  shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)]
                  bg-zinc-950
                "
              style={{
                width: "var(--logoSize)",
                height: "var(--logoSize)",
              }}
            >
              <img
                src="/img/slogan.jpg"
                alt="Logo Madala CrossFit"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "50% 46%", transform: "scale(1.06)" }}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 md:py-1">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">
              DESEMPENHO • FORÇA • RESISTÊNCIA • TRANSFORMAÇÃO
            </h1>
          </div>

          <div className="
            w-screen
            mx-[calc(50%-50vw)]
            overflow-hidden border-y border-yellow-600 bg-zinc-900 py-2 mt-5
          ">
            <div className="marquee-track text-red-500 font-semibold text-sm md:text-base tracking-wider">
              {CFG.texto_teleprompt.repeat(4)}
            </div>
          </div>
        </div>

        {/* ===== Mídia ===== */}
        <section className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative mt-10">
            <div className="pointer-events-none md:hidden absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-zinc-950 to-transparent" />
            <div className="pointer-events-none md:hidden absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-zinc-950 to-transparent" />

            <button
              type="button"
              aria-label="Ver card anterior"
              onClick={() => scrollCarousel(-1)}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Ver próximo card"
              onClick={() => scrollCarousel(1)}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-zinc-900/70 p-2 ring-1 ring-white/20 backdrop-blur hover:bg-zinc-900/90 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>

            <div
              ref={carouselRef}
              className="
                flex gap-4 sm:gap-6 px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar
                md:grid md:grid-cols-3 md:gap-8 md:px-0 md:overflow-visible
              "
              aria-label="Galeria de cards: fotos, vídeo e mapa"
            >
              {/* VÍDEO */}
              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <div className="relative w-88 h-[580px] overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,.75)]">
                  <video
                    src="/videos/mada_treinamento.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </figure>

              {/* VÍDEO */}
              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <div className="relative w-88 h-[580px] overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,.75)]">
                  <video
                    src="/videos/rotina_madala.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </figure>

              {/* IMAGENS */}
              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <img
                  src="/img/madala_cf_1.jpg"
                  alt="Treinamento Madala CrossFit"
                  className="mx-auto h-[580px] w-88 rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[580px]"
                  loading="lazy"
                />
              </figure>

              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <img
                  src="/img/madala_cf_2.jpg"
                  alt="Treinamento Madala CrossFit"
                  className="mx-auto h-[580px] w-88 rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[580px]"
                  loading="lazy"
                />
              </figure>

              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <img
                  src="/img/madala_cf_3.jpg"
                  alt="Treinamento Madala CrossFit"
                  className="mx-auto h-[580px] w-auto rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[580px]"
                  loading="lazy"
                />
              </figure>

              <figure className="snap-center shrink-0 w-[88vw] sm:w-[70vw] md:w-[28rem] md:shrink md:snap-none">
                <img
                  src="/img/madala_cf_4.jpg"
                  alt="Treinamento Madala CrossFit"
                  className="mx-auto h-[580px] w-auto rounded-2xl object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)] md:h-[580px]"
                  loading="lazy"
                />
              </figure>

            </div>
          </div>
        </section>
      </section>

      {/* PLANOS */}
      <PlansSection whats={whats} />

      {/* MAPS (incorporado) */}
      <figure className="snap-center shrink-0 w-screen md:snap-none">
        <div className="mx-auto w-[92vw] sm:w-[86vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-[1100px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)]">
          <div className="relative aspect-[4/3] md:aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.9844739509986!2d-46.62814792378698!3d-23.604889763194443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bb6f69f4ef7%3A0x14594a08a9df8bf5!2sMadala%20CF!5e0!3m2!1spt-BR!2sbr!4v1759288545144!5m2!1spt-BR!2sbr"
              className="absolute inset-0 h-full w-full border-0 "
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da Madala CF"
            />
          </div>
        </div>
      </figure>

      {/* REDES SOCIAIS */}
      <section className="mx-auto max-w-6xl px-4">
        <h3 className="mt-12 text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Redes Sociais
        </h3>

        <div className="relative mt-4">
          <div className="pointer-events-none md:hidden absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-zinc-950 to-transparent" />
          <div className="pointer-events-none md:hidden absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-zinc-950 to-transparent" />

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
              className="rounded-md bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
              onClick={(e) => {
                e.preventDefault();
                openWithConversion(whats, SENDTO.whatsapp, "whatsapp_click", { origin: "footer" });
              }}
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </span>
            </a>
            <a
              href={CFG.mapsExt}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              Maps
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
