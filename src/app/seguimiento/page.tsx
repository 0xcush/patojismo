import DayLogger from "@/components/DayLogger";
import LogHistory from "@/components/LogHistory";

export default function SeguimientoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-pink-700 mb-2">Seguimiento</h1>
        <p className="text-gray-500">
          Registra tu período, síntomas y estado de ánimo cada día.
        </p>
      </div>
      <DayLogger />
      <LogHistory />
    </div>
  );
}
