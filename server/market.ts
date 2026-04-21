type MarketQuoteConfig = {
  sourceSymbol: string;
  symbol: string;
  name: string;
  category: string;
  decimals: number;
};

type YahooSparkQuote = {
  close?: Array<number | null>;
};

type YahooSparkMeta = {
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  regularMarketTime?: number;
  exchangeTimezoneName?: string;
  timezone?: string;
};

type YahooSparkResult = {
  symbol: string;
  response?: Array<{
    meta?: YahooSparkMeta;
    indicators?: {
      quote?: YahooSparkQuote[];
    };
  }>;
};

export type MarketSnapshot = {
  symbol: string;
  rawSymbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  decimals: number;
  source: "Yahoo Finance";
  marketTime: number | null;
  exchangeTimezoneName: string | null;
  timezone: string | null;
};

const YAHOO_SPARK_URL = "https://query1.finance.yahoo.com/v7/finance/spark";
const CACHE_TTL_MS = 45_000;

const MARKET_QUOTE_CONFIG: MarketQuoteConfig[] = [
  { sourceSymbol: "^GSPC", symbol: "SPX", name: "S&P 500", category: "Index", decimals: 2 },
  { sourceSymbol: "^NDX", symbol: "NDX", name: "Nasdaq 100", category: "Index", decimals: 2 },
  { sourceSymbol: "^RUT", symbol: "RUT", name: "Russell 2000", category: "Index", decimals: 2 },
  { sourceSymbol: "^VIX", symbol: "VIX", name: "Volatility Index", category: "Index", decimals: 2 },
  { sourceSymbol: "NVDA", symbol: "NVDA", name: "NVIDIA", category: "Equity", decimals: 2 },
  { sourceSymbol: "AAPL", symbol: "AAPL", name: "Apple", category: "Equity", decimals: 2 },
  { sourceSymbol: "TSLA", symbol: "TSLA", name: "Tesla", category: "Equity", decimals: 2 },
  { sourceSymbol: "MSFT", symbol: "MSFT", name: "Microsoft", category: "Equity", decimals: 2 },
  { sourceSymbol: "GC=F", symbol: "GC=F", name: "Gold Futures", category: "Futures", decimals: 2 },
  { sourceSymbol: "BTC-USD", symbol: "BTC-USD", name: "Bitcoin", category: "Crypto", decimals: 0 },
  { sourceSymbol: "^TNX", symbol: "^TNX", name: "10Y Treasury", category: "Rates", decimals: 3 },
  { sourceSymbol: "CL=F", symbol: "CL=F", name: "Crude Oil", category: "Futures", decimals: 2 },
];

let cachedSnapshot: MarketSnapshot[] | null = null;
let cachedAt = 0;

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getLatestClose(result: YahooSparkResult) {
  const closeSeries = result.response?.[0]?.indicators?.quote?.[0]?.close ?? [];

  for (let index = closeSeries.length - 1; index >= 0; index -= 1) {
    const value = closeSeries[index];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function mapSparkResult(config: MarketQuoteConfig, result: YahooSparkResult | undefined): MarketSnapshot | null {
  const meta = result?.response?.[0]?.meta;
  if (!meta) return null;

  const latestClose = getLatestClose(result);
  const price = latestClose ?? meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose;

  if (typeof price !== "number" || !Number.isFinite(price) || typeof previousClose !== "number" || !Number.isFinite(previousClose)) {
    return null;
  }

  const change = price - previousClose;
  const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;

  return {
    symbol: config.symbol,
    rawSymbol: config.sourceSymbol,
    name: config.name,
    category: config.category,
    price: round(price, config.decimals),
    change: round(change, config.decimals),
    changePercent: round(changePercent, 2),
    decimals: config.decimals,
    source: "Yahoo Finance",
    marketTime: meta.regularMarketTime ?? null,
    exchangeTimezoneName: meta.exchangeTimezoneName ?? null,
    timezone: meta.timezone ?? null,
  };
}

export async function fetchMarketSnapshot() {
  if (cachedSnapshot && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedSnapshot;
  }

  const symbols = MARKET_QUOTE_CONFIG.map((item) => item.sourceSymbol).join(",");
  const url = new URL(YAHOO_SPARK_URL);
  url.searchParams.set("symbols", symbols);
  url.searchParams.set("range", "1d");
  url.searchParams.set("interval", "1d");
  url.searchParams.set("indicators", "close");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; DhirenPortfolio/1.0; +https://github.com/DhirenRawal/dhiren-portfolio)",
    },
  });

  if (!response.ok) {
    if (cachedSnapshot) return cachedSnapshot;
    throw new Error(`Yahoo Finance spark request failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    spark?: {
      result?: YahooSparkResult[];
    };
  };

  const resultMap = new Map((payload.spark?.result ?? []).map((item) => [item.symbol, item]));
  const snapshot = MARKET_QUOTE_CONFIG.map((config) => mapSparkResult(config, resultMap.get(config.sourceSymbol))).filter(
    (quote): quote is MarketSnapshot => quote !== null,
  );

  if (snapshot.length === 0) {
    if (cachedSnapshot) return cachedSnapshot;
    throw new Error("Yahoo Finance returned no usable quotes");
  }

  cachedSnapshot = snapshot;
  cachedAt = Date.now();

  return snapshot;
}
