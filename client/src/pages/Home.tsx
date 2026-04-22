import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, CSSProperties, MouseEvent as ReactMouseEvent, MutableRefObject, ReactNode } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  ChevronDown,
  Download,
  Github,
  GraduationCap,
  LineChart,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldAlert,
  Sigma,
  TerminalSquare,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContact, useMarketData } from "@/hooks/use-portfolio";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  base: number;
  spread: number;
  formatter: (value: number) => string;
  colorClass: string;
  delay: number;
  style: CSSProperties;
};

type Ticker = {
  symbol: string;
  name: string;
  price: number;
  decimals: number;
  change: number;
  pct: number;
};

type MarketQuote = {
  symbol: string;
  name: string;
  price: number | string;
  change: number | string;
  changePercent: number | string;
  category: string;
  decimals?: number;
  source?: string;
  marketTime?: number | null;
  exchangeTimezoneName?: string | null;
  timezone?: string | null;
};

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
};

const HERO_ROLES = [
  "Quantitative Analyst",
  "Derivatives Pricer",
  "Risk Engineer",
  "Algo Trader",
  "Volatility Modeler",
];

const MATRIX_SYMBOLS = [
  "0.42",
  "−2.1%",
  "+",
  "−",
  "Δ",
  "Γ",
  "σ",
  "β",
  "ρ",
  "θ",
  "∑",
  "Φ",
  "3.14",
  "√2",
  "N(d₁)",
  "0.87",
  "2.41",
  "ln",
  "VaR",
  "IV",
  "$",
  "%",
  "≈",
  "∂",
  "SPX",
  "e^r",
];

const HERO_SKILLS = ["Python", "Black-Scholes", "GARCH", "Monte Carlo", "SQL", "VaR/CVaR", "Fixed Income", "NumPy"];

const EXPERIENCE = [
  {
    title: "Operations and Finance Manager",
    organization: "Mahalaxmi Enterprises",
    date: "Nov 2023 - Aug 2024",
    location: "Thane, India",
    details: [
      "Improved liquidity forecasting accuracy by 10% through advanced statistical modeling.",
      "Identified and resolved recurring error patterns in financial reporting.",
      "Streamlined operational workflows reducing processing time by 15%.",
    ],
  },
  {
    title: "Investment Banking Intern",
    organization: "StartupLanes",
    date: "May 2023 - Nov 2023",
    location: "Goa, India",
    details: [
      "Conducted rigorous financial modeling and valuation for tech startups.",
      "Assisted in drafting pitch decks and investment memorandums for seed-stage funding.",
      "Analyzed market trends and competitive landscapes.",
    ],
  },
];

const EDUCATION = [
  {
    title: "Master of Quantitative Finance",
    organization: "Rady School of Management, UCSD",
    date: "Expected Dec 2025",
    location: "San Diego, CA",
    details: [
      "Derivatives & Structured Products",
      "Advanced Risk Management",
      "Fixed Income Markets",
      "Financial Econometrics & Time Series",
    ],
  },
  {
    title: "Bachelor of Commerce",
    organization: "KJ Somaiya College of Science and Commerce",
    date: "Apr 2022",
    location: "Mumbai, India",
    details: ["Financial Accounting", "Business Economics", "Corporate Finance"],
  },
];

const PROJECTS = [
  {
    title: "Real-Time Equity Options Volatility Surface",
    date: "Sep 2025",
    tags: ["Python", "Data Analysis", "Volatility Modeling"],
    description:
      "Engineered a robust system for real-time calibration and monitoring of equity options volatility surfaces. Implemented numerical methods for smoothing and interpolation.",
    icon: PulsePathIcon,
  },
  {
    title: "Market Making & Execution Simulation",
    date: "Nov 2025",
    tags: ["Python", "Simulation", "Market Microstructure"],
    description:
      "Developed a limit order book simulator to backtest market making strategies. Incorporated latency models and queue position estimation to optimize execution algorithms.",
    icon: MarketPathIcon,
  },
  {
    title: "Derivatives Pricing & Sensitivity Analysis",
    date: "Dec 2025",
    tags: ["Python", "SQL", "Risk Management"],
    description:
      "Built a comprehensive derivatives pricing engine using Monte Carlo simulations and finite difference methods. Automated daily Greeks calculation and risk exposure reporting.",
    icon: BracketPathIcon,
  },
];

const CORE_EXPERTISE = [
  "Derivatives & Structured Products",
  "Risk Management",
  "Volatility Surface Modeling",
  "Algorithmic Trading",
  "Financial Econometrics",
  "Python & SQL",
  "Market Microstructure",
  "Fixed Income",
];

const MARKET_ORDER = ["SPX", "NDX", "RUT", "VIX", "NVDA", "AAPL", "TSLA", "MSFT", "GC=F", "BTC-USD", "^TNX", "CL=F"] as const;
const TICKER_DECIMALS: Record<string, number> = {
  SPX: 2,
  NDX: 2,
  RUT: 2,
  VIX: 2,
  NVDA: 2,
  AAPL: 2,
  TSLA: 2,
  MSFT: 2,
  "GC=F": 2,
  "BTC-USD": 0,
  "^TNX": 3,
  "CL=F": 2,
};

