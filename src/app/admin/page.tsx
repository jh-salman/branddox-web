"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/portfolio-types";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-types";
import { api, API_BASE } from "@/lib/api";
import type { ServiceItem, ClientItem, YoutubeClientResolved } from "@/lib/api";

const CATEGORIES = PORTFOLIO_CATEGORIES;

/** Auto size & ratio per category (Thumbnail, Logo, Banner, Brand Kit) */
const CATEGORY_PRESETS: Record<
  (typeof CATEGORIES)[number],
  { aspectClass: PortfolioItem["aspectClass"]; width: number; height: number }
> = {
  Thumbnails: { aspectClass: "wide", width: 1280, height: 720 },
  Logo: { aspectClass: "square", width: 800, height: 800 },
  "Art/Banner": { aspectClass: "wide", width: 2560, height: 1440 },
  "Brand Kit": { aspectClass: "square", width: 800, height: 800 },
};

const ASPECT_OPTIONS: { value: PortfolioItem["aspectClass"]; label: string }[] = [
  { value: "tall", label: "Tall (3:4)" },
  { value: "square", label: "Square (1:1)" },
  { value: "wide", label: "Wide (16:9)" },
  { value: "xtall", label: "Extra tall (3:5)" },
];

export default function AdminPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{
    title?: string;
    category: (typeof CATEGORIES)[number];
    imageUrl: string;
    aspectClass: PortfolioItem["aspectClass"];
    width: number;
    height: number;
    clientId: string;
  }>({
    category: "Thumbnails",
    imageUrl: "",
    aspectClass: "wide",
    width: 1280,
    height: 720,
    clientId: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PortfolioItem> & { width?: number | ""; height?: number | "" }>({});

  const [adminTab, setAdminTab] = useState<"portfolio" | "services" | "clients">("portfolio");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", benefit: "" });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<ServiceItem>>({});

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientForm, setClientForm] = useState({
    channelName: "",
    channelUrl: "",
    subscriberCount: "",
    description: "",
  });
  const [clientUploadFile, setClientUploadFile] = useState<File | null>(null);
  const [clientLogoUploadFile, setClientLogoUploadFile] = useState<File | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editClientLogoUploadFile, setEditClientLogoUploadFile] = useState<File | null>(null);
  const [editClientForm, setEditClientForm] = useState<Partial<ClientItem>>({});
  const [youtubeResolvedAdd, setYoutubeResolvedAdd] = useState<YoutubeClientResolved | null>(null);
  const [fetchingYoutubeAdd, setFetchingYoutubeAdd] = useState(false);
  const [fetchingYoutubeEdit, setFetchingYoutubeEdit] = useState(false);

  const [ytChannelUrl, setYtChannelUrl] = useState("");
  const [ytMaxResults, setYtMaxResults] = useState(50);
  const [ytClientId, setYtClientId] = useState("");
  const [ytPreview, setYtPreview] = useState<{
    channelTitle: string;
    channelUrl: string;
    videos: { videoId: string; title: string; thumbnailUrl: string }[];
  } | null>(null);
  const [ytBusy, setYtBusy] = useState(false);
  const [ytMessage, setYtMessage] = useState("");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me", { credentials: "include" });
    const data = await res.json();
    const ok = data.ok === true;
    setLoggedIn(ok);
    if (!ok) {
      router.replace("/admin/login");
    }
  }, [router]);

  const fetchItems = useCallback(async () => {
    try {
      setError("");
      const data = await api.getPortfolio();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load portfolio";
      setError(msg);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      setError("");
      const data = await api.getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load services";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth]);

  useEffect(() => {
    if (loggedIn) fetchItems();
  }, [loggedIn, fetchItems]);

  useEffect(() => {
    if (loggedIn && adminTab === "services") fetchServices();
  }, [loggedIn, adminTab, fetchServices]);

  const fetchClients = useCallback(async () => {
    try {
      setError("");
      const data = await api.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load clients";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    if (loggedIn && (adminTab === "clients" || adminTab === "portfolio")) fetchClients();
  }, [loggedIn, adminTab, fetchClients]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setLoggedIn(false);
    router.push("/admin/login");
    router.refresh();
  };

  const handleCategoryChange = (category: (typeof CATEGORIES)[number]) => {
    const preset = CATEGORY_PRESETS[category];
    setForm((f) => ({
      ...f,
      category,
      aspectClass: preset.aspectClass,
      width: preset.width,
      height: preset.height,
    }));
  };

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => /^image\/(jpe?g|png|gif|webp)$/i.test(f.type));
    if (imageFiles.length === 0) {
      setError("No image files (JPEG, PNG, GIF, WebP)");
      return;
    }
    setForm((f) => ({ ...f, imageUrl: "" }));
    setUploadedImageUrl(null);
    setUploadedImageUrls([]);
    setUploadStatus("uploading");
    setUploadProgress({ current: 0, total: imageFiles.length });
    setError("");
    const urls: string[] = [];
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: imageFiles.length });
        const { url } = await api.uploadPortfolioImage(imageFiles[i]);
        const fullUrl = url.startsWith("http") ? url : `${API_BASE.replace(/\/$/, "")}${url}`;
        urls.push(fullUrl);
      }
      setUploadedImageUrls(urls);
      if (urls.length === 1) setUploadedImageUrl(urls[0]);
      setUploadStatus("done");
    } catch (err) {
      setUploadStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) void uploadFiles(files);
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length) void uploadFiles(files);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const urls = uploadedImageUrls.length > 0 ? uploadedImageUrls : (uploadedImageUrl ? [uploadedImageUrl] : []);
    const imageUrl = form.imageUrl.trim();
    const toAdd = urls.length > 0 ? urls : (imageUrl ? [imageUrl] : []);
    if (toAdd.length === 0) {
      setError("Choose image(s) to upload or paste an image URL");
      setSubmitting(false);
      return;
    }
    try {
      for (let i = 0; i < toAdd.length; i++) {
        await api.createPortfolioItem({
          category: form.category,
          imageUrl: toAdd[i],
          aspectClass: form.aspectClass,
          width: form.width,
          height: form.height,
          ...(form.clientId.trim() ? { clientId: form.clientId.trim() } : {}),
        });
      }
      setForm({
        category: "Thumbnails",
        imageUrl: "",
        ...CATEGORY_PRESETS.Thumbnails,
        clientId: "",
      });
      setUploadFile(null);
      setUploadedImageUrl(null);
      setUploadedImageUrls([]);
      setUploadStatus("idle");
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (
      !editForm.title &&
      !editForm.category &&
      !editForm.imageUrl &&
      editForm.aspectClass == null &&
      editForm.width === undefined &&
      editForm.height === undefined &&
      editForm.clientId === undefined
    ) {
      setEditingId(null);
      return;
    }
    setSubmitting(true);
    setError("");
    const payload: Partial<PortfolioItem> = { ...editForm };
    const w = editForm.width as number | "" | undefined;
    const h = editForm.height as number | "" | undefined;
    if (w === "" || w === undefined) delete payload.width;
    else payload.width = Number(w);
    if (h === "" || h === undefined) delete payload.height;
    else payload.height = Number(h);
    if (editForm.clientId !== undefined) {
      payload.clientId = editForm.clientId === "" ? null : editForm.clientId;
    }
    try {
      await api.updatePortfolioItem(id, payload);
      setEditingId(null);
      setEditForm({});
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setSubmitting(true);
    setError("");
    try {
      await api.deletePortfolioItem(id);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleYoutubePreview = async () => {
    if (!ytChannelUrl.trim()) {
      setError("Paste a YouTube channel URL first");
      return;
    }
    setYtBusy(true);
    setYtMessage("");
    setError("");
    try {
      const res = await api.youtubePortfolioThumbnails({
        channelUrl: ytChannelUrl.trim(),
        maxResults: ytMaxResults,
        dryRun: true,
      });
      if (res.dryRun === true) {
        setYtPreview({
          channelTitle: res.channelTitle,
          channelUrl: res.channelUrl,
          videos: res.videos,
        });
      }
    } catch (e) {
      setYtPreview(null);
      setError(e instanceof Error ? e.message : "YouTube fetch failed");
    } finally {
      setYtBusy(false);
    }
  };

  const handleYoutubeImport = async () => {
    if (!ytChannelUrl.trim()) {
      setError("Paste a YouTube channel URL first");
      return;
    }
    setYtBusy(true);
    setYtMessage("");
    setError("");
    try {
      const res = await api.youtubePortfolioThumbnails({
        channelUrl: ytChannelUrl.trim(),
        maxResults: ytMaxResults,
        clientId: ytClientId.trim() || null,
        dryRun: false,
      });
      if (res.dryRun === false) {
        setYtMessage(
          `Imported ${res.imported} thumbnail(s). Skipped ${res.skipped} (already in portfolio).`
        );
        setYtPreview(null);
        await fetchItems();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setYtBusy(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.createService({
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        benefit: serviceForm.benefit.trim(),
      });
      setServiceForm({ title: "", description: "", benefit: "" });
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateService = async (id: string) => {
    if (!editServiceForm.title && !editServiceForm.description && !editServiceForm.benefit) {
      setEditingServiceId(null);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.updateService(id, {
        title: editServiceForm.title?.trim(),
        description: editServiceForm.description?.trim(),
        benefit: editServiceForm.benefit?.trim(),
      });
      setEditingServiceId(null);
      setEditServiceForm({});
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    setSubmitting(true);
    setError("");
    try {
      await api.deleteService(id);
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFetchYoutubeAdd = async () => {
    const raw = clientForm.channelUrl.trim();
    if (!raw) {
      setError("Paste a YouTube channel URL first");
      return;
    }
    setFetchingYoutubeAdd(true);
    setError("");
    try {
      const data = await api.resolveYoutubeClient({ channelUrl: raw });
      setYoutubeResolvedAdd(data);
      setClientForm((f) => ({
        ...f,
        channelName: data.channelName,
        channelUrl: data.channelUrl,
        subscriberCount: data.subscriberCount ?? "",
        description: data.description ?? "",
      }));
      setClientUploadFile(null);
      setClientLogoUploadFile(null);
    } catch (e) {
      setYoutubeResolvedAdd(null);
      setError(e instanceof Error ? e.message : "Could not fetch YouTube channel");
    } finally {
      setFetchingYoutubeAdd(false);
    }
  };

  const handleFetchYoutubeEdit = async () => {
    const raw = (editClientForm.channelUrl ?? "").trim();
    if (!raw) {
      setError("Enter channel URL first");
      return;
    }
    setFetchingYoutubeEdit(true);
    setError("");
    try {
      const data = await api.resolveYoutubeClient({ channelUrl: raw });
      setEditClientForm((f) => ({
        ...f,
        channelName: data.channelName,
        channelUrl: data.channelUrl,
        imageUrl: data.imageUrl,
        logoUrl: data.logoUrl,
        subscriberCount: data.subscriberCount ?? "",
        description: data.description ?? "",
      }));
      setEditClientLogoUploadFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch YouTube channel");
    } finally {
      setFetchingYoutubeEdit(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (youtubeResolvedAdd) {
        await api.createClient({
          channelName: clientForm.channelName.trim(),
          channelUrl: youtubeResolvedAdd.channelUrl,
          imageUrl: youtubeResolvedAdd.imageUrl,
          logoUrl: youtubeResolvedAdd.logoUrl,
          subscriberCount: clientForm.subscriberCount.trim() || youtubeResolvedAdd.subscriberCount,
          description: clientForm.description.trim() || youtubeResolvedAdd.description,
        });
      } else if (clientUploadFile && clientLogoUploadFile) {
        const { url } = await api.uploadPortfolioImage(clientUploadFile);
        const imageUrl = url.startsWith("http") ? url : `${API_BASE.replace(/\/$/, "")}${url}`;
        const uploadedLogo = await api.uploadPortfolioImage(clientLogoUploadFile);
        const logoUrl = uploadedLogo.url.startsWith("http")
          ? uploadedLogo.url
          : `${API_BASE.replace(/\/$/, "")}${uploadedLogo.url}`;
        await api.createClient({
          channelName: clientForm.channelName.trim(),
          channelUrl: clientForm.channelUrl.trim(),
          imageUrl,
          logoUrl,
          subscriberCount: clientForm.subscriberCount.trim() || undefined,
          description: clientForm.description.trim() || undefined,
        });
      } else {
        setError('Click "Fetch from YouTube" or upload both banner and logo files.');
        setSubmitting(false);
        return;
      }
      setClientForm({ channelName: "", channelUrl: "", subscriberCount: "", description: "" });
      setClientUploadFile(null);
      setClientLogoUploadFile(null);
      setYoutubeResolvedAdd(null);
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClient = async (id: string) => {
    if (
      !editClientForm.channelName &&
      !editClientForm.channelUrl &&
      !editClientForm.imageUrl &&
      !editClientForm.logoUrl &&
      !editClientForm.subscriberCount &&
      !editClientForm.description &&
      !editClientLogoUploadFile
    ) {
      setEditingClientId(null);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let logoUrl: string | undefined;
      if (editClientLogoUploadFile) {
        const uploadedLogo = await api.uploadPortfolioImage(editClientLogoUploadFile);
        logoUrl = uploadedLogo.url.startsWith("http")
          ? uploadedLogo.url
          : `${API_BASE.replace(/\/$/, "")}${uploadedLogo.url}`;
      } else if (editClientForm.logoUrl !== undefined && String(editClientForm.logoUrl).trim() !== "") {
        logoUrl = editClientForm.logoUrl.trim();
      }
      await api.updateClient(id, {
        channelName: editClientForm.channelName?.trim(),
        channelUrl: editClientForm.channelUrl?.trim(),
        imageUrl: editClientForm.imageUrl?.trim(),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        subscriberCount: editClientForm.subscriberCount?.trim(),
        description: editClientForm.description?.trim(),
        ...(editClientForm.slug !== undefined ? { slug: editClientForm.slug.trim() } : {}),
      });
      setEditingClientId(null);
      setEditClientLogoUploadFile(null);
      setEditClientForm({});
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    setSubmitting(true);
    setError("");
    try {
      await api.deleteClient(id);
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems =
    categoryFilter === ""
      ? items
      : items.filter((i) => i.category === categoryFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-dark)] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (loggedIn === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-dark)] text-white">
        <p className="text-sm">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-10 border-b border-[var(--brand-dark)]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[var(--brand-dark)] font-semibold hover:text-[var(--brand-mint)]"
            >
              Branddox
            </Link>
            <Link
              href="/portfolio"
              className="text-sm text-[var(--brand-dark)]/70 hover:underline"
            >
              View portfolio
            </Link>
            <Link
              href="/our-clients"
              className="text-sm text-[var(--brand-dark)]/70 hover:underline"
            >
              View our clients
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-[var(--brand-dark)]/10 px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/20"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--brand-dark)]">
            Admin
          </h1>
          <nav className="flex gap-1 rounded-lg border border-[var(--brand-dark)]/10 p-1">
            <button
              type="button"
              onClick={() => setAdminTab("portfolio")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                adminTab === "portfolio"
                  ? "bg-[var(--brand-dark)] text-white"
                  : "text-[var(--brand-dark)]/70 hover:bg-[var(--brand-dark)]/5"
              }`}
            >
              Portfolio
            </button>
            <button
              type="button"
              onClick={() => setAdminTab("services")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                adminTab === "services"
                  ? "bg-[var(--brand-dark)] text-white"
                  : "text-[var(--brand-dark)]/70 hover:bg-[var(--brand-dark)]/5"
              }`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => setAdminTab("clients")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                adminTab === "clients"
                  ? "bg-[var(--brand-dark)] text-white"
                  : "text-[var(--brand-dark)]/70 hover:bg-[var(--brand-dark)]/5"
              }`}
            >
              Top Clients
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {adminTab === "portfolio" && (
          <>
        <section className="mb-10 rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-[var(--brand-dark)]">
            Import video thumbnails from YouTube
          </h2>
          <p className="mb-4 rounded-lg bg-[var(--brand-mint)]/10 px-3 py-2 text-xs text-[var(--brand-dark)]/90">
            Select a channel from <strong>Top Clients</strong> (dropdown) to fill the URL and link imports to that
            client, or paste any channel URL. Preview loads thumbnails from uploads (YouTube Data API). Import adds
            them as <strong>Thumbnails</strong> (16:9). Logo and channel art are added when you create the client;
            this step only imports video thumbnails. YouTube Shorts / Reels-style videos are skipped
            automatically. Already-imported videos are skipped too.
          </p>
          {ytMessage && (
            <div className="mb-4 rounded-lg bg-[var(--brand-green)]/15 px-3 py-2 text-sm text-[var(--brand-dark)]">
              {ytMessage}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Client (optional)
              </label>
              <select
                value={ytClientId}
                onChange={(e) => {
                  const id = e.target.value;
                  setYtClientId(id);
                  const cl = clients.find((x) => x.id === id);
                  if (cl) setYtChannelUrl(cl.channelUrl);
                }}
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
              >
                <option value="">— None — paste URL below</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.channelName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
                Fills channel URL and assigns imports to this channel for the public portfolio.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Channel URL
              </label>
              <input
                type="url"
                value={ytChannelUrl}
                onChange={(e) => setYtChannelUrl(e.target.value)}
                placeholder="https://www.youtube.com/@handle or /channel/UC..."
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Max videos
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={ytMaxResults}
                onChange={(e) => setYtMaxResults(Math.min(200, Math.max(1, Number(e.target.value) || 50)))}
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
              />
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <button
                type="button"
                onClick={() => void handleYoutubePreview()}
                disabled={ytBusy}
                className="rounded-lg border border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/[0.04] px-4 py-2 text-sm font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/[0.08] disabled:opacity-50"
              >
                {ytBusy ? "…" : "Preview"}
              </button>
              <button
                type="button"
                onClick={() => void handleYoutubeImport()}
                disabled={ytBusy}
                className="rounded-lg bg-[var(--brand-mint)] px-4 py-2 text-sm font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
              >
                {ytBusy ? "Working…" : "Import to portfolio"}
              </button>
            </div>
          </div>
          {ytPreview && ytPreview.videos.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-[var(--brand-dark)]">
                Preview: {ytPreview.channelTitle}{" "}
                <span className="font-normal text-[var(--brand-dark)]/60">
                  ({ytPreview.videos.length} videos)
                </span>
              </p>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-[var(--brand-dark)]/10 bg-[var(--brand-dark)]/5 p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {ytPreview.videos.map((v) => (
                    <div key={v.videoId} className="overflow-hidden rounded-lg bg-white shadow-sm">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={v.thumbnailUrl}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                      <p className="line-clamp-2 p-1.5 text-[10px] leading-tight text-[var(--brand-dark)]/80">
                        {v.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Add form */}
        <section className="mb-10 rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">
            Add portfolio image
          </h2>
          <p className="mb-4 rounded-lg bg-[var(--brand-mint)]/10 px-3 py-2 text-xs text-[var(--brand-dark)]/90">
            Image only – no title. Choose category; size & ratio auto-fill. Upload uses Cloudinary.
          </p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value as (typeof CATEGORIES)[number])}
                className="w-full max-w-xs rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-[var(--brand-dark)]/70">
                Size: {form.width} × {form.height} px
                {form.aspectClass === "wide" && " (16:9)"}
                {form.aspectClass === "square" && " (1:1)"}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Channel (optional)
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                className="w-full max-w-md rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
              >
                <option value="">— None —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.channelName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
                Assign to a client so it appears under Channels on the public portfolio.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Image (drag & drop or choose one/multiple)
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  dragActive
                    ? "border-[var(--brand-mint)] bg-[var(--brand-mint)]/10"
                    : "border-[var(--brand-dark)]/20 hover:border-[var(--brand-dark)]/40"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <p className="text-sm text-[var(--brand-dark)]/70">
                  Drag images here or click to select (multiple allowed)
                </p>
              </div>
              {uploadStatus === "uploading" && uploadProgress && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--brand-mint)]/10 px-3 py-3">
                  <svg className="h-5 w-5 animate-spin text-[var(--brand-mint)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--brand-dark)]">
                    Uploading… {uploadProgress.current}/{uploadProgress.total}
                  </span>
                </div>
              )}
              {uploadStatus === "done" && (uploadedImageUrls.length > 0 || uploadedImageUrl) && (
                <div className="mt-3 rounded-lg border border-[var(--brand-mint)]/30 bg-[var(--brand-dark)]/5 p-3">
                  <p className="mb-2 text-xs font-medium text-[var(--brand-mint)]">
                    Upload complete{uploadedImageUrls.length > 1 ? ` (${uploadedImageUrls.length} images)` : ""}
                  </p>
                  {(uploadedImageUrls.length > 1 || uploadedImageUrl) && (
                    <p className="mb-2 text-xs text-[var(--brand-dark)]/80">
                      All {uploadedImageUrls.length > 1 ? uploadedImageUrls.length : 1} image(s) will use category: <strong>{form.category}</strong> ({form.width}×{form.height} px)
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(uploadedImageUrls.length > 0 ? uploadedImageUrls : uploadedImageUrl ? [uploadedImageUrl] : []).map((url, i) => (
                      <Image
                        key={i}
                        src={url}
                        alt={`Preview ${i + 1}`}
                        width={192}
                        height={96}
                        sizes="192px"
                        className="h-24 w-auto rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              {uploadStatus === "error" && (
                <p className="mt-2 text-sm text-red-600">Upload failed. Try again or paste image URL below.</p>
              )}
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => {
                  setForm((f) => ({ ...f, imageUrl: e.target.value }));
                  if (e.target.value) {
                    setUploadFile(null);
                    setUploadedImageUrl(null);
                    setUploadedImageUrls([]);
                    setUploadStatus("idle");
                  }
                }}
                placeholder="Or paste image URL"
                className="mt-2 w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
            >
              {submitting ? "Adding…" : (uploadedImageUrls.length > 1 ? `Add ${uploadedImageUrls.length} images` : "Add image")}
            </button>
          </form>
        </section>

        {/* Category filter */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--brand-dark)]">Category:</span>
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className={`rounded-full px-3 py-1 text-sm ${
              categoryFilter === ""
                ? "bg-[var(--brand-dark)] text-white"
                : "bg-[var(--brand-dark)]/10 text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/20"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={`rounded-full px-3 py-1 text-sm ${
                categoryFilter === c
                  ? "bg-[var(--brand-dark)] text-white"
                  : "bg-[var(--brand-dark)]/10 text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* List */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">
            Items ({filteredItems.length})
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--brand-dark)]/10 bg-white overflow-hidden"
              >
                <div className="aspect-[4/3] relative bg-[var(--brand-dark)]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl.startsWith("/") ? item.imageUrl : item.imageUrl}
                    alt={item.title || item.category}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <select
                        value={editForm.category ?? item.category}
                        onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full rounded border px-2 py-1 text-sm"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={editForm.imageUrl ?? item.imageUrl}
                        onChange={(e) => setEditForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        className="w-full rounded border px-2 py-1 text-sm"
                        placeholder="Image URL"
                      />
                      <select
                        value={editForm.aspectClass ?? item.aspectClass}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, aspectClass: e.target.value as PortfolioItem["aspectClass"] }))
                        }
                        className="w-full rounded border px-2 py-1 text-sm"
                      >
                        {ASPECT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={1}
                          value={editForm.width ?? item.width ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, width: e.target.value === "" ? "" : Number(e.target.value) } as typeof editForm))}
                          className="rounded border px-2 py-1 text-sm"
                          placeholder="Width"
                        />
                        <input
                          type="number"
                          min={1}
                          value={editForm.height ?? item.height ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, height: e.target.value === "" ? "" : Number(e.target.value) } as typeof editForm))}
                          className="rounded border px-2 py-1 text-sm"
                          placeholder="Height"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs text-[var(--brand-dark)]/70">Channel</label>
                        <select
                          value={(editForm.clientId ?? item.clientId) ?? ""}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, clientId: e.target.value }))
                          }
                          className="w-full rounded border px-2 py-1 text-sm"
                        >
                          <option value="">— None —</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.channelName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id)}
                          disabled={submitting}
                          className="rounded bg-[var(--brand-mint)] px-2 py-1 text-sm font-medium text-[var(--brand-dark)]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditForm({}); }}
                          className="rounded bg-[var(--brand-dark)]/10 px-2 py-1 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-[var(--brand-dark)]">{item.category}</p>
                      {item.youtubeVideoId && (
                        <p className="text-xs text-[var(--brand-dark)]/50">YouTube video: {item.youtubeVideoId}</p>
                      )}
                      {item.clientId && (
                        <p className="text-xs font-medium text-[var(--brand-green)]">
                          Channel:{" "}
                          {clients.find((x) => x.id === item.clientId)?.channelName ?? item.clientId}
                        </p>
                      )}
                      <p className="text-sm text-[var(--brand-dark)]/70">
                        {item.width != null && item.height != null
                          ? `${item.width} × ${item.height} px`
                          : item.aspectClass}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditForm({
                              ...item,
                              width: item.width ?? "",
                              height: item.height ?? "",
                              clientId: item.clientId ?? "",
                            } as Partial<PortfolioItem> & { width?: number | ""; height?: number | "" });
                          }}
                          className="text-sm text-[var(--brand-mint)] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={submitting}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {filteredItems.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/5 py-8 text-center text-[var(--brand-dark)]/70">
              No items in this category. Add one above or switch to &quot;All&quot;.
            </p>
          )}
        </section>
          </>
        )}

        {adminTab === "services" && (
          <>
        <section className="mb-10 rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">
            Add service
          </h2>
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Title</label>
              <input
                type="text"
                value={serviceForm.title}
                onChange={(e) => setServiceForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Graphics Design"
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Description</label>
              <textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description of the service"
                rows={2}
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Benefit (e.g. → Stand out in feeds)</label>
              <input
                type="text"
                value={serviceForm.benefit}
                onChange={(e) => setServiceForm((f) => ({ ...f, benefit: e.target.value }))}
                placeholder="→ Benefit line"
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add service"}
            </button>
          </form>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">Services ({services.length})</h2>
          <ul className="space-y-4">
            {services.map((s) => (
              <li key={s.id} className="rounded-xl border border-[var(--brand-dark)]/10 bg-white p-4">
                {editingServiceId === s.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editServiceForm.title ?? s.title}
                      onChange={(e) => setEditServiceForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Title"
                    />
                    <textarea
                      value={editServiceForm.description ?? s.description}
                      onChange={(e) => setEditServiceForm((f) => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editServiceForm.benefit ?? s.benefit}
                      onChange={(e) => setEditServiceForm((f) => ({ ...f, benefit: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Benefit"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateService(s.id)}
                        disabled={submitting}
                        className="rounded bg-[var(--brand-mint)] px-2 py-1 text-sm font-medium text-[var(--brand-dark)]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingServiceId(null); setEditServiceForm({}); }}
                        className="rounded bg-[var(--brand-dark)]/10 px-2 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-[var(--brand-dark)]">{s.title}</p>
                    <p className="text-sm text-[var(--brand-dark)]/70">{s.description}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--brand-mint)]">{s.benefit}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingServiceId(s.id); setEditServiceForm({ ...s }); }}
                        className="text-sm text-[var(--brand-mint)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(s.id)}
                        disabled={submitting}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {services.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/5 py-8 text-center text-[var(--brand-dark)]/70">
              No services yet. Add one above.
            </p>
          )}
        </section>
          </>
        )}

        {adminTab === "clients" && (
          <>
        <section className="mb-10 rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">
            Add YouTube client (channel we worked with)
          </h2>
          <p className="mb-4 rounded-lg bg-[var(--brand-mint)]/10 px-3 py-2 text-xs text-[var(--brand-dark)]/90">
            Saving a client also adds their <strong>logo</strong> (Logo) and <strong>channel banner</strong> (Channel art)
            to Portfolio automatically. Use the Portfolio tab → Import from YouTube → pick this channel to pull video
            thumbnails.
          </p>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Channel name</label>
                <input
                  type="text"
                  value={clientForm.channelName}
                  onChange={(e) => setClientForm((f) => ({ ...f, channelName: e.target.value }))}
                  placeholder="e.g. Tech Reviews"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Channel URL</label>
                <input
                  type="url"
                  value={clientForm.channelUrl}
                  onChange={(e) => {
                    setClientForm((f) => ({ ...f, channelUrl: e.target.value }));
                    setYoutubeResolvedAdd(null);
                  }}
                  placeholder="https://youtube.com/@..."
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                  required
                />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFetchYoutubeAdd}
                    disabled={submitting || fetchingYoutubeAdd}
                    className="rounded-lg border border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/[0.04] px-3 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/[0.08] disabled:opacity-50"
                  >
                    {fetchingYoutubeAdd ? "Fetching…" : "Fetch from YouTube"}
                  </button>
                  {youtubeResolvedAdd && (
                    <span className="text-xs font-medium text-[var(--brand-green)]">
                      Fetched — logo & banner saved on Cloudinary
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
                  Uses YouTube Data API + Cloudinary (set GOOGLE_YOUTUBE_API_KEY on the API).
                </p>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Client image (thumbnail/channel banner)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setClientUploadFile(e.target.files?.[0] ?? null);
                  setYoutubeResolvedAdd(null);
                }}
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
                required={!youtubeResolvedAdd}
                disabled={!!youtubeResolvedAdd}
              />
              <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
                {youtubeResolvedAdd
                  ? "Using banner from YouTube fetch."
                  : "Uploaded via API to Cloudinary."}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                Logo file (for top/marquee)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setClientLogoUploadFile(e.target.files?.[0] ?? null);
                  setYoutubeResolvedAdd(null);
                }}
                className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
                required={!youtubeResolvedAdd}
                disabled={!!youtubeResolvedAdd}
              />
              <p className="mt-1 text-xs text-[var(--brand-dark)]/60">
                {youtubeResolvedAdd
                  ? "Using channel avatar from YouTube fetch."
                  : "Uploaded via API to Cloudinary."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Subscribers (e.g. 50K)</label>
                <input
                  type="text"
                  value={clientForm.subscriberCount}
                  onChange={(e) => setClientForm((f) => ({ ...f, subscriberCount: e.target.value }))}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">Short description</label>
                <input
                  type="text"
                  value={clientForm.description}
                  onChange={(e) => setClientForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional tagline"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add client"}
            </button>
          </form>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">Top clients ({clients.length})</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <li key={c.id} className="rounded-xl border border-[var(--brand-dark)]/10 bg-white p-4">
                {editingClientId === c.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editClientForm.channelName ?? c.channelName}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, channelName: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Channel name"
                    />
                    <input
                      type="url"
                      value={editClientForm.channelUrl ?? c.channelUrl}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, channelUrl: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Channel URL"
                    />
                    <button
                      type="button"
                      onClick={handleFetchYoutubeEdit}
                      disabled={submitting || fetchingYoutubeEdit}
                      className="rounded border border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/[0.04] px-2 py-1 text-sm text-[var(--brand-dark)] hover:bg-[var(--brand-dark)]/[0.08] disabled:opacity-50"
                    >
                      {fetchingYoutubeEdit ? "Fetching…" : "Fetch from YouTube"}
                    </button>
                    <input
                      type="url"
                      value={editClientForm.imageUrl ?? c.imageUrl}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Client image URL (thumbnail/banner)"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditClientLogoUploadFile(e.target.files?.[0] ?? null)}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      value={editClientForm.subscriberCount ?? c.subscriberCount ?? ""}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, subscriberCount: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Subscribers"
                    />
                    <input
                      type="text"
                      value={editClientForm.description ?? c.description ?? ""}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editClientForm.slug ?? c.slug ?? ""}
                      onChange={(e) => setEditClientForm((f) => ({ ...f, slug: e.target.value }))}
                      className="w-full rounded border px-2 py-1 font-mono text-xs"
                      placeholder="URL slug (portfolio/channels/...)"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateClient(c.id)}
                        disabled={submitting}
                        className="rounded bg-[var(--brand-mint)] px-2 py-1 text-sm font-medium text-[var(--brand-dark)]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClientId(null);
                          setEditClientForm({});
                          setEditClientLogoUploadFile(null);
                        }}
                        className="rounded bg-[var(--brand-dark)]/10 px-2 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <a href={c.channelUrl} target="_blank" rel="noopener noreferrer" className="block max-w-full">
                      {/* next/image `fill` requires a positioned parent; without `relative` the image can cover the whole viewport */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--brand-dark)]/10">
                        <Image
                          src={c.logoUrl || c.imageUrl}
                          alt={`${c.channelName} logo`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 font-bold text-[var(--brand-dark)]">{c.channelName}</p>
                      <p className="mt-0.5 font-mono text-xs text-[var(--brand-dark)]/50">/{c.slug}</p>
                      {c.subscriberCount && <p className="text-sm text-[var(--brand-dark)]/70">{c.subscriberCount} subs</p>}
                      {c.description && (
                        <p className="mt-1 line-clamp-4 text-sm text-[var(--brand-dark)]/60">{c.description}</p>
                      )}
                    </a>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        href={`/portfolio/channels/${encodeURIComponent(c.slug)}`}
                        className="text-sm font-medium text-[var(--brand-mint)] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View channel portfolio
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClientId(c.id);
                          setEditClientForm({ ...c });
                          setEditClientLogoUploadFile(null);
                        }}
                        className="text-sm text-[var(--brand-mint)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(c.id)}
                        disabled={submitting}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {clients.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--brand-dark)]/20 bg-[var(--brand-dark)]/5 py-8 text-center text-[var(--brand-dark)]/70">
              No clients yet. Add YouTube channels you&apos;ve worked with above.
            </p>
          )}
        </section>
          </>
        )}
      </main>
    </div>
  );
}
