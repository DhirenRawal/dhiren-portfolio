import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  FileDown,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Wifi,
} from "lucide-react";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
};

type Ticker = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
};

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

const ROLE_ROTATION = [
  "High Yield Credit Trading Analyst",
  "Algo Trader",
  "Quant Finance Builder",
  "Fixed Income Risk Researcher",
];

const STATS = [
  { value: "5+", label: "YRS EXP" },
  { value: "20+", label: "PROJECTS" },
  { value: "3", label: "DOMAINS" },
  { value: "A+", label: "FOCUS" },
];

const SKILL_PILLS = ["Python", "Black-Scholes", "GARCH", "Monte Carlo", "SQL", "VaR/CVaR", "Fixed Income"];

const EDUCATION = [
  {
    degree: "Master of Quantitative Finance",
    institution: "Rady School of Management, University of California, San Diego",
    location: "San Diego, CA",
    date: "12/2025",
    courses:
      "Derivatives & Structured Products, Advanced Risk Management, Fixed Income, Econometrics",
  },
  {
    degree: "Bachelor of Commerce",
    institution: "KJ Somaiya College of Science and Commerce",
    location: "Mumbai, India",
    date: "04/2022",
    courses: "Financial Accounting, Business Economics, Cost Accounts, Management Accounts",
  },
];

const EXPERIENCE = [
  {
    title: "Operations and Finance Manager",
    company: "Mahalaxmi Enterprises",
    period: "Nov 2023 - Aug 2024",
    location: "Thane, India",
    bullets: [
      "Improved short-term liquidity forecasting accuracy by 10% by modeling cash flow volatility and stress-testing 3 downside demand scenarios.",
      "Reduced operational risk incidents by 22% by identifying recurring variance shocks in high-volume transactions and implementing tighter review controls.",
    ],
  },
  {
    title: "Investment Banking Intern",
    company: "StartupLanes",
    period: "May 2023 - Nov 2023",
    location: "Goa, India",
    bullets: [
      "Reduced downside valuation dispersion by 18% by building 3-statement models with leverage, interest coverage, and refinancing stress cases.",
      "Accelerated investment decision turnaround by 30% by consolidating sensitivity outputs into a unified risk dashboard for senior review.",
    ],
  },
  {
    title: "Operations Analyst",
    company: "Mahalaxmi Enterprises",
    period: "Jun 2022 - May 2023",
    location: "India",
    bullets: [
      "Increased delivery efficiency from 82% to 93% by segmenting products statistically and improving execution speed.",
      "Cut fulfillment cycle time by 18-25% by isolating high-impact inefficiencies in noisy operational data.",
    ],
  },
];

const PROJECTS = [
  {
    title: "High Yield Relative Value & Risk Monitoring Engine",
    label: "Independent Project · 01/2026 - Present",
    copy:
      "Built a live relative value monitor across 35 HY bonds spanning 6 sectors by building scenario analysis tied to spread duration, carry, and roll metrics.",
    bullets: [
      "Identified OAS proxies, spread duration, and carry/roll under liquidity shocks.",
      "Simulated P&L under 100 bps spread shocks and liquidity widening to decompose carry versus mark-to-market impact.",
    ],
    tags: ["Credit", "Relative Value", "Risk Monitoring"],
  },
  {
    title: "Fallen Angel Credit Dislocation Case Study",
    label: "Independent Project · 12/2025",
    copy:
      "Quantified forced IG-to-HY index transition effects across 12 liquid bonds, comparing spread widening and technical premium from ETF and mandate-based selling.",
    bullets: [
      "Estimated 25-40 bps technical premium under forced-selling flows.",
      "Modeled spread DV01 and default sensitivity to demonstrate upside-to-downside risk asymmetry.",
    ],
    tags: ["HY Credit", "Event Study", "Spread DV01"],
  },
  {
    title: "Market Making and Execution Simulation",
    label: "Independent Project · 09/2025",
    copy:
      "Built a market-making simulator with inventory-aware bid/ask quoting, hard and soft risk limits, and execution-driven P&L attribution.",
    bullets: [
      "Modeled a limit order book and market-making inventory risk.",
      "Corrected a flawed execution model that produced artificial zero-variance P&L.",
    ],
    tags: ["Execution", "Inventory Risk", "PnL Attribution"],
  },
];

