"use client";

import { useState } from "react";
import { DayLog } from "@/lib/types";
import { saveLog, getLogForDate } from "@/lib/storage";

const SYMPTOMS = [
  "Cólicos", "Dolor de cabeza", "Hinchazón", "Sensibilidad en senos",
  "Fatiga", "Náuseas", "Dolor de espalda", "Acné",
];

const MOODS = ["😊 Feliz", "😐 Normal", "😢 Triste", "😠 Irritable", "😴 Cansada", "😰 Ansiosa"];

export default function DayLogger() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [hasPeriod, setHasPeriod] = useState(false);
  const [flow, setFlow] = useState<"light" | "medium" | "heavy">("medium");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  function loadDate(newDate: string) {
    setDate(newDate);
    setSaved(false);
    const existing = getLogForDate(newDate);
    if (existing) {
      setHasPeriod(existing.hasPeriod);
      setFlow(existing.flow || "medium");
      setSymptoms(existing.symptoms || []);
      setMood(existing.mood || "");
      setNotes(existing.notes || "");
    } else {
      setHasPeriod(false);
      setFlow("medium");
      setSymptoms([]);
      setMood("");
      setNotes("");
    }
  }

  function toggleSymptom(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSave() {
    const log: DayLog = { date, hasPeriod, symptoms, mood, notes };
    if (hasPeriod) log.flow = flow;
    saveLog(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => loadDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tienes tu período hoy?
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setHasPeriod(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              hasPeriod
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Sí
          </button>
          <button
            onClick={() => setHasPeriod(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !hasPeriod
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {hasPeriod && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flujo</label>
          <div className="flex gap-3">
            {(["light", "medium", "heavy"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFlow(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  flow === f
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "light" ? "Ligero" : f === "medium" ? "Medio" : "Abundante"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Síntomas</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                symptoms.includes(s)
                  ? "bg-pink-100 text-pink-700 border border-pink-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estado de ánimo</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                mood === m
                  ? "bg-pink-100 text-pink-700 border border-pink-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="¿Algo más que quieras anotar?"
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-pink-600 text-white py-3 rounded-xl font-medium hover:bg-pink-700 transition"
      >
        {saved ? "✓ Guardado" : "Guardar registro"}
      </button>
    </div>
  );
}
