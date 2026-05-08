type GtagParams = Record<string, string | number | boolean | null | undefined>;

interface Gtag {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, config?: GtagParams): void;
  (command: "event", eventName: string, params?: GtagParams): void;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

let initialized = false;

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || initialized || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  }) as Gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  script.dataset.analytics = "ga4";
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  initialized = true;
}

export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  initAnalytics();
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(eventName: string, params: GtagParams = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  initAnalytics();
  window.gtag?.("event", eventName, params);
}
