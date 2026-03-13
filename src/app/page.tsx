"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface CalibrationRecord {
  id: string;
  createdAt: string;
  coffee: string;
  dose: number;
  timeSeconds: number;
  weight: number;
  ratio: number;
  notes: string;
  rating: number;
  images: string[]; // base64 data URLs
}

const STORAGE_KEY = "patojismo_calibrations";

function loadRecords(): CalibrationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecords(records: CalibrationRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function RatingStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors cursor-pointer ${star <= value ? "text-amber-400" : "text-stone-600 hover:text-amber-600"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Calibration"
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default function Home() {
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [form, setForm] = useState({
    coffee: "",
    dose: "",
    timeSeconds: "",
    weight: "",
    notes: "",
    rating: 0,
    images: [] as string[],
  });
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "ratio" | "time">("recent");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Extraction timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function startTimer() {
    startTimeRef.current = Date.now() - timerElapsed * 1000;
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimerElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 100);
  }

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    setForm((f) => ({ ...f, timeSeconds: String(timerElapsed) }));
  }

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTimerElapsed(0);
    setForm((f) => ({ ...f, timeSeconds: "" }));
  }

  const dose = parseFloat(form.dose) || 0;
  const weight = parseFloat(form.weight) || 0;
  const ratio = dose > 0 && weight > 0 ? (weight / dose).toFixed(2) : null;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const b64s = await Promise.all(files.map(fileToBase64));
    setForm((f) => ({ ...f, images: [...f.images, ...b64s] }));
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const d = parseFloat(form.dose);
    const t = parseInt(form.timeSeconds);
    const w = parseFloat(form.weight);
    if (!d || !t || !w) return;

    let updated: CalibrationRecord[];
    if (editId) {
      updated = records.map((r) =>
        r.id === editId
          ? { ...r, coffee: form.coffee, dose: d, timeSeconds: t, weight: w, ratio: w / d, notes: form.notes, rating: form.rating, images: form.images }
          : r
      );
      setEditId(null);
    } else {
      updated = [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          coffee: form.coffee,
          dose: d,
          timeSeconds: t,
          weight: w,
          ratio: w / d,
          notes: form.notes,
          rating: form.rating,
          images: form.images,
        },
        ...records,
      ];
    }

    setRecords(updated);
    saveRecords(updated);
    setForm({ coffee: "", dose: "", timeSeconds: "", weight: "", notes: "", rating: 0, images: [] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(record: CalibrationRecord) {
    setForm({
      coffee: record.coffee,
      dose: String(record.dose),
      timeSeconds: String(record.timeSeconds),
      weight: String(record.weight),
      notes: record.notes,
      rating: record.rating,
      images: record.images ?? [],
    });
    setEditId(record.id);
  }

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      saveRecords(updated);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm({ coffee: "", dose: "", timeSeconds: "", weight: "", notes: "", rating: 0, images: [] });
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patojismo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported: CalibrationRecord[] = JSON.parse(text);
      if (!Array.isArray(imported)) throw new Error();
      setRecords((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const merged = [...prev, ...imported.filter((r) => r.id && !existingIds.has(r.id))];
        saveRecords(merged);
        return merged;
      });
    } catch {
      alert("Archivo inválido. Asegúrate de importar un JSON exportado desde Patojismo.");
    }
    e.target.value = "";
  }

  function handleClone(record: CalibrationRecord) {
    setForm({
      coffee: record.coffee,
      dose: String(record.dose),
      timeSeconds: String(record.timeSeconds),
      weight: String(record.weight),
      notes: "",
      rating: 0,
      images: [],
    });
    setEditId(null);
    window.scrollTo({ top: 0 });
  }

  const filteredAndSorted = useMemo(() => {
    let result = records.filter((r) =>
      r.coffee.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "recent") result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "ratio") result = [...result].sort((a, b) => b.ratio - a.ratio);
    else if (sortBy === "time") result = [...result].sort((a, b) => a.timeSeconds - b.timeSeconds);
    return result;
  }, [records, search, sortBy]);

  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden">
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      {/* ── Left panel: form ── */}
      <aside className="w-96 shrink-0 flex flex-col border-r border-stone-800 overflow-y-auto">
        {/* Brand */}
        <div className="px-6 pt-7 pb-5 border-b border-stone-800 shrink-0">
          <h1 className="text-xl font-bold tracking-tight">☕ Patojismo</h1>
          <p className="text-stone-500 text-xs mt-0.5">Calibración de espresso</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
          {editId && (
            <div className="bg-amber-900/30 border border-amber-700/40 rounded-lg px-3 py-2.5 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Editando registro</span>
              <button type="button" onClick={handleCancelEdit} className="text-stone-400 hover:text-stone-200 cursor-pointer">
                Cancelar
              </button>
            </div>
          )}

          {/* Coffee */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
              Café / Origen
            </label>
            <input
              type="text"
              value={form.coffee}
              onChange={(e) => setForm({ ...form, coffee: e.target.value })}
              placeholder="Etiopía Yirgacheffe, lote 03"
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Dose / Time / Weight */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Dosis (g)", key: "dose", placeholder: "18.0", step: "0.1" },
              { label: "Tiempo (s)", key: "timeSeconds", placeholder: "27", step: "1" },
              { label: "Gramaje (g)", key: "weight", placeholder: "36.0", step: "0.1" },
            ].map(({ label, key, placeholder, step }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
                  {label}
                </label>
                <input
                  type="number"
                  step={step}
                  min="0"
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Live ratio */}
          {ratio && (
            <div className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="text-stone-500 text-xs uppercase tracking-widest">Ratio</span>
              <span className="font-mono text-amber-400 font-bold text-base">1 : {ratio}</span>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
              Valoración
            </label>
            <RatingStars value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
              Notas
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Sabor, ajuste de molino, observaciones..."
              rows={3}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Image attachment */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5">
              Imágenes
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-stone-700 hover:border-amber-600 rounded-lg py-2.5 text-xs text-stone-500 hover:text-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-base">📎</span> Adjuntar imágenes
            </button>

            {/* Previews */}
            {form.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.images.map((src, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border border-stone-700 cursor-pointer"
                      onClick={() => setLightbox(src)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-stone-950 border border-stone-700 text-stone-400 hover:text-red-400 rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            {editId ? "Guardar cambios" : saved ? "¡Guardado!" : "Guardar calibración"}
          </button>
        </form>
      </aside>

      {/* ── Right panel: records ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 border-b border-stone-800 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-stone-100">Registros</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {records.length === 0 ? "Sin registros" : `${records.length} calibración${records.length !== 1 ? "es" : ""}`}
            </p>
          </div>
          <div className="flex gap-2">
            <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
              onClick={() => importInputRef.current?.click()}
              className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Importar
            </button>
            <button
              onClick={handleExport}
              disabled={records.length === 0}
              className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Filter + sort bar */}
        {records.length > 0 && (
          <div className="px-6 py-3 border-b border-stone-800 shrink-0 flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por café..."
              className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="recent">Más reciente</option>
              <option value="rating">Mejor valoración</option>
              <option value="ratio">Mayor ratio</option>
              <option value="time">Menor tiempo</option>
            </select>
          </div>
        )}

        {/* Records list */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-600">
              <span className="text-5xl mb-4">☕</span>
              <p className="text-sm">Guarda tu primera calibración.</p>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-600">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm">Sin resultados para &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-min">
              {filteredAndSorted.map((r) => (
                <div
                  key={r.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-stone-700 transition-colors flex flex-col gap-3"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-stone-100 truncate text-sm">
                        {r.coffee || <span className="text-stone-500 italic">Sin nombre</span>}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {new Date(r.createdAt).toLocaleString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {r.rating > 0 && (
                      <div className="flex gap-px shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-xs ${s <= r.rating ? "text-amber-400" : "text-stone-700"}`}>★</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: "Dosis", value: `${r.dose}g` },
                      { label: "Tiempo", value: formatTime(r.timeSeconds) },
                      { label: "Gramaje", value: `${r.weight}g` },
                      { label: "Ratio", value: `1:${r.ratio.toFixed(2)}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-stone-800/70 rounded-lg py-1.5 px-2 text-center">
                        <p className="text-xs text-stone-500 leading-none">{label}</p>
                        <p className="text-xs font-mono text-stone-200 mt-1">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Images */}
                  {r.images?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.images.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-14 h-14 object-cover rounded-lg border border-stone-700 cursor-pointer hover:border-amber-500 transition-colors"
                          onClick={() => setLightbox(src)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {r.notes && (
                    <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800 pt-3">
                      {r.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => handleClone(r)}
                      className="text-xs text-stone-400 hover:text-stone-200 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      Clonar
                    </button>
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-xs text-stone-400 hover:text-stone-200 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        deleteConfirm === r.id
                          ? "bg-red-900/60 text-red-300 hover:bg-red-900"
                          : "text-stone-500 hover:text-red-400 bg-stone-800 hover:bg-stone-700"
                      }`}
                    >
                      {deleteConfirm === r.id ? "¿Confirmar?" : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