const SPECIALIZED_SKILLS = [
  {
    title: "Tools",
    text:
      "Bloomberg Terminal, bond analytics, YAS, SRCH, Python, pandas, NumPy, SQL, advanced Excel, scenario analysis, dashboards, VBA, and time-series analysis.",
  },
  {
    title: "Credit & Fixed Income",
    text:
      "Spread analytics, OAS proxy estimation, spread duration, carry & roll-down return, credit relative value, capital structure analysis, and fallen angel dynamics.",
  },
  {
    title: "Risk & Markets",
    text:
      "Scenario stress testing, liquidity analysis, inventory risk management, default probability estimation, P&L attribution, primary issuance, and sector dispersion tracking.",
  },
];

const INITIAL_TICKERS: Ticker[] = [
  { symbol: "SPX", name: "S&P 500", price: 5123.27, changePercent: 0.28 },
  { symbol: "NDX", name: "Nasdaq 100", price: 17835.5, changePercent: 0.99 },
  { symbol: "RTY", name: "Russell 2000", price: 2046.95, changePercent: -0.68 },
  { symbol: "VIX", name: "Volatility", price: 14.24, changePercent: -3.16 },
  { symbol: "NVDA", name: "NVIDIA", price: 876.72, changePercent: 2.27 },
  { symbol: "AAPL", name: "Apple", price: 177.88, changePercent: -0.7 },
  { symbol: "TSLA", name: "Tesla", price: 202.17, changePercent: 3.44 },
  { symbol: "MSFT", name: "Microsoft", price: 420.22, changePercent: 1.42 },
  { symbol: "GC=F", name: "Gold Futures", price: 2047.11, changePercent: 0.87 },
  { symbol: "BTC-USD", name: "Bitcoin", price: 64175, changePercent: 4.12 },
  { symbol: "^TNX", name: "10Y Treasury", price: 4.18, changePercent: -0.31 },
];

const CHART_SERIES: Record<string, number[]> = {
  SPX: [5212, 5190, 5198, 5188, 5181, 5178, 5194, 5201, 5186, 5198, 5226, 5250, 5237, 5228, 5251, 5230, 5214, 5202, 5180, 5166, 5141, 5160, 5152, 5144, 5138, 5134, 5148, 5171, 5185, 5192, 5173, 5160, 5168, 5182, 5172, 5188, 5194, 5181, 5174, 5162, 5183, 5178, 5160, 5171],
  NDX: [17640, 17688, 17612, 17590, 17654, 17748, 17810, 17785, 17862, 17840, 17922, 17985, 18024, 17960, 17922, 17880, 17822, 17776, 17734, 17688, 17610, 17588, 17624, 17682, 17710, 17742, 17785, 17806, 17820, 17852, 17804, 17766, 17792, 17835],
  RTY: [2038, 2032, 2024, 2020, 2014, 2018, 2026, 2031, 2028, 2022, 2017, 2008, 2004, 1999, 2006, 2011, 2018, 2021, 2012, 2006, 2013, 2019, 2027, 2030, 2022, 2019, 2024, 2034, 2041, 2035, 2030, 2037, 2046],
  VIX: [15.8, 15.2, 14.9, 14.4, 14.1, 14.3, 14.6, 14.8, 14.5, 14.2, 13.9, 13.8, 14.2, 14.6, 14.9, 15.1, 14.8, 14.4, 14.2, 14.1, 14.0, 14.3, 14.6, 14.4, 14.2, 14.0, 13.9, 14.1, 14.24],
};

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatPrice(value: number) {
  return value >= 1000 ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toFixed(2);
}

function buildCandles(series: number[]): Candle[] {
  return series.map((close, index) => {
    const previous = index === 0 ? close - 6 : series[index - 1];
    const move = Math.sin(index * 1.3) * Math.max(close * 0.002, 0.18);
    const open = previous + move;
    const high = Math.max(open, close) + Math.max(close * 0.003, 0.4) * (0.3 + ((index * 7) % 5) / 5);
    const low = Math.min(open, close) - Math.max(close * 0.003, 0.4) * (0.28 + ((index * 3) % 5) / 6);

    return { open, high, low, close };
  });
}

