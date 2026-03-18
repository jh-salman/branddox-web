/**
 * Branddox backend API client.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://localhost:4000 or https://branddox-api.vercel.app).
 * No trailing slash. On production (vercel.app), uses branddox-api.vercel.app if env is localhost or unset.
 */
function getApiBase(): string {
  let raw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  if (typeof window !== "undefined") {
    const isProd = window.location.hostname.includes("vercel.app");
    const isLocalhostApi = !raw || raw.startsWith("http://localhost") || raw.startsWith("http://127.0.0.1");
    if (isProd && isLocalhostApi) raw = "https://branddox-api.vercel.app";
  }
  return raw.replace(/\/$/, "");
}

const API_BASE = getApiBase();

export { API_BASE };

export type Lead = {
  id: string;
  createdAt: string;
  name: string | null;
  email: string;
  channelUrl: string;
  leadSource: string;
  service: string | null;
  message: string | null;
  status: string;
  emailRepliedAt: string | null;
};

export type LeadStats = {
  total: number;
  replied: number;
  notReplied: number;
  bySource: { source: string; count: number }[];
};

export type CreateLeadBody = {
  name?: string | null;
  email: string;
  channelUrl: string;
  leadSource: string;
  service?: string | null;
  message?: string | null;
};

export type PortfolioItem = {
  id: string;
  title?: string | null;
  category: string;
  imageUrl: string;
  aspectClass: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
};

/** Matches backend POST /portfolio (Zod createSchema): required category, imageUrl; optional title, aspectClass, width, height */
export type CreatePortfolioBody = {
  title?: string;
  category: string;
  imageUrl: string;
  aspectClass?: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  benefit: string;
  sortOrder?: number;
};

export type CreateServiceBody = {
  title: string;
  description: string;
  benefit: string;
  sortOrder?: number;
};

export type ClientItem = {
  id: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  subscriberCount?: string;
  description?: string;
  sortOrder?: number;
};

export type CreateClientBody = {
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  subscriberCount?: string;
  description?: string;
  sortOrder?: number;
};

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      details?: Record<string, string[]>;
    };
    const msg = err.message || err.error || res.statusText || "Request failed";
    const detail = err.details
      ? " " + Object.entries(err.details).map(([k, v]) => `${k}: ${(v ?? []).join(", ")}`).join("; ")
      : "";
    throw new Error(msg + (detail ? detail : ""));
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  /** GET /leads - list with optional filters */
  getLeads(params?: { limit?: number; offset?: number; status?: string; leadSource?: string; replied?: "true" | "false" }) {
    const q: Record<string, string> = {};
    if (params?.limit != null) q.limit = String(params.limit);
    if (params?.offset != null) q.offset = String(params.offset);
    if (params?.status) q.status = params.status;
    if (params?.leadSource) q.leadSource = params.leadSource;
    if (params?.replied) q.replied = params.replied;
    return request<{ items: Lead[]; total: number }>("/leads", { params: q });
  },

  /** GET /leads/stats */
  getLeadStats() {
    return request<LeadStats>("/leads/stats");
  },

  /** GET /leads/:id */
  getLead(id: string) {
    return request<Lead>(`/leads/${id}`);
  },

  /** POST /leads */
  createLead(body: CreateLeadBody) {
    return request<Lead>("/leads", { method: "POST", body: JSON.stringify(body) });
  },

  /** PATCH /leads/:id */
  updateLead(id: string, body: { emailRepliedAt?: string | null; status?: string }) {
    return request<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  /** DELETE /leads/:id */
  deleteLead(id: string) {
    return request<void>(`/leads/${id}`, { method: "DELETE" });
  },

  /** POST /auth/login */
  login(email: string, password: string) {
    return request<{ user: { id: string; email: string; name: string | null } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /** POST /auth/register */
  register(body: { email: string; password: string; name?: string }) {
    return request<{ id: string; email: string; name: string | null }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /portfolio – list all (from database) */
  getPortfolio() {
    return request<PortfolioItem[]>("/portfolio");
  },

  /** GET /portfolio/:id */
  getPortfolioItem(id: string) {
    return request<PortfolioItem>(`/portfolio/${id}`);
  },

  /** POST /portfolio – create (imageUrl = Cloudinary URL from upload) */
  createPortfolioItem(body: CreatePortfolioBody) {
    return request<PortfolioItem>("/portfolio", { method: "POST", body: JSON.stringify(body) });
  },

  /** PATCH /portfolio/:id */
  updatePortfolioItem(id: string, body: Partial<PortfolioItem>) {
    return request<PortfolioItem>(`/portfolio/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  /** DELETE /portfolio/:id */
  deletePortfolioItem(id: string) {
    return request<void>(`/portfolio/${id}`, { method: "DELETE" });
  },

  /** GET /services */
  getServices() {
    return request<ServiceItem[]>("/services");
  },

  /** GET /services/:id */
  getService(id: string) {
    return request<ServiceItem>(`/services/${id}`);
  },

  /** POST /services */
  createService(body: CreateServiceBody) {
    return request<ServiceItem>("/services", { method: "POST", body: JSON.stringify(body) });
  },

  /** PATCH /services/:id */
  updateService(id: string, body: Partial<CreateServiceBody>) {
    return request<ServiceItem>(`/services/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  /** DELETE /services/:id */
  deleteService(id: string) {
    return request<void>(`/services/${id}`, { method: "DELETE" });
  },

  /** GET /clients */
  getClients() {
    return request<ClientItem[]>("/clients");
  },

  /** GET /clients/:id */
  getClient(id: string) {
    return request<ClientItem>(`/clients/${id}`);
  },

  /** POST /clients */
  createClient(body: CreateClientBody) {
    return request<ClientItem>("/clients", { method: "POST", body: JSON.stringify(body) });
  },

  /** PATCH /clients/:id */
  updateClient(id: string, body: Partial<CreateClientBody>) {
    return request<ClientItem>(`/clients/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  /** DELETE /clients/:id */
  deleteClient(id: string) {
    return request<void>(`/clients/${id}`, { method: "DELETE" });
  },

  /** POST /upload – upload portfolio image; returns { url } (Cloudinary URL). */
  async uploadPortfolioImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.set("image", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
      // Do not set Content-Type; browser sets multipart boundary
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || res.statusText || "Upload failed");
    }
    return res.json() as Promise<{ url: string }>;
  },
};
