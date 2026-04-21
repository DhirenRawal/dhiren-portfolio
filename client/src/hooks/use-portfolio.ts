import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertContactMessage } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
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
      return api.market.list.responses[200].parse(await res.json());
    },
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: 1,
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

        const errorText = await res.text().catch(() => "");
        throw new Error(`Failed to send message (${res.status}) ${errorText}`);
      }

      return api.contact.submit.responses[201].parse(await res.json());
    },
  });
}