function MarketCard({ ticker }: { ticker: Ticker }) {
  const positive = ticker.changePercent >= 0;

  return (
    <div className="border-r border-border/30 px-5 py-4 min-w-[190px] md:min-w-0">
      <div className="font-mono text-sm font-bold text-foreground">{ticker.symbol}</div>
      <div className="font-mono text-[11px] text-muted-foreground/70">{ticker.name}</div>
      <div className="mt-1 font-mono text-lg font-bold text-foreground">{formatPrice(ticker.price)}</div>
      <div className={`mt-1 flex items-center gap-1 font-mono text-sm font-bold ${positive ? "text-primary" : "text-destructive"}`}>
        {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {positive ? "+" : ""}
        {ticker.changePercent.toFixed(2)}%
      </div>
    </div>
  );
}

export default function Home() {
  const [typedRole, setTypedRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [tickers, setTickers] = useState(INITIAL_TICKERS);
  const [activeChart, setActiveChart] = useState<keyof typeof CHART_SERIES>("SPX");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [githubStatus, setGithubStatus] = useState("Loading repositories...");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const currentRole = ROLE_ROTATION[roleIndex];
    const timeout = window.setTimeout(
      () => {
        if (!deleting) {
          const next = currentRole.slice(0, typedRole.length + 1);
          setTypedRole(next);

          if (next === currentRole) {
            setDeleting(true);
          }
        } else {
          const next = currentRole.slice(0, typedRole.length - 1);
          setTypedRole(next);

          if (!next) {
            setDeleting(false);
            setRoleIndex((current) => (current + 1) % ROLE_ROTATION.length);
          }
        }
      },
      deleting ? (typedRole ? 45 : 280) : typedRole === currentRole ? 1000 : 80
    );

    return () => window.clearTimeout(timeout);
  }, [deleting, roleIndex, typedRole]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTickers((current) =>
        current.map((ticker) => {
          const priceDrift = (Math.random() - 0.5) * (ticker.price > 1000 ? 12 : ticker.symbol === "BTC-USD" ? 220 : 1.4);
          const changeDrift = (Math.random() - 0.5) * 0.22;

          return {
            ...ticker,
            price: Math.max(0.01, ticker.price + priceDrift),
            changePercent: ticker.changePercent + changeDrift,
          };
        })
      );
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1200);

    setClock(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRepos() {
      try {
        const response = await fetch(
          "https://api.github.com/users/DhirenRawal/repos?sort=updated&per_page=6&type=owner"
        );

        if (!response.ok) {
          throw new Error(`GitHub returned ${response.status}`);
        }

        const data: Repo[] = await response.json();
        if (cancelled) return;

        const featured = data.filter((repo) => !repo.fork).slice(0, 6);
        setRepos(featured);
        setGithubStatus(featured.length ? "GitHub sync active." : "No non-fork repositories found yet.");
      } catch (error) {
        if (cancelled) return;

        setGithubStatus(
          `Unable to load GitHub repositories right now. ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    loadRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  const series = CHART_SERIES[activeChart];
  const candles = buildCandles(series);
  const chartMin = Math.min(...candles.map((candle) => candle.low));
  const chartMax = Math.max(...candles.map((candle) => candle.high));
  const chartWidth = 1040;
  const chartHeight = 420;
  const paddingX = 26;
  const paddingTop = 22;
  const paddingBottom = 42;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const candleGap = 6;
  const candleWidth = (chartWidth - paddingX * 2) / candles.length - candleGap;
  const maSeries = candles.map((_, index) =>
    average(candles.slice(Math.max(0, index - 7), index + 1).map((entry) => entry.close))
  );

  const mapY = (value: number) => paddingTop + ((chartMax - value) / (chartMax - chartMin || 1)) * plotHeight;
  const latest = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  const chartChange = latest.close - previous.close;
  const chartChangePct = (chartChange / previous.close) * 100;
  const currentLineY = mapY(latest.close);

  return (
    <div className="relative overflow-x-hidden bg-background pt-28 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[9%] h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute right-[8%] top-[16%] h-80 w-80 rounded-full bg-secondary/10 blur-[160px]" />
      </div>

      <div className="terminal-grid pointer-events-none absolute inset-0 opacity-40" />

      <main className="relative z-10 pb-48">
        <section id="terminal" className="mx-auto min-h-screen max-w-[1280px] px-4 pb-16">
          <div className="terminal-panel relative overflow-hidden rounded-[40px] px-6 pb-14 pt-20 md:px-12 md:pt-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_26%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_65%_14%,rgba(34,197,94,0.08),transparent_22%),linear-gradient(135deg,rgba(6,40,25,0.24),transparent_42%)]" />

            <div className="relative z-10 flex justify-center">
              <div className="inline-flex min-h-[58px] items-center rounded-full border border-primary/30 bg-primary/10 px-7 font-mono text-sm text-primary">
                ● Open to roles · April 2026 ●
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-10 grid max-w-[1120px] gap-10">
              <div className="mx-auto flex w-full max-w-[520px] justify-center">
                <div className="terminal-orbit relative aspect-square w-full max-w-[500px] rounded-full p-4">
                  <div className="absolute inset-[18px] rounded-full border border-dashed border-primary/20" />
                  <img
                    src="/dhiren-portrait.png"
                    alt="Dhiren Rawal"
                    className="relative z-10 h-full w-full rounded-full border-[6px] border-primary/80 object-cover shadow-[0_0_0_10px_rgba(5,13,18,0.96),0_0_60px_rgba(34,197,94,0.15)]"
                  />
                </div>
              </div>

              <div className="mx-auto max-w-[1080px] text-center">
                <h1 className="text-[clamp(3.6rem,11vw,7.6rem)] font-extrabold leading-[0.93] tracking-[-0.08em]">
                  <span className="text-white">DHIREN </span>
                  <span className="text-primary">RAWAL</span>
                </h1>

                <p className="mt-5 font-mono text-[0.95rem] uppercase tracking-[0.32em] text-muted-foreground/60">
                  MQF · UCSD Rady School of Management · San Diego
                </p>

                <div className="mx-auto mt-8 flex max-w-[520px] items-center justify-center gap-4">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <p className="font-mono text-[clamp(1.35rem,2.4vw,1.95rem)] text-primary">
                    {typedRole}
                    <span className="animate-pulse">█</span>
                  </p>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                </div>

                <p className="mx-auto mt-8 max-w-[860px] text-[clamp(1.1rem,1.9vw,1.55rem)] leading-relaxed text-muted-foreground">
                  Building automated trading systems, volatility surface calibrators, fixed income analytics, and
                  risk frameworks where rigorous mathematics meets production-grade execution.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                  <a
                    href="/#models"
                    className="inline-flex min-h-[78px] items-center justify-center rounded-[24px] bg-primary px-10 text-[clamp(1.2rem,2vw,1.55rem)] font-bold text-primary-foreground shadow-[0_0_30px_rgba(34,197,94,0.28)] transition-transform hover:-translate-y-0.5"
                  >
                    View Projects <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="/Dhiren_Rawal_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[78px] items-center justify-center rounded-[24px] border border-primary/25 bg-background/60 px-10 text-[clamp(1.05rem,1.8vw,1.35rem)] font-bold text-primary transition-transform hover:-translate-y-0.5"
                  >
                    <FileDown className="mr-3 h-5 w-5" />
                    Download CV
                  </a>
                </div>

                <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-2 overflow-hidden rounded-[26px] border border-border/40 bg-background/35 md:grid-cols-4">
                  {STATS.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`px-5 py-7 ${index > 0 ? "border-l border-border/30" : ""} ${index > 1 ? "border-t border-border/30 md:border-t-0" : ""}`}
                    >
                      <div className="text-[clamp(2rem,4vw,3rem)] font-extrabold">{stat.value}</div>
                      <div className="mt-2 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground/50">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mx-auto mt-10 flex max-w-[980px] flex-wrap items-center justify-center gap-3">
                  {SKILL_PILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/15 bg-primary/5 px-5 py-3 font-mono text-sm text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mx-auto mt-5 w-fit rounded-full border border-primary/10 px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
                  Scroll
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricer" className="mx-auto max-w-[1280px] px-4 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="terminal-panel rounded-[34px] px-6 py-8 md:px-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 font-mono text-primary">
                  <Wifi className="h-4 w-4" />
                  LIVE FEED
                </div>
                {(["SPX", "NDX", "RTY", "VIX"] as const).map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => setActiveChart(symbol)}
                    className={`rounded-xl border px-4 py-3 font-mono text-lg transition-colors ${
                      activeChart === symbol
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-5 font-mono text-sm text-foreground">
                <span className={chartChange >= 0 ? "text-primary" : "text-destructive"}>
                  {chartChange >= 0 ? "+" : ""}
                  {chartChange.toFixed(2)} ({chartChangePct >= 0 ? "+" : ""}
                  {chartChangePct.toFixed(2)}%)
                </span>
                <span>H: {latest.high.toFixed(2)}</span>
                <span>L: {latest.low.toFixed(2)}</span>
                <span className="text-[#d4b13a]">MA20: {average(maSeries.slice(-20)).toFixed(2)}</span>
                <span className="text-muted-foreground">{clock}</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-border/40 bg-black/20">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-auto w-full">
                <defs>
                  <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#070b13" />
                    <stop offset="100%" stopColor="#05080f" />
                  </linearGradient>
                </defs>

                <rect width={chartWidth} height={chartHeight} rx="24" fill="url(#chartBg)" />

                {[0, 1, 2, 3].map((index) => {
                  const y = paddingTop + (plotHeight / 3) * index;
                  return (
                    <line
                      key={index}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="rgba(105,118,145,0.16)"
                      strokeWidth="1"
                    />
                  );
                })}

                <path
                  d={maSeries
                    .map((value, index) => {
                      const x = paddingX + index * (candleWidth + candleGap) + candleWidth / 2;
                      const y = mapY(value);
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#d4b13a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <line
                  x1={paddingX}
                  y1={currentLineY}
                  x2={chartWidth - paddingX}
                  y2={currentLineY}
                  stroke="rgba(34,197,94,0.24)"
                  strokeWidth="1.5"
                  strokeDasharray="7 6"
                />

                {candles.map((candle, index) => {
                  const x = paddingX + index * (candleWidth + candleGap);
                  const openY = mapY(candle.open);
                  const closeY = mapY(candle.close);
                  const highY = mapY(candle.high);
                  const lowY = mapY(candle.low);
                  const bodyY = Math.min(openY, closeY);
                  const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);
                  const positive = candle.close >= candle.open;
                  const stroke = positive ? "#45ef77" : "#ff4f4f";
                  const fill = positive ? "rgba(69,239,119,0.72)" : "rgba(255,79,79,0.25)";

                  return (
                    <g key={index}>
                      <line
                        x1={x + candleWidth / 2}
                        y1={highY}
                        x2={x + candleWidth / 2}
                        y2={lowY}
                        stroke={stroke}
                        strokeWidth="2"
                      />
                      <rect x={x} y={bodyY} width={Math.max(candleWidth, 3)} height={bodyHeight} fill={fill} stroke={stroke} strokeWidth="2" />
                    </g>
                  );
                })}

                <text x={paddingX} y={paddingTop + 12} fill="rgba(116,130,154,0.7)" fontFamily="JetBrains Mono" fontSize="12">
                  {chartMax.toFixed(activeChart === "VIX" ? 2 : 1)}
                </text>
                <text
                  x={paddingX}
                  y={paddingTop + plotHeight / 2}
                  fill="rgba(116,130,154,0.7)"
                  fontFamily="JetBrains Mono"
                  fontSize="12"
                >
                  {((chartMax + chartMin) / 2).toFixed(activeChart === "VIX" ? 2 : 1)}
                </text>
                <text
                  x={paddingX}
                  y={paddingTop + plotHeight - 4}
                  fill="rgba(116,130,154,0.7)"
                  fontFamily="JetBrains Mono"
                  fontSize="12"
                >
                  {chartMin.toFixed(activeChart === "VIX" ? 2 : 1)}
                </text>
                <text
                  x={chartWidth - 90}
                  y={currentLineY - 8}
                  fill="#23ff95"
                  fontFamily="JetBrains Mono"
                  fontSize="14"
                >
                  {latest.close.toFixed(2)}
                </text>
              </svg>
            </div>
          </motion.div>
        </section>

        <section id="trajectory" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="text-center">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Career Path</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-extrabold tracking-[-0.06em]">
              Career <span className="text-primary">Trajectory</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[860px] text-xl text-muted-foreground">
              A continuous journey of blending financial acumen with quantitative rigor.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-4">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-8 w-8" />
            </div>
            <h3 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.05em]">Experience</h3>
          </div>

          <div className="relative mt-12 pl-10 md:pl-40">
            <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-border/20 md:left-24" />

            <div className="grid gap-6">
              {EXPERIENCE.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative ml-auto w-full rounded-[30px] border border-white/5 bg-card/85 p-7 shadow-2xl md:w-[calc(100%-90px)] md:p-8"
                >
                  <div className="absolute -left-8 top-16 h-5 w-5 rounded-full bg-primary shadow-[0_0_0_8px_rgba(34,197,94,0.12),0_0_0_18px_rgba(34,197,94,0.04)] md:-left-[102px] md:h-6 md:w-6" />
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-3xl font-bold tracking-[-0.04em]">{item.title}</h4>
                      <p className="mt-3 font-mono text-2xl text-primary">{item.company}</p>
                    </div>
                    <div className="space-y-2 font-mono text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {item.period}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 text-primary">▹</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="models" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="max-w-[860px]">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Independent Work</p>
            <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4.6rem)] font-extrabold tracking-[-0.06em]">
              Selected models, market studies, and execution frameworks.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PROJECTS.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="terminal-panel rounded-[30px] p-7"
              >
                <h3 className="text-3xl font-bold tracking-[-0.04em]">{project.title}</h3>
                <p className="mt-3 font-mono text-lg text-primary">{project.label}</p>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{project.copy}</p>
                <ul className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-1 text-primary">▹</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 font-mono text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-6 px-4 pt-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="terminal-panel rounded-[30px] p-7">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Education</p>
            <div className="mt-6 space-y-8">
              {EDUCATION.map((item) => (
                <article key={item.degree} className="border-t border-border/30 pt-6 first:border-t-0 first:pt-0">
                  <h3 className="text-2xl font-bold tracking-[-0.04em]">{item.degree}</h3>
                  <p className="mt-2 text-lg text-muted-foreground">{item.institution}</p>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">
                    {item.location} · {item.date}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.courses}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="terminal-panel rounded-[30px] p-7">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Specialized Skills</p>
            <div className="mt-6 space-y-6">
              {SPECIALIZED_SKILLS.map((block) => (
                <article key={block.title}>
                  <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-primary">{block.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{block.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="network" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="max-w-[900px]">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">GitHub Integration</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,4.4rem)] font-extrabold tracking-[-0.06em]">
              Recent public repositories from <span className="text-primary">@DhirenRawal</span>
            </h2>
          </div>

          <div className="terminal-panel mt-10 rounded-[30px] p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[760px] text-lg leading-relaxed text-muted-foreground">
                The site pulls directly from GitHub so your public work stays current without manually rewriting project cards every time.
              </p>
              <a
                href="https://github.com/DhirenRawal"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-base text-primary transition-colors hover:text-white"
              >
                Open GitHub Profile
              </a>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {repos.map((repo) => (
                <article key={repo.id} className="rounded-[24px] border border-white/5 bg-background/50 p-6">
                  <h3 className="text-2xl font-bold tracking-[-0.04em]">{repo.name}</h3>
                  <p className="mt-3 font-mono text-sm text-muted-foreground">
                    {repo.language || "Code"} · {repo.stargazers_count} stars · Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {repo.description || "Public project pulled directly from GitHub."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 font-medium text-primary"
                    >
                      Repository
                    </a>
                    {repo.homepage ? (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 font-medium text-primary"
                      >
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">{githubStatus}</p>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="terminal-panel rounded-[30px] p-7">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Contact</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,4rem)] font-extrabold tracking-[-0.06em]">
              Let’s connect on credit, quant finance, or trading opportunities.
            </h2>

            <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-[620px]">
                <p className="text-3xl font-bold tracking-[-0.04em]">Dhiren Rawal</p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Based in San Diego and open to opportunities across trading, quantitative research, fixed income, and risk analytics.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:dhiren.rawal2001@gmail.com"
                  className="inline-flex min-h-[54px] items-center rounded-2xl border border-primary/20 bg-primary/5 px-5 font-medium text-primary"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/dhirenrawal9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[54px] items-center rounded-2xl border border-primary/20 bg-primary/5 px-5 font-medium text-primary"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/DhirenRawal"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[54px] items-center rounded-2xl border border-primary/20 bg-primary/5 px-5 font-medium text-primary"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-20px)] max-w-[1280px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-white/5 bg-background/90 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-5 border-b border-border/30 px-5 py-3">
          <div className="flex items-center gap-3 font-mono text-sm text-primary">
            <Wifi className="h-4 w-4" />
            LIVE FEED
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(["SPX", "NDX", "RTY", "VIX"] as const).map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => setActiveChart(symbol)}
                className={`rounded-xl border px-4 py-2 font-mono text-lg ${
                  activeChart === symbol
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[1200px] grid-cols-8">
            {tickers.slice(0, 8).map((ticker) => (
              <MarketCard key={ticker.symbol} ticker={ticker} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