const EASTERN_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const EASTERN_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const CHART_SYMBOLS = ["SPX", "NDX", "RTY", "VIX"] as const;

const CHART_BASES: Record<(typeof CHART_SYMBOLS)[number], number> = {
  SPX: 5123,
  NDX: 17840,
  RTY: 2045,
  VIX: 14.3,
};

const CHART_LENGTH = 60;
const CHART_WIDTH = 900;
const CHART_HEIGHT = 160;
const LABEL_SPACE = 40;
const CANDLE_WIDTH = 10;
const CANDLE_GAP = 5;

const contactSchema = z.object({
  name: z.string().min(1, "Name / Organization is required"),
  email: z.string().email("Valid email address required"),
  message: z.string(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function getMarketClock(now = new Date()) {
  const parts = Object.fromEntries(
    EASTERN_PARTS_FORMATTER.formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const weekday = parts.weekday ?? "Mon";
  const hour = Number(parts.hour ?? "0");
  const minute = Number(parts.minute ?? "0");
  const currentMinutes = hour * 60 + minute;
  const isWeekday = weekday !== "Sat" && weekday !== "Sun";
  const isOpen = isWeekday && currentMinutes >= 9 * 60 + 30 && currentMinutes < 16 * 60;

  return {
    time: EASTERN_TIME_FORMATTER.format(now),
    isOpen,
    zoneLabel: "ET",
  };
}

function normalizeTickers(marketData: MarketQuote[] | undefined): Ticker[] {
  if (!marketData?.length) return [];

  const order = new Map<string, number>(MARKET_ORDER.map((symbol, index) => [symbol, index]));

  return [...marketData]
    .sort((left, right) => (order.get(left.symbol) ?? 999) - (order.get(right.symbol) ?? 999))
    .map((quote) => ({
      symbol: quote.symbol,
      name: quote.name,
      price: toNumber(quote.price),
      decimals: quote.decimals ?? TICKER_DECIMALS[quote.symbol] ?? 2,
      change: toNumber(quote.change),
      pct: toNumber(quote.changePercent),
    }));
}

function PulsePathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function MarketPathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9l-5-5-5 5-5-5" />
    </svg>
  );
}

function BracketPathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-primary">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function erf(value: number) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const t = 1 / (1 + p * abs);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-abs * abs);

  return sign * y;
}

function normalCdf(value: number) {
  return 0.5 * (1 + erf(value / Math.sqrt(2)));
}

function normalPdf(value: number) {
  return Math.exp(-0.5 * value * value) / Math.sqrt(2 * Math.PI);
}

function blackScholes(spot: number, strike: number, time: number, rate: number, vol: number) {
  if (spot <= 0 || strike <= 0 || time <= 0 || rate <= 0 || vol <= 0) {
    return null;
  }

  const d1 = (Math.log(spot / strike) + (rate + 0.5 * vol ** 2) * time) / (vol * Math.sqrt(time));
  const d2 = d1 - vol * Math.sqrt(time);
  const callPrice = spot * normalCdf(d1) - strike * Math.exp(-rate * time) * normalCdf(d2);
  const putPrice = strike * Math.exp(-rate * time) * normalCdf(-d2) - spot * normalCdf(-d1);
  const deltaCall = normalCdf(d1);
  const deltaPut = deltaCall - 1;
  const gamma = normalPdf(d1) / (spot * vol * Math.sqrt(time));
  const thetaCall =
    (-(spot * normalPdf(d1) * vol) / (2 * Math.sqrt(time)) - rate * strike * Math.exp(-rate * time) * normalCdf(d2)) / 365;
  const thetaPut =
    (-(spot * normalPdf(d1) * vol) / (2 * Math.sqrt(time)) + rate * strike * Math.exp(-rate * time) * normalCdf(-d2)) /
    365;
  const vega = (spot * normalPdf(d1) * Math.sqrt(time)) / 100;
  const rhoCall = (strike * time * Math.exp(-rate * time) * normalCdf(d2)) / 100;
  const rhoPut = (-strike * time * Math.exp(-rate * time) * normalCdf(-d2)) / 100;

  return {
    callPrice,
    putPrice,
    deltaCall,
    deltaPut,
    gamma,
    thetaCall,
    thetaPut,
    vega,
    rhoCall,
    rhoPut,
    d1,
    d2,
  };
}

function formatMetric(value: number, decimals = 4) {
  return value.toFixed(decimals);
}

function generateCandle(lastClose: number): Candle {
  const drift = (Math.random() - 0.48) * lastClose * 0.008;
  const open = lastClose;
  const close = Math.max(open + drift, 0.01);
  const high = Math.max(open, close) + Math.random() * Math.abs(drift) * 0.8;
  const low = Math.min(open, close) - Math.random() * Math.abs(drift) * 0.8;
  const volume = 1000 + Math.random() * 9000;
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return { open, high, low, close, volume, time };
}

function seedCandles(base: number, count: number) {
  const candles: Candle[] = [];
  let last = base;

  for (let index = 0; index < count; index += 1) {
    const candle = generateCandle(last);
    candles.push(candle);
    last = candle.close;
  }

  return candles;
}

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const columns = Math.floor(canvas.width / 48);
    const glyphs = Array.from({ length: columns }, (_, index) => ({
      x: index * 48 + Math.random() * 20,
      y: Math.random() * -canvas.height,
      speed: 0.3 + Math.random() * 0.5,
      symbol: MATRIX_SYMBOLS[Math.floor(Math.random() * MATRIX_SYMBOLS.length)],
      alpha: 0.04 + Math.random() * 0.08,
      size: 10 + Math.random() * 4,
    }));

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const glyph of glyphs) {
        context.fillStyle = `rgba(0,255,136,${glyph.alpha})`;
        context.font = `${glyph.size}px "JetBrains Mono", monospace`;
        context.fillText(glyph.symbol, glyph.x, glyph.y);
        glyph.y += glyph.speed;

        if (glyph.y > canvas.height + 30) {
          glyph.y = -30;
          glyph.symbol = MATRIX_SYMBOLS[Math.floor(Math.random() * MATRIX_SYMBOLS.length)];
        }
      }

      frameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-100" />;
}

