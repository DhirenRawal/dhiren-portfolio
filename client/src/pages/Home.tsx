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
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
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

const ROLE_ROTATION = [
  "Derivatives Pricer",
  "Algo Trader",
  "Volatility Modeler",
  "Credit Trading Analyst",
];

const STATS = [
  { value: "5+", label: "YRS EXP" },
  { value: "20+", label: "PROJECTS" },
  { value: "3", label: "DOMAINS" },
  { value: "A+", label: "FOCUS" },
];

const HERO_SKILLS = [
  "Python",
  "Black-Scholes",
  "GARCH",
  "Monte Carlo",
  "SQL",
  "VaR/CVaR",
  "Fixed Income",
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

const EDUCATION = [
  {
    degree: "Master of Quantitative Finance",
    institution: "Rady School of Management, University of California San Diego",
    location: "San Diego, CA",
    date: "Dec 2025",
    courses:
      "Derivatives & Structured Products, Advanced Risk Management, Fixed Income, and Financial Econometrics",
  },
  {
    degree: "Bachelor of Commerce",
    institution: "KJ Somaiya College of Science and Commerce",
    location: "Mumbai, India",
    date: "Apr 2022",
    courses: "Financial Accounting, Business Economics, Cost Accounts, and Management Accounts",
  },
];

const EXPERIENCE = [
  {
    title: "Operations and Finance Manager",
    company: "Mahalaxmi Enterprises",
    period: "Nov 2023 - Aug 2024",
    location: "Thane, India",
    bullets: [
      "Improved short-term liquidity forecasting accuracy by 10% by modeling cash flow volatility and stress-testing downside demand scenarios.",
      "Reduced operational risk incidents by 22% by identifying recurring variance shocks in high-volume transactions and tightening review controls.",
      "Streamlined operational workflows to reduce processing time by 15% while improving reporting consistency.",
    ],
  },
  {
    title: "Investment Banking Intern",
    company: "StartupLanes",
    period: "May 2023 - Nov 2023",
    location: "Goa, India",
    bullets: [
      "Built three-statement models with leverage, interest coverage, and refinancing stress cases to reduce downside valuation dispersion.",
      "Accelerated investment decision turnaround by 30% by consolidating sensitivities into a unified review dashboard.",
    ],
  },
  {
    title: "Operations Analyst",
    company: "Mahalaxmi Enterprises",
    period: "Jun 2022 - May 2023",
    location: "India",
    bullets: [
      "Improved delivery efficiency from 82% to 93% by segmenting products statistically and refining execution workflows.",
      "Cut fulfillment cycle time by 18-25% by isolating high-impact inefficiencies in noisy operational data.",
    ],
  },
];

const PROJECTS = [
  {
    title: "High Yield Relative Value & Risk Monitoring Engine",
    label: "Independent Project · Jan 2026 - Present",
    copy:
      "Built a live relative value monitor across 35 high-yield bonds spanning six sectors, with scenario analysis tied to spread duration, carry, and roll metrics.",
    bullets: [
      "Modeled OAS proxies, spread duration, and carry/roll under liquidity shocks.",
      "Simulated P&L under spread widening to decompose carry versus mark-to-market impact.",
    ],
    tags: ["Credit", "Relative Value", "Risk Monitoring"],
  },
  {
    title: "Fallen Angel Credit Dislocation Case Study",
    label: "Independent Project · Dec 2025",
    copy:
      "Quantified forced IG-to-HY index transition effects across liquid bonds by comparing spread widening and technical premium driven by ETF and mandate-based selling.",
    bullets: [
      "Estimated technical premium under forced-selling flows.",
      "Modeled spread DV01 and default sensitivity to highlight upside-to-downside asymmetry.",
    ],
    tags: ["HY Credit", "Event Study", "Spread DV01"],
  },
  {
    title: "Market Making and Execution Simulation",
    label: "Independent Project · Sep 2025",
    copy:
      "Built a market-making simulator with inventory-aware bid/ask quoting, hard and soft risk limits, and execution-driven P&L attribution.",
    bullets: [
      "Modeled a limit order book and market-making inventory risk controls.",
      "Corrected an execution model flaw that originally produced artificial zero-variance P&L.",
    ],
    tags: ["Execution", "Inventory Risk", "P&L Attribution"],
  },
];

const SPECIALIZED_SKILLS = [
  {
    title: "Tools",
    text:
      "Bloomberg Terminal, YAS, SRCH, Python, pandas, NumPy, SQL, advanced Excel, scenario analysis, dashboards, VBA, and time-series workflows.",
  },
  {
    title: "Credit & Fixed Income",
    text:
      "Spread analytics, OAS proxy estimation, spread duration, carry and roll-down return, credit relative value, capital structure analysis, and fallen angel dynamics.",
  },
  {
    title: "Risk & Markets",
    text:
      "Scenario stress testing, liquidity analysis, inventory risk management, default probability estimation, P&L attribution, and sector dispersion tracking.",
  },
];

const INITIAL_TICKERS: Ticker[] = [
  { symbol: "VIX", name: "Volatility", price: 14.25, changePercent: -3.08 },
  { symbol: "NVDA", name: "NVIDIA", price: 874.56, changePercent: 2.02 },
  { symbol: "AAPL", name: "Apple", price: 178.25, changePercent: -0.5 },
  { symbol: "TSLA", name: "Tesla", price: 201.52, changePercent: 3.11 },
  { symbol: "MSFT", name: "Microsoft", price: 420.47, changePercent: 1.48 },
  { symbol: "BTC-USD", name: "Bitcoin", price: 64195, changePercent: 4.15 },
  { symbol: "^TNX", name: "10Y Treasury", price: 4.21, changePercent: 1.19 },
  { symbol: "CL=F", name: "Crude Oil", price: 78.27, changePercent: -1.27 },
  { symbol: "SPX", name: "S&P 500", price: 5111.32, changePercent: 0.04 },
  { symbol: "NDX", name: "Nasdaq 100", price: 17939.6, changePercent: 1.58 },
];

function formatPrice(value: number) {
  return value >= 1000 ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toFixed(2);
}

function MarketCard({ ticker }: { ticker: Ticker }) {
  const positive = ticker.changePercent >= 0;

  return (
    <div className="min-w-[178px] border-l border-border/30 px-5 py-4 first:border-l-0">
      <div className="font-mono text-sm font-bold text-foreground">{ticker.symbol}</div>
      <div className="mt-1 font-mono text-[11px] text-muted-foreground/65">{ticker.name}</div>
      <div className="mt-3 font-mono text-[1.65rem] font-bold leading-none text-foreground">{formatPrice(ticker.price)}</div>
      <div
        className={`mt-3 flex items-center gap-1 font-mono text-sm font-bold ${
          positive ? "text-primary" : "text-destructive"
        }`}
      >
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
  const [repos, setRepos] = useState<Repo[]>([]);
  const [githubStatus, setGithubStatus] = useState("Loading repositories...");

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
          const priceDrift = (Math.random() - 0.5) * (ticker.price > 1000 ? 12 : ticker.symbol === "BTC-USD" ? 220 : 1.2);
          const changeDrift = (Math.random() - 0.5) * 0.2;

          return {
            ...ticker,
            price: Math.max(0.01, ticker.price + priceDrift),
            changePercent: ticker.changePercent + changeDrift,
          };
        })
      );
    }, 1200);

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
          `Unable to load GitHub repositories right now. ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    loadRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-background pt-28 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[8%] h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute right-[6%] top-[14%] h-80 w-80 rounded-full bg-secondary/10 blur-[160px]" />
        <div className="absolute left-[18%] top-[38%] h-6 w-6 rounded-full bg-primary shadow-[0_0_28px_rgba(34,197,94,0.55)]" />
        <div className="absolute right-[16%] top-[56%] h-5 w-5 rounded-full bg-primary shadow-[0_0_30px_rgba(34,197,94,0.55)]" />
      </div>

      <div className="terminal-grid pointer-events-none absolute inset-0 opacity-40" />

      <main className="relative z-10 pb-44">
        <section id="terminal" className="mx-auto min-h-[calc(100svh-110px)] max-w-[1280px] px-4 pb-14">
          <div className="terminal-panel relative overflow-hidden rounded-[40px] px-6 pb-14 pt-20 md:px-12 md:pb-16 md:pt-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_76%_18%,rgba(34,197,94,0.07),transparent_24%),linear-gradient(135deg,rgba(6,40,25,0.28),transparent_44%)]" />

            <div className="relative z-10 flex justify-center">
              <div className="inline-flex min-h-[58px] items-center rounded-full border border-primary/30 bg-primary/10 px-7 font-mono text-sm text-primary">
                ● Open to roles · April 2026 ●
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-10 grid max-w-[1120px] gap-10">
              <div className="mx-auto flex w-full max-w-[520px] justify-center">
                <div className="terminal-orbit relative aspect-square w-full max-w-[380px] rounded-full p-4 md:max-w-[430px]">
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

                <p className="mt-5 font-mono text-[0.92rem] uppercase tracking-[0.32em] text-muted-foreground/60">
                  MQF · UCSD RADY SCHOOL OF MANAGEMENT · NEW YORK
                </p>

                <div className="mx-auto mt-8 flex max-w-[560px] items-center justify-center gap-4">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <p className="font-mono text-[clamp(1.3rem,2.4vw,1.95rem)] text-primary">
                    {typedRole}
                    <span className="animate-pulse">█</span>
                  </p>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                </div>

                <p className="mx-auto mt-8 max-w-[840px] text-[clamp(1.08rem,1.9vw,1.5rem)] leading-relaxed text-muted-foreground">
                  Building automated trading systems, volatility surface calibrators, and fixed income analytics
                  pipelines where rigorous mathematics meets production-grade code.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                  <a
                    href="/#models"
                    className="inline-flex min-h-[78px] items-center justify-center rounded-[24px] bg-primary px-10 text-[clamp(1.1rem,2vw,1.45rem)] font-bold text-primary-foreground shadow-[0_0_30px_rgba(34,197,94,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    View Projects <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="/Dhiren_Rawal_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[78px] items-center justify-center rounded-[24px] border border-primary/25 bg-background/60 px-10 text-[clamp(1rem,1.8vw,1.3rem)] font-bold text-primary transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <FileDown className="mr-3 h-5 w-5" />
                    Download CV
                  </a>
                </div>

                <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-2 overflow-hidden rounded-[28px] border border-border/40 bg-background/35 md:grid-cols-4">
                  {STATS.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`px-5 py-7 ${index > 0 ? "border-l border-border/30" : ""} ${
                        index > 1 ? "border-t border-border/30 md:border-t-0" : ""
                      }`}
                    >
                      <div className="text-[clamp(2rem,4vw,3rem)] font-extrabold">{stat.value}</div>
                      <div className="mt-2 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground/50">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mx-auto mt-10 flex max-w-[980px] flex-wrap items-center justify-center gap-3">
                  {HERO_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/15 bg-primary/5 px-5 py-3 font-mono text-sm text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[1280px] px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="terminal-panel relative overflow-hidden rounded-[36px] px-6 py-12 md:px-10 md:py-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_70%,rgba(34,197,94,0.08),transparent_22%)]" />

            <div className="relative z-10 text-center">
              <h2 className="text-[clamp(2.5rem,5vw,4.8rem)] font-extrabold tracking-[-0.06em]">
                About <span className="text-primary">Me</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[760px] text-[clamp(1.05rem,1.8vw,1.4rem)] text-muted-foreground">
                The person behind the models and the code.
              </p>
            </div>

            <div className="relative z-10 mt-12 grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="order-2 lg:order-1">
                <p className="text-[1.1rem] leading-relaxed text-muted-foreground md:text-[1.2rem]">
                  I’m a quantitative finance graduate student focused on derivatives, structured products, fixed income,
                  and market microstructure. My work sits at the intersection of financial reasoning, risk analytics,
                  and production-ready systems.
                </p>
                <p className="mt-6 text-[1.1rem] leading-relaxed text-muted-foreground md:text-[1.2rem]">
                  My background bridges both the operational and analytical sides of finance, from managing liquidity
                  forecasting at a family enterprise to building automated volatility surface calibration tools and
                  execution models from scratch.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 font-mono text-[1.05rem] text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    New York, NY
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[1.05rem] text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary" />
                    dhiren.rawal2001@gmail.com
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[1.05rem] text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary" />
                    +1 (858) 214-0637
                  </div>
                </div>

                <div className="mt-9">
                  <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted-foreground/70">Core Expertise</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {CORE_EXPERTISE.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-primary/20 bg-primary/5 px-4 py-3 font-mono text-sm text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-3 rounded-[22px] border border-primary/15 bg-primary/10 px-5 py-4 font-mono text-[1.08rem] text-foreground">
                  <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_rgba(34,197,94,0.7)]" />
                  Open to full-time opportunities starting <span className="text-primary">April 2026</span>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative mx-auto max-w-[430px] rounded-[32px] border border-primary/20 bg-gradient-to-b from-primary/10 to-background/30 p-4 shadow-[0_0_0_1px_rgba(74,222,128,0.08),0_30px_100px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-1">
                  <div className="absolute right-3 top-6 rounded-full border border-primary/20 bg-background px-4 py-3 font-mono text-base text-foreground shadow-xl md:-right-4 md:top-8 md:px-5 md:text-lg">
                    Class of 2025
                  </div>
                  <img
                    src="/dhiren-portrait.png"
                    alt="Dhiren Rawal portrait"
                    className="h-[480px] w-full rounded-[26px] object-cover object-top shadow-[0_0_45px_rgba(34,197,94,0.14)] md:h-[580px]"
                  />
                  <div className="absolute inset-x-10 bottom-10 rounded-[24px] bg-gradient-to-t from-[rgba(5,10,16,0.92)] to-transparent px-5 pb-2 pt-14">
                    <p className="text-[2rem] font-bold tracking-[-0.05em]">Dhiren Rawal</p>
                    <p className="mt-2 font-mono text-lg text-primary">MQF Candidate · UCSD Rady</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="trajectory" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="text-center">
            <h2 className="text-[clamp(2.4rem,4.8vw,4.8rem)] font-extrabold tracking-[-0.06em]">
              Career <span className="text-primary">Trajectory</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[clamp(1.02rem,1.8vw,1.35rem)] text-muted-foreground">
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
            <div className="absolute bottom-4 left-3 top-4 w-px bg-gradient-to-b from-primary/35 via-primary/10 to-border/20 md:left-24" />

            <div className="grid gap-6">
              {EXPERIENCE.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative ml-auto w-full rounded-[30px] border border-white/5 bg-card/85 p-7 shadow-2xl transition-transform duration-300 hover:-translate-y-1 md:w-[calc(100%-90px)] md:p-8"
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
          <div className="max-w-[920px]">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Selected Work</p>
            <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4.6rem)] font-extrabold tracking-[-0.06em]">
              Models, market studies, and execution frameworks.
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
                className="terminal-panel rounded-[30px] p-7 transition-transform duration-300 hover:-translate-y-1"
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
                    <span
                      key={tag}
                      className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 font-mono text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="terminal-panel rounded-[30px] p-7">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Education</p>
              </div>
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
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Technical & Market Stack</p>
              <div className="mt-6 space-y-6">
                {SPECIALIZED_SKILLS.map((block) => (
                  <article key={block.title}>
                    <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-primary">{block.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{block.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="network" className="mx-auto max-w-[1280px] px-4 pt-24">
          <div className="max-w-[900px]">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">Network</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,4.4rem)] font-extrabold tracking-[-0.06em]">
              Recent public repositories from <span className="text-primary">@DhirenRawal</span>
            </h2>
          </div>

          <div className="terminal-panel mt-10 rounded-[30px] p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[760px] text-lg leading-relaxed text-muted-foreground">
                This section pulls directly from GitHub so your public work stays current without manually updating each
                project card.
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
                <article
                  key={repo.id}
                  className="rounded-[24px] border border-white/5 bg-background/50 p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold tracking-[-0.04em]">{repo.name}</h3>
                  <p className="mt-3 font-mono text-sm text-muted-foreground">
                    {repo.language || "Code"} · {repo.stargazers_count} stars · Updated{" "}
                    {new Date(repo.updated_at).toLocaleDateString()}
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
          <div className="terminal-panel rounded-[34px] px-6 py-10 md:px-10 md:py-12">
            <div className="max-w-[980px]">
              <h2 className="text-[clamp(2.5rem,5vw,4.8rem)] font-extrabold tracking-[-0.06em]">
                Initialize <span className="text-primary">Connection</span>
              </h2>
              <p className="mt-5 max-w-[920px] text-[clamp(1.08rem,1.8vw,1.3rem)] leading-relaxed text-muted-foreground">
                Currently open to full-time Quantitative Finance and Trading opportunities starting April 2026. Let’s
                discuss how my analytical skill set can contribute to your firm’s edge.
              </p>
            </div>

            <div className="mt-10 grid max-w-[860px] gap-5">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "dhiren.rawal2001@gmail.com",
                  href: "mailto:dhiren.rawal2001@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+1 (858) 214-0637",
                  href: "tel:+18582140637",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "New York, NY / San Diego, CA",
                },
              ].map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-center gap-5 rounded-[24px] border border-white/5 bg-background/45 px-5 py-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[22px] border border-primary/25 bg-primary/10 text-primary">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground/70">{item.label}</p>
                      <p className="mt-2 text-[clamp(1.15rem,2vw,1.8rem)] font-medium tracking-[-0.03em] text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://www.linkedin.com/in/dhirenrawal9"
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/25 bg-primary/5 text-primary transition-transform duration-300 hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-7 w-7" />
              </a>
              <a
                href="https://github.com/DhirenRawal"
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/25 bg-primary/5 text-primary transition-transform duration-300 hover:-translate-y-1"
                aria-label="GitHub"
              >
                <Github className="h-7 w-7" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-18px)] max-w-[1280px] -translate-x-1/2 overflow-hidden rounded-[24px] border border-white/5 bg-background/90 shadow-2xl backdrop-blur-xl">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 border-r border-border/30 px-5 py-4 font-mono text-sm text-primary">
            <Wifi className="h-4 w-4" />
            LIVE
          </div>
          {tickers.map((ticker) => (
            <MarketCard key={ticker.symbol} ticker={ticker} />
          ))}
        </div>
      </div>
    </div>
  );
}
