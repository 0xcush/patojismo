"use client";

import { useEffect, useState } from "react";
import { DayLog } from "@/lib/types";
import { getLogs, deleteLog } from "@/lib/storage";

export default function LogHistory() {
  const [logs, setLogs] = useState<DayLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  function handleDelete(date: string) {
    deleteLog(date);
    setLogs(getLogs());
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-center text-gray-400">
        No hay registros todavía. Comienza registrando tu día arriba.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 divide-y divide-pink-50">
      <h3 className="px-6 py-4 font-semibold text-pink-700">Historial</h3>
      {logs.slice(0, 30).map((log) => (
        <div key={log.date} className="px-6 py-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{formatDate(log.date)}</span>
              {log.hasPeriod && (
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                  Período {log.flow === "light" ? "ligero" : log.flow === "heavy" ? "abundante" : "medio"}
                </span>
              )}
            </div>
            {log.mood && <p className="text-sm text-gray-500">{log.mood}</p>}
            {log.symptoms && log.symptoms.length > 0 && (
              <p className="text-xs text-gray-400">{log.symptoms.join(", ")}</p>
            )}
            {log.notes && <p className="text-xs text-gray-400 italic">{log.notes}</p>}
          </div>
          <button
            onClick={() => handleDelete(log.date)}
            className="text-gray-300 hover:text-red-400 text-sm transition"
            title="Eliminar"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
