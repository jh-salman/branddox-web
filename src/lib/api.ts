/**
 * Branddox backend API client.
 * Server-side and non-admin: uses NEXT_PUBLIC_API_BASE_URL or backend URL.
 * Browser (admin): uses same-origin proxy /api/admin/backend so CORS is not needed.
 */
function getApiBase(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/admin/backend`;
  }
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
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
  clientId?: string | null;
  youtubeVideoId?: string | null;
};

/** Matches backend POST /portfolio (Zod createSchema): required category, imageUrl; optional title, aspectClass, width, height */
export type CreatePortfolioBody = {
  title?: string;
  category: string;
  imageUrl: string;
  aspectClass?: "tall" | "square" | "wide" | "xtall";
  width?: number;
  height?: number;
  clientId?: string | null;
  youtubeVideoId?: string | null;
};

export type YoutubeVideoThumbRow = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
};

export type YoutubeThumbnailsPreviewResponse = {
  dryRun: true;
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  videos: YoutubeVideoThumbRow[];
};

export type YoutubeThumbnailsImportResponse = {
  dryRun: false;
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  videos: YoutubeVideoThumbRow[];
  created: PortfolioItem[];
  skipped: number;
  imported: number;
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
  slug: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  logoUrl?: string;
  subscriberCount?: string;
  description?: string;
  sortOrder?: number;
};

export type CreateClientBody = {
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  logoUrl?: string;
  subscriberCount?: string;
  description?: string;
  sortOrder?: number;
  slug?: string;
};

/** POST /clients/resolve-youtube — admin; returns Cloudinary URLs for logo + banner */
export type YoutubeClientResolved = {
  channelName: string;
  channelUrl: string;
  subscriberCount?: string;
  description?: string;
  logoUrl: string;
  imageUrl: string;
};

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const base = API_BASE.replace(/\/$/, "");
  const pathStr = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${pathStr}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    ...init,
    credentials: typeof window !== "undefined" ? "include" : init.credentials,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const err = isJson
      ? ((await res.json().catch(() => ({}))) as { error?: string; message?: string; details?: Record<string, string[]> })
      : {};
    const msg = err.message || err.error || res.statusText || "Request failed";
    const detail = err.details
      ? " " + Object.entries(err.details).map(([k, v]) => `${k}: ${(v ?? []).join(", ")}`).join("; ")
      : "";
    if (!isJson) {
      const text = await res.text().catch(() => "");
      if (text.startsWith("<")) throw new Error(`${msg} (server returned HTML, not JSON)`);
    }
    throw new Error(msg + (detail ? detail : ""));
  }
  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${contentType || "unknown"}${text.startsWith("<") ? " (HTML)" : ""}`);
  }
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

  /** GET /portfolio – list (optional filter by client) */
  getPortfolio(params?: { clientId?: string; clientSlug?: string }) {
    const q: Record<string, string> = {};
    if (params?.clientId) q.clientId = params.clientId;
    if (params?.clientSlug) q.clientSlug = params.clientSlug;
    return request<PortfolioItem[]>(
      "/portfolio",
      Object.keys(q).length ? { params: q } : undefined
    );
  },

  /** GET /portfolio/:id */
  getPortfolioItem(id: string) {
    return request<PortfolioItem>(`/portfolio/${id}`);
  },

  /** POST /portfolio – create (imageUrl = Cloudinary URL from upload) */
  createPortfolioItem(body: CreatePortfolioBody) {
    return request<PortfolioItem>("/portfolio", { method: "POST", body: JSON.stringify(body) });
  },

  /**
   * POST /portfolio/youtube-thumbnails (admin)
   * dryRun true = preview only; false = import as Thumbnails (stores youtubeVideoId for dedupe).
   */
  youtubePortfolioThumbnails(body: {
    channelUrl: string;
    clientId?: string | null;
    maxResults?: number;
    dryRun: boolean;
  }) {
    return request<YoutubeThumbnailsPreviewResponse | YoutubeThumbnailsImportResponse>(
      "/portfolio/youtube-thumbnails",
      { method: "POST", body: JSON.stringify(body) }
    );
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

  /** GET /clients/by-slug/:slug – public channel profile */
  getClientBySlug(slug: string) {
    return request<ClientItem>(`/clients/by-slug/${encodeURIComponent(slug)}`);
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

  /** POST /clients/resolve-youtube — fetch channel + upload images to Cloudinary (admin). */
  resolveYoutubeClient(body: { channelUrl: string }) {
    return request<YoutubeClientResolved>("/clients/resolve-youtube", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** POST /upload – upload portfolio image; returns { url } (Cloudinary URL). */
  async uploadPortfolioImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.set("image", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
      credentials: typeof window !== "undefined" ? "include" : undefined,
      // Do not set Content-Type; browser sets multipart boundary
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || res.statusText || "Upload failed");
    }
    return res.json() as Promise<{ url: string }>;
  },
};
