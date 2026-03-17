"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/portfolio-types";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-types";
import { api, API_BASE } from "@/lib/api";
import type { ServiceItem } from "@/lib/api";

const CATEGORIES = PORTFOLIO_CATEGORIES;
const ASPECT_OPTIONS: { value: PortfolioItem["aspectClass"]; label: string }[] = [
  { value: "tall", label: "Tall (3:4)" },
  { value: "square", label: "Square" },
  { value: "wide", label: "Wide (4:3)" },
  { value: "xtall", label: "Extra tall (3:5)" },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Thumbnails" as (typeof CATEGORIES)[number],
    imageUrl: "",
    aspectClass: "square" as PortfolioItem["aspectClass"],
    width: "" as string | number,
    height: "" as string | number,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PortfolioItem> & { width?: number | ""; height?: number | "" }>({});

  const [adminTab, setAdminTab] = useState<"portfolio" | "services">("portfolio");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", benefit: "" });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<ServiceItem>>({});

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    const data = await res.json();
    setLoggedIn(data.ok === true);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.getPortfolio();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load portfolio");
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const data = await api.getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load services");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || "Login failed");
      return;
    }
    setLoggedIn(true);
    setPassword("");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (uploadFile) {
        const { url } = await api.uploadPortfolioImage(uploadFile);
        const imageUrl = url.startsWith("http") ? url : `${API_BASE.replace(/\/$/, "")}${url}`;
        await api.createPortfolioItem({
          title: form.title,
          category: form.category,
          imageUrl,
          aspectClass: form.aspectClass,
          width: form.width !== "" && form.width !== undefined ? Number(form.width) : undefined,
          height: form.height !== "" && form.height !== undefined ? Number(form.height) : undefined,
        });
      } else if (form.imageUrl.trim()) {
        await api.createPortfolioItem({
          title: form.title,
          category: form.category,
          imageUrl: form.imageUrl.trim(),
          aspectClass: form.aspectClass,
          width: form.width !== "" && form.width !== undefined ? Number(form.width) : undefined,
          height: form.height !== "" && form.height !== undefined ? Number(form.height) : undefined,
        });
      } else {
        throw new Error("Upload an image or paste an image URL");
      }
      setForm({ title: "", category: "Thumbnails", imageUrl: "", aspectClass: "square", width: "", height: "" });
      setUploadFile(null);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.title && !editForm.category && !editForm.imageUrl && editForm.aspectClass == null && editForm.width === undefined && editForm.height === undefined) {
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-dark)] p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-xl font-bold text-[var(--brand-dark)]">Admin login</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-[var(--brand-dark)]"
              autoFocus
            />
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)]"
            >
              Log in
            </button>
          </form>
          <Link
            href="/"
            className="mt-4 block text-center text-sm text-[var(--brand-dark)]/70 hover:underline"
          >
            ← Back to site
          </Link>
        </div>
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
          </nav>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {adminTab === "portfolio" && (
          <>
        {/* Add form */}
        <section className="mb-10 rounded-xl border border-[var(--brand-dark)]/10 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--brand-dark)]">
            Add portfolio item
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. YouTube Thumbnail Pack"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as (typeof CATEGORIES)[number] }))}
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Image (file or URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setUploadFile(e.target.files?.[0] ?? null);
                    if (e.target.files?.[0]) setForm((f) => ({ ...f, imageUrl: "" }));
                  }}
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
                />
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, imageUrl: e.target.value }));
                    if (e.target.value) setUploadFile(null);
                  }}
                  placeholder="Or paste image URL"
                  className="mt-2 w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Aspect ratio
                </label>
                <select
                  value={form.aspectClass}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, aspectClass: e.target.value as PortfolioItem["aspectClass"] }))
                  }
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                >
                  {ASPECT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Actual size (px) – width
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.width === "" ? "" : form.width}
                  onChange={(e) => setForm((f) => ({ ...f, width: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder="e.g. 1280"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]">
                  Actual size (px) – height
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.height === "" ? "" : form.height}
                  onChange={(e) => setForm((f) => ({ ...f, height: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder="e.g. 400"
                  className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add item"}
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
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.title ?? item.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded border px-2 py-1 text-sm"
                        placeholder="Title"
                      />
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
                      <p className="font-medium text-[var(--brand-dark)]">{item.title}</p>
                      <p className="text-sm text-[var(--brand-dark)]/70">
                        {item.category}
                        {item.width != null && item.height != null
                          ? ` · ${item.width} × ${item.height} px`
                          : ` · ${item.aspectClass}`}
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
      </main>
    </div>
  );
}