function ParticleField({ mouseX, mouseY }: { mouseX: MutableRefObject<number>; mouseY: MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      return {
        x,
        y,
        ox: x,
        oy: y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.35 + 0.1,
      };
    });

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const x = mouseX.current * canvas.width;
      const y = mouseY.current * canvas.height;

      for (const particle of particles) {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          const force = (110 - distance) / 110;
          particle.vx += (dx / Math.max(distance, 1)) * force * 1.1;
          particle.vy += (dy / Math.max(distance, 1)) * force * 1.1;
        }

        particle.vx += (particle.ox - particle.x) * 0.012;
        particle.vy += (particle.oy - particle.y) * 0.012;
        particle.vx *= 0.91;
        particle.vy *= 0.91;
        particle.x += particle.vx;
        particle.y += particle.vy;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(0,255,136,${particle.a})`;
        context.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < 100) {
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.strokeStyle = `rgba(0,255,136,${0.07 * (1 - distance / 100)})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      }

      frameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [mouseX, mouseY]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function FloatingMetricCard({ icon: Icon, label, base, spread, formatter, colorClass, delay, style }: MetricCardProps) {
  const pointsCount = 14;
  const [value, setValue] = useState(base);
  const [series, setSeries] = useState(Array(pointsCount).fill(base));

  useEffect(() => {
    const timeout = window.setInterval(() => {
      const next = +(base + (Math.random() - 0.5) * spread * 2).toFixed(2);
      setValue(next);
      setSeries((current) => [...current.slice(1), next]);
    }, 1600 + Math.random() * 800);

    return () => window.clearInterval(timeout);
  }, [base, spread]);

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 0.01;
  const points = series.map((point, index) => `${(index / (pointsCount - 1)) * 58 + 1},${17 - ((point - min) / range) * 13}`).join(" ");
  const positive = series[series.length - 1] >= series[series.length - 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="absolute z-20 hidden w-[148px] cursor-default flex-col gap-1.5 rounded-2xl border border-white/6 bg-[#040c18]/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] xl:flex"
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-white/4 p-1.5">
          <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        </div>
        <span className={`font-mono text-[8px] ${positive ? "text-emerald-400" : "text-red-400"}`}>{positive ? "▲" : "▼"}</span>
      </div>

      <div>
        <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/50">{label}</p>
        <motion.p
          key={value}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className={`mt-0.5 font-mono text-xl font-bold leading-none ${colorClass}`}
        >
          {formatter(value)}
        </motion.p>
      </div>

      <svg viewBox="0 0 60 20" className="h-[18px] w-full" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" className={colorClass} opacity="0.55" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function AnimatedName() {
  const animateLetters = (value: string, className: string, delay: number) =>
    value.split("").map((letter, index) => (
      <motion.span
        key={`${value}-${index}`}
        initial={{ opacity: 0, y: 60, rotateX: -90, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
        transition={{ delay: delay + index * 0.055, duration: 0.6, type: "spring", stiffness: 120 }}
        className={`inline-block ${className}`}
        style={{ transformOrigin: "bottom center" }}
      >
        {letter}
      </motion.span>
    ));

  return (
    <div className="mb-2 leading-none" style={{ perspective: 600 }}>
      <h1 className="select-none text-6xl font-black tracking-tight sm:text-7xl md:text-[88px]" style={{ textShadow: "0 0 80px rgba(0,255,136,0.18)" }}>
        {animateLetters("DHIREN", "text-white", 0.35)} {animateLetters("RAWAL", "text-primary", 0.65)}
      </h1>
    </div>
  );
}

function TimelineSection({
  title,
  icon,
  items,
  education = false,
}: {
  title: string;
  icon: ReactNode;
  items: typeof EXPERIENCE | typeof EDUCATION;
  education?: boolean;
}) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent md:before:mx-auto md:before:translate-x-0">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: education ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
          >
            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_10px_hsla(154,100%,50%,0.3)] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <div className="h-3 w-3 rounded-full bg-primary" />
            </div>
            <div className="glass-panel ml-4 w-[calc(100%-4rem)] rounded-xl p-6 transition-colors hover:border-primary/50 md:ml-0 md:w-[calc(50%-2.5rem)]">
              <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
              <p className="mb-3 font-mono text-sm text-primary">{item.organization}</p>
              <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {item.date}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {item.location}
                </div>
              </div>

              {education ? (
                <ul className="flex flex-wrap gap-2">
                  {item.details.map((detail) => (
                    <li key={detail} className="rounded border border-white/5 bg-secondary/80 px-2 py-1 text-xs text-muted-foreground">
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 text-primary">▹</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GreekCard({
  label,
  callValue,
  putValue,
  decimals = 4,
  description,
}: {
  label: string;
  callValue: number;
  putValue?: number;
  decimals?: number;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors duration-300 hover:border-primary/30">
      <span className="font-mono text-xs uppercase tracking-widest text-primary">{label}</span>
      <div className="flex gap-3">
        <div>
          <div className="mb-0.5 font-mono text-[10px] text-muted-foreground">CALL</div>
          <div className={`font-mono text-base font-bold ${callValue >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatMetric(callValue, decimals)}</div>
        </div>
        {putValue !== undefined ? (
          <div>
            <div className="mb-0.5 font-mono text-[10px] text-muted-foreground">PUT</div>
            <div className={`font-mono text-base font-bold ${putValue >= 0 ? "text-emerald-400" : "text-red-400"}`}>{formatMetric(putValue, decimals)}</div>
          </div>
        ) : null}
      </div>
      <p className="font-mono text-[10px] leading-tight text-muted-foreground/70">{description}</p>
    </div>
  );
}

function renderCandles(candles: Candle[], activeIndex: number | null) {
  if (!candles.length) return null;

  const values = candles.flatMap((candle) => [candle.high, candle.low]);
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const maxVolume = Math.max(...candles.map((candle) => candle.volume));
  const mapY = (value: number) => CHART_HEIGHT - ((value - min) / range) * (CHART_HEIGHT - 8) - 4;
  const mapVolume = (value: number) => (value / maxVolume) * LABEL_SPACE;
  const totalWidth = candles.length * (CANDLE_WIDTH + CANDLE_GAP);
  const startOffset = Math.max(0, totalWidth - CHART_WIDTH);
  const movingAveragePoints: string[] = [];

  for (let index = 0; index < candles.length; index += 1) {
    if (index < 19) continue;

    const average = candles.slice(index - 19, index + 1).reduce((sum, candle) => sum + candle.close, 0) / 20;
    const x = index * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH / 2 - startOffset;
    movingAveragePoints.push(`${x},${mapY(average)}`);
  }

  const latest = candles[candles.length - 1];
  const latestY = mapY(latest.close);

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + LABEL_SPACE + 8}`} className="w-full" style={{ height: CHART_HEIGHT + LABEL_SPACE + 8 }}>
      {[0.2, 0.4, 0.6, 0.8].map((grid) => (
        <line
          key={grid}
          x1={0}
          y1={CHART_HEIGHT * (1 - grid)}
          x2={CHART_WIDTH}
          y2={CHART_HEIGHT * (1 - grid)}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      ))}

      {movingAveragePoints.length > 1 ? (
        <polyline points={movingAveragePoints.join(" ")} fill="none" stroke="rgba(251,191,36,0.6)" strokeWidth={1.2} strokeLinejoin="round" />
      ) : null}

      {candles.map((candle, index) => {
        const x = index * (CANDLE_WIDTH + CANDLE_GAP) - startOffset;
        if (x + CANDLE_WIDTH < 0 || x > CHART_WIDTH) return null;

        const positive = candle.close >= candle.open;
        const color = positive ? "#22c55e" : "#ef4444";
        const openY = mapY(candle.open);
        const closeY = mapY(candle.close);
        const top = mapY(Math.max(candle.open, candle.close));
        const bottom = mapY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(bottom - top, 1);
        const highlighted = activeIndex === index;

        return (
          <g key={`${candle.time}-${index}`}>
            <line x1={x + CANDLE_WIDTH / 2} y1={mapY(candle.high)} x2={x + CANDLE_WIDTH / 2} y2={mapY(candle.low)} stroke={color} strokeWidth={1} opacity={highlighted ? 1 : 0.7} />
            <rect x={x} y={top} width={CANDLE_WIDTH} height={bodyHeight} fill={positive ? color : "transparent"} stroke={color} strokeWidth={highlighted ? 1.5 : 1} opacity={highlighted ? 1 : 0.85} />
            <rect x={x} y={CHART_HEIGHT + 8 + (LABEL_SPACE - mapVolume(candle.volume))} width={CANDLE_WIDTH} height={mapVolume(candle.volume)} fill={color} opacity={0.4} />
          </g>
        );
      })}

      <line x1={0} y1={latestY} x2={CHART_WIDTH} y2={latestY} stroke="rgba(34,197,94,0.35)" strokeWidth={1} strokeDasharray="4 3" />
      <rect x={CHART_WIDTH - 72} y={latestY - 9} width={72} height={18} rx={3} fill="rgba(34,197,94,0.15)" />
      <text x={CHART_WIDTH - 4} y={latestY + 4} textAnchor="end" fontSize={9} fill="#22c55e" fontFamily="monospace">
        {latest.close.toFixed(2)}
      </text>
    </svg>
  );
}

function TickerItem({ ticker }: { ticker: Ticker }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const timeout = window.setTimeout(() => setFlash(false), 260);
    return () => window.clearTimeout(timeout);
  }, [ticker.price]);

  const positive = ticker.pct >= 0;

  return (
    <div className="group flex shrink-0 cursor-default select-none items-center gap-3 border-r border-white/5 px-5">
      <div className="flex flex-col items-start">
        <span className="font-mono text-[10px] font-bold leading-none text-white/90">{ticker.symbol}</span>
        <span className="mt-0.5 max-w-[60px] truncate font-mono text-[8px] leading-none text-white/25">{ticker.name}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-mono text-[11px] font-semibold leading-none tabular-nums transition-colors duration-300 ${flash ? (positive ? "text-primary" : "text-red-400") : "text-white/85"}`}>
          {ticker.decimals === 0 ? ticker.price.toLocaleString() : ticker.price.toFixed(ticker.decimals)}
        </span>
        <span className={`mt-0.5 font-mono text-[9px] font-medium leading-none tabular-nums ${positive ? "text-primary" : "text-red-400"}`}>
          {positive ? "+" : ""}
          {ticker.pct.toFixed(2)}%
        </span>
      </div>
      <div className={`flex h-5 w-5 items-center justify-center rounded ${positive ? "bg-primary/10" : "bg-red-500/10"}`}>
        <svg viewBox="0 0 8 8" className="h-3 w-3">
          {positive ? <polygon points="4,1 7,7 1,7" fill="currentColor" className="text-primary" /> : <polygon points="4,7 7,1 1,1" fill="currentColor" className="text-red-400" />}
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [typingForward, setTypingForward] = useState(true);
  const [marketClock, setMarketClock] = useState(() => getMarketClock());
  const [sending, setSending] = useState(false);
  const mouseX = useRef(0.5);
  const mouseY = useRef(0.5);
  const { toast } = useToast();
  const contactMutation = useContact();
  const { data: marketData, isLoading: marketLoading, isError: marketError } = useMarketData();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    let timeout = 0;
    const role = HERO_ROLES[roleIndex];

    if (typingForward) {
      if (typedRole.length < role.length) {
        timeout = window.setTimeout(() => setTypedRole(role.slice(0, typedRole.length + 1)), 60);
      } else {
        timeout = window.setTimeout(() => setTypingForward(false), 1800);
      }
    } else if (typedRole.length > 0) {
      timeout = window.setTimeout(() => setTypedRole((current) => current.slice(0, -1)), 30);
    } else {
      setRoleIndex((current) => (current + 1) % HERO_ROLES.length);
      setTypingForward(true);
    }

    return () => window.clearTimeout(timeout);
  }, [roleIndex, typedRole, typingForward]);

  useEffect(() => {
    const interval = window.setInterval(() => setMarketClock(getMarketClock()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const onHeroMouseMove = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.current = (event.clientX - rect.left) / rect.width;
    mouseY.current = (event.clientY - rect.top) / rect.height;
  }, []);
  const heroTickers = useMemo(() => normalizeTickers((marketData as MarketQuote[] | undefined) ?? []), [marketData]);
  const [spotInput, setSpotInput] = useState("450");
  const [strikeInput, setStrikeInput] = useState("460");
  const [daysInput, setDaysInput] = useState("30");
  const [rateInput, setRateInput] = useState("5.25");
  const [volInput, setVolInput] = useState("22");

  const pricer = useMemo(() => {
    const spotPrice = parseFloat(spotInput);
    const strikePrice = parseFloat(strikeInput);
    const days = parseFloat(daysInput) / 365;
    const rate = parseFloat(rateInput) / 100;
    const volatility = parseFloat(volInput) / 100;

    return blackScholes(spotPrice, strikePrice, days, rate, volatility);
  }, [daysInput, rateInput, spotInput, strikeInput, volInput]);

  const moneyness = pricer
    ? parseFloat(spotInput) > parseFloat(strikeInput)
      ? "ITM"
      : parseFloat(spotInput) < parseFloat(strikeInput)
        ? "OTM"
        : "ATM"
    : null;

  const marketOpen = marketClock.isOpen;

  const submitContact = async (values: ContactFormValues) => {
    setSending(true);

    try {
      await contactMutation.mutateAsync(values);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your interest. I will reach out to you shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary">
      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-8 pt-16"
        onMouseMove={onHeroMouseMove}
      >
        <div className="absolute inset-0 overflow-hidden">
          <MatrixRainCanvas />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,#020810_100%)]" />
          <ParticleField mouseX={mouseX} mouseY={mouseY} />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.18, 0.12] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 -top-32 h-[650px] w-[650px] rounded-full bg-primary blur-[200px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.12, 0.07] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-blue-600 blur-[180px]"
          />
        </div>

        <FloatingMetricCard
          icon={Activity}
          label="IV SPX 30d"
          base={14.2}
          spread={1.2}
          formatter={(value) => `${value.toFixed(1)}%`}
          colorClass="text-primary"
          delay={1.1}
          style={{ left: "4%", top: "20%" }}
        />
        <FloatingMetricCard
          icon={TrendingUp}
          label="Sharpe Ratio"
          base={2.41}
          spread={0.12}
          formatter={(value) => value.toFixed(2)}
          colorClass="text-emerald-400"
          delay={1.2}
          style={{ left: "4%", top: "58%" }}
        />
        <FloatingMetricCard
          icon={Sigma}
          label="Portfolio β"
          base={0.87}
          spread={0.04}
          formatter={(value) => value.toFixed(2)}
          colorClass="text-sky-400"
          delay={1.3}
          style={{ right: "4%", top: "20%" }}
        />
        <FloatingMetricCard
          icon={ShieldAlert}
          label="VaR 95%"
          base={3.2}
          spread={0.35}
          formatter={(value) => `−${value.toFixed(1)}%`}
          colorClass="text-amber-400"
          delay={1.4}
          style={{ right: "4%", top: "58%" }}
        />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary shadow-[0_0_20px_rgba(0,255,136,0.12)]"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Open to roles · April 2026
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 90 }}
            className="relative mb-10"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.07, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-5 rounded-full border border-dashed border-primary/15"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[7px] rounded-full"
              style={{ background: "conic-gradient(from 0deg, transparent 55%, #00ff88 75%, transparent 100%)" }}
            />
            <div className="absolute -inset-[4px] rounded-full bg-background" />
            <div className="relative h-[210px] w-[210px] overflow-hidden rounded-full ring-2 ring-primary/25 shadow-[0_0_50px_rgba(0,255,136,0.18),inset_0_0_30px_rgba(0,0,0,0.5)] sm:h-[250px] sm:w-[250px]">
              <img
                src="/dhiren-professional.png"
                alt="Dhiren Rawal"
                className="h-full w-full scale-[1.12] object-cover object-[54%_14%]"
              />
              <motion.div
                animate={{ y: ["-100%", "220%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-primary/15 to-transparent"
              />
            </div>
          </motion.div>

          <AnimatedName />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }} className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/40">
            MQF · UCSD Rady School of Management · New York
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="min-w-[250px] text-center font-mono text-base text-primary sm:text-lg" style={{ textShadow: "0 0 24px rgba(0,255,136,0.6)" }}>
              {typedRole}
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                █
              </motion.span>
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
            className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground/55 sm:text-base"
          >
            Building automated trading systems, volatility surface calibrators, and risk analytics pipelines — where rigorous mathematics meets production-grade code.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mb-10 flex flex-wrap justify-center gap-3">
            <a
              href="#projects"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-8 font-semibold text-primary-foreground shadow-[0_0_24px_rgba(0,255,136,0.35)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_44px_rgba(0,255,136,0.6)]"
            >
              View Projects <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/Dhiren_Rawal_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary/20 bg-background/15 px-8 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary/55 hover:bg-primary/10 hover:shadow-[0_0_22px_rgba(0,255,136,0.18)]"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.28 }}
            className="mb-8 grid w-full max-w-sm grid-cols-4 divide-x divide-border/25 overflow-hidden rounded-2xl border border-border/20 bg-background/15 backdrop-blur-md"
          >
            {[
              ["5+", "YRS EXP"],
              ["20+", "PROJECTS"],
              ["3", "DOMAINS"],
              ["A+", "FOCUS"],
            ].map(([value, label]) => (
              <motion.div key={label} whileHover={{ backgroundColor: "rgba(0,255,136,0.04)" }} className="flex cursor-default flex-col items-center px-2 py-4">
                <span className="font-mono text-xl font-bold text-foreground sm:text-2xl" style={{ textShadow: "0 0 14px rgba(0,255,136,0.15)" }}>
                  {value}
                </span>
                <span className="mt-0.5 font-mono text-[8px] tracking-widest text-muted-foreground/45">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.38 }} className="flex flex-wrap justify-center gap-2">
            {HERO_SKILLS.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.04 }}
                whileHover={{
                  scale: 1.12,
                  borderColor: "rgba(0,255,136,0.5)",
                  color: "#00ff88",
                  boxShadow: "0 0 12px rgba(0,255,136,0.25)",
                }}
                className="cursor-default rounded-full border border-primary/10 bg-primary/5 px-3 py-1 font-mono text-[10px] text-muted-foreground/55 transition-all duration-200"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 7, 0] }}
          transition={{ delay: 1.7, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
          className="pointer-events-none absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground/22"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      <section id="experience" className="relative border-y border-border bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Career <span className="text-primary">Trajectory</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">A continuous journey of blending financial acumen with quantitative rigor.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <TimelineSection title="Experience" icon={<BriefcaseBusiness className="h-5 w-5" />} items={EXPERIENCE} />
            <TimelineSection title="Education" icon={<GraduationCap className="h-5 w-5" />} items={EDUCATION} education />
          </div>
        </div>
      </section>

      <section id="projects" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-background" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-1/2 w-1/3 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="mb-4 flex items-center gap-3">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Featured <span className="text-primary">Models</span>
              </h2>
            </div>
            <p className="max-w-2xl font-mono text-sm text-muted-foreground">$ ls -la ./projects | grep "quant"</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="terminal-border glass-panel group flex h-full flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center justify-between border-b border-border bg-secondary/50 p-4">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-border transition-colors group-hover:bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-border transition-colors delay-75 group-hover:bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-border transition-colors delay-150 group-hover:bg-green-500/80" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{project.date}</span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-6 opacity-80 transition-opacity group-hover:opacity-100">
                      <Icon />
                    </div>
                    <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">{project.title}</h3>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mb-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-4 border-t border-border pt-4">
                      <button type="button" className="flex items-center gap-2 p-0 text-sm hover:text-primary">
                        <ArrowRight className="h-4 w-4" /> View Case Study
                      </button>
                      <button type="button" className="flex items-center gap-2 p-0 text-sm text-muted-foreground hover:text-foreground">
                        <Github className="h-4 w-4" /> Source
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricer" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="pointer-events-none absolute right-1/4 top-0 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
              <TerminalSquare className="h-3.5 w-3.5" />
              Live Black-Scholes Engine
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              Options <span className="text-primary">Pricer</span>
            </h2>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              Real-time European option pricing with full Greeks. Adjust the parameters and watch the model recalibrate instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]"
          >
            <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-1 font-mono text-xs text-muted-foreground">bs_pricer.py</span>
              </div>

              {[
                { label: "Spot Price (S)", value: spotInput, setter: setSpotInput, unit: "$", hint: "Current underlying price" },
                { label: "Strike Price (K)", value: strikeInput, setter: setStrikeInput, unit: "$", hint: "Option strike price" },
                { label: "Days to Expiry (T)", value: daysInput, setter: setDaysInput, unit: "d", hint: "Calendar days until expiration" },
                { label: "Risk-Free Rate (r)", value: rateInput, setter: setRateInput, unit: "%", hint: "Annualized risk-free rate (e.g. 5.25)" },
                { label: "Implied Volatility (σ)", value: volInput, setter: setVolInput, unit: "%", hint: "Annualized volatility" },
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-1">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{field.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={field.value}
                      onChange={(event) => field.setter(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 font-mono text-sm text-foreground transition-colors focus:border-primary/70 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      step="any"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{field.unit}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60">{field.hint}</span>
                </div>
              ))}

              {moneyness ? (
                <div
                  className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                    moneyness === "ITM"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                      : moneyness === "OTM"
                        ? "border-red-400/30 bg-red-400/10 text-red-400"
                        : "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                  }`}
                >
                  <Sigma className="h-3 w-3" />
                  {moneyness} —{" "}
                  {parseFloat(spotInput) > parseFloat(strikeInput)
                    ? "Spot above Strike"
                    : parseFloat(spotInput) < parseFloat(strikeInput)
                      ? "Spot below Strike"
                      : "At the Money"}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              {pricer ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div initial={{ scale: 0.97 }} animate={{ scale: 1 }} className="flex flex-col gap-1 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                      <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
                        <ArrowUpRight className="h-3.5 w-3.5" /> Call Option
                      </div>
                      <div className="font-mono text-4xl font-bold text-emerald-400">${formatMetric(pricer.callPrice, 2)}</div>
                      <div className="font-mono text-xs text-muted-foreground">Fair Value / Contract</div>
                    </motion.div>

                    <motion.div initial={{ scale: 0.97 }} animate={{ scale: 1 }} className="flex flex-col gap-1 rounded-2xl border border-red-400/30 bg-red-400/10 p-5">
                      <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-400">
                        <ArrowDownRight className="h-3.5 w-3.5" /> Put Option
                      </div>
                      <div className="font-mono text-4xl font-bold text-red-400">${formatMetric(pricer.putPrice, 2)}</div>
                      <div className="font-mono text-xs text-muted-foreground">Fair Value / Contract</div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border bg-background/50 p-3 font-mono">
                      <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">d₁</div>
                      <div className="text-lg font-bold text-foreground">{formatMetric(pricer.d1)}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background/50 p-3 font-mono">
                      <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">d₂</div>
                      <div className="text-lg font-bold text-foreground">{formatMetric(pricer.d2)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <GreekCard label="Δ Delta" callValue={pricer.deltaCall} putValue={pricer.deltaPut} decimals={4} description="Price sensitivity to spot" />
                    <GreekCard label="Γ Gamma" callValue={pricer.gamma} decimals={6} description="Delta sensitivity to spot" />
                    <GreekCard label="Θ Theta" callValue={pricer.thetaCall} putValue={pricer.thetaPut} decimals={4} description="Time decay per day" />
                    <GreekCard label="ν Vega" callValue={pricer.vega} decimals={4} description="Sensitivity per 1% vol" />
                    <GreekCard label="ρ Rho" callValue={pricer.rhoCall} putValue={pricer.rhoPut} decimals={4} description="Sensitivity per 1% rate" />
                    <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/60 p-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-primary">Put-Call</span>
                      <div className="font-mono text-base font-bold text-foreground">{formatMetric(Math.abs(pricer.callPrice - pricer.putPrice), 4)}</div>
                      <p className="font-mono text-[10px] leading-tight text-muted-foreground/70">Parity spread (C − P)</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center font-mono text-sm text-muted-foreground">
                  Enter valid parameters to compute prices.
                </div>
              )}
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center font-mono text-[11px] text-muted-foreground/50">
            C = S·N(d₁) − K·e<sup>−rT</sup>·N(d₂) | P = K·e<sup>−rT</sup>·N(−d₂) − S·N(−d₁) | European exercise, no dividends assumed
          </motion.p>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden border-y border-border bg-secondary/30 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              About <span className="text-primary">Me</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">The person behind the models and the code.</p>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="group relative w-full max-w-[430px]">
                <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-primary/35 via-primary/10 to-transparent opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative aspect-[0.78] overflow-hidden rounded-[30px] border border-primary/25 bg-[#0a111a] shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
                  <img
                    src="/dhiren-professional.png"
                    alt="Dhiren Rawal portrait card"
                    className="h-full w-full object-cover object-[53%_14%]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,29,0)_42%,rgba(7,17,29,0.12)_60%,rgba(7,17,29,0.88)_100%)]" />
                  <div className="absolute right-4 top-4 rounded-full border border-primary/20 bg-[#07111d]/92 px-5 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                      Class of 2025
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 text-left">
                    <div className="text-[2rem] font-bold leading-none text-white">Dhiren Rawal</div>
                    <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                      MQF Candidate · UCSD Rady
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  I'm a quantitative finance professional with a strong foundation in mathematical modeling, derivatives pricing, and risk analytics. My background bridges both the operational and analytical sides of finance — from managing liquidity forecasting at a family enterprise to building automated volatility surface calibration tools from scratch.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  At UCSD's Rady School of Management, I've deepened my expertise in structured products, fixed income, and market microstructure — while developing a passion for translating complex financial theory into production-grade Python and SQL systems.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-sm">
                {[
                  { icon: MapPin, text: "New York, NY" },
                  { icon: Mail, text: "dhiren.rawal2001@gmail.com" },
                  { icon: Phone, text: "+1 (858) 214-0637" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-mono">{text}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <TerminalSquare className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Core Expertise</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CORE_EXPERTISE.map((skill) => (
                    <span key={skill} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-primary/15 bg-primary/5 p-3">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
                <span className="font-mono text-sm text-foreground">
                  Open to full-time opportunities starting <span className="text-primary">April 2026</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">
                Initialize <span className="text-primary">Connection</span>
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Currently open to full-time Quantitative Finance and Trading opportunities starting April 2026. Let's discuss how my analytical skills can contribute to your firm's edge.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", content: <a href="mailto:dhiren.rawal2001@gmail.com" className="text-lg font-medium transition-colors hover:text-primary">dhiren.rawal2001@gmail.com</a> },
                  { icon: Phone, label: "Phone", content: <p className="text-lg font-medium">+1 (858) 214-0637</p> },
                  { icon: MapPin, label: "Location", content: <p className="text-lg font-medium">New York, NY / San Diego, CA</p> },
                ].map(({ icon: Icon, label, content }) => (
                  <div key={label} className="group flex items-center gap-4">
                    <div className="rounded-xl border border-border bg-secondary p-4 transition-colors group-hover:border-primary">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex gap-4">
                <a
                  href="https://www.linkedin.com/in/dhirenrawal9"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-primary"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/DhirenRawal"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-primary"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-panel rounded-2xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitContact)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name / Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@firm.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="We have an opening for a Quant Researcher..." className="min-h-[160px] resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 text-md font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Transmitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Execute Send
                      </span>
                    )}
                  </button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-14 w-full bg-background" />

      <footer className="mt-auto border-t border-border bg-secondary/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Dhiren Rawal. All rights reserved.</p>
          <div className="flex gap-4 font-mono text-xs text-muted-foreground">
            <span>SYS.STATUS: ONLINE</span>
            <span className="text-primary">LATENCY: 12ms</span>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 z-[100] w-full">
        <div className="relative z-50 w-full overflow-hidden border-t border-white/6 bg-[#020810]/95 backdrop-blur-xl" style={{ height: "56px" }}>
          <div className="absolute bottom-0 left-0 top-0 z-20 flex min-w-[112px] shrink-0 items-center border-r border-white/6 bg-[#020810]/95 px-4">
            <span className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] ${marketOpen ? "text-primary" : "text-amber-300"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${marketOpen ? "animate-pulse bg-primary" : "bg-amber-300"}`} />
              {marketOpen ? "Live" : "Closed"}
            </span>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-[112px] top-0 z-10 w-12 bg-gradient-to-r from-[#020810]/95 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#020810]/95 to-transparent" />
          <div className="absolute bottom-0 left-[112px] right-0 top-0 flex items-center overflow-hidden">
            {heroTickers.length ? (
              <div className="animate-ticker hover:[animation-play-state:paused] flex h-full w-max items-center whitespace-nowrap">
                {[...heroTickers, ...heroTickers, ...heroTickers].map((ticker, index) => (
                  <TickerItem key={`${ticker.symbol}-${index}`} ticker={ticker} />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center px-5 font-mono text-[11px] text-muted-foreground">
                {marketError ? "Live quotes unavailable right now." : marketLoading ? "Loading live quotes from Yahoo Finance..." : "Waiting for market data..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
