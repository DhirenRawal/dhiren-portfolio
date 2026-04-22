import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertContactMessage } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
const MARKET_CACHE_KEY = "portfolio.market.quotes.v1";

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function readCachedMarketData() {
  if (typeof window === "undefined") return undefined;

  try {
    const cached = window.localStorage.getItem(MARKET_CACHE_KEY);
    if (!cached) return undefined;

    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedMarketData(data: unknown) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures and continue with in-memory query data.
  }
}

// GET /api/profile
export function useProfile() {
  return useQuery({
    queryKey: [api.profile.get.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.profile.get.path));
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profile.get.responses[200].parse(await res.json());
    },
  });
}

// GET /api/experience
export function useExperience() {
  return useQuery({
    queryKey: [api.experience.list.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.experience.list.path));
      if (!res.ok) throw new Error("Failed to fetch experience");
      return api.experience.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/education
export function useEducation() {
  return useQuery({
    queryKey: [api.education.list.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.education.list.path));
      if (!res.ok) throw new Error("Failed to fetch education");
      return api.education.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/projects
export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.projects.list.path));
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/skills
export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.skills.list.path));
      if (!res.ok) throw new Error("Failed to fetch skills");
      return api.skills.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/market
export function useMarketData() {
  return useQuery({
    queryKey: [api.market.list.path],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(api.market.list.path));
      if (!res.ok) throw new Error("Failed to fetch market data");
      const data = api.market.list.responses[200].parse(await res.json());
      writeCachedMarketData(data);
      return data;
    },
    initialData: readCachedMarketData,
    staleTime: 15_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    retry: 3,
    retryDelay: (attempt) => Math.min(1_500 * attempt, 6_000),
  });
}

// POST /api/contact
export function useContact() {
  return useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const validated = api.contact.submit.input.parse(data);

      const url = buildApiUrl(api.contact.submit.path);
      console.log("Submitting contact form to:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contact.submit.responses[400].parse(await res.json());
          throw new Error(error.message);
        }

        try {
          const errorPayload = (await res.json()) as { message?: string };
          throw new Error(errorPayload.message || `Failed to send message (${res.status})`);
        } catch {
          const errorText = await res.text().catch(() => "");
          throw new Error(`Failed to send message (${res.status}) ${errorText}`);
        }
      }

      return api.contact.submit.responses[201].parse(await res.json());
    },
  });
}
