import { methods } from "@/lib/methods-data";

const categoryLabels: Record<string, string> = {
  hormonal: "Hormonal",
  barrier: "De barrera",
  natural: "Natural",
  permanent: "Permanente",
  emergency: "De emergencia",
};

export default function MetodosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-pink-700 mb-2">Métodos Anticonceptivos</h1>
        <p className="text-gray-500">
          Conoce las opciones disponibles, cómo funcionan y sus ventajas y desventajas.
        </p>
      </div>

      <div className="space-y-6">
        {methods.map((m) => (
          <details
            key={m.id}
            className="bg-white rounded-2xl shadow-sm border border-pink-100 group"
          >
            <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-pink-700">{m.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                    {categoryLabels[m.category]}
                  </span>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                    {m.effectiveness}% efectividad
                  </span>
                </div>
              </div>
              <span className="text-pink-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>

            <div className="px-6 pb-6 space-y-4 border-t border-pink-50 pt-4">
              <p className="text-sm text-gray-600">{m.description}</p>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">¿Cómo funciona?</h4>
                <p className="text-sm text-gray-500">{m.howItWorks}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-1">Ventajas</h4>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {m.pros.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-1">Desventajas</h4>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {m.cons.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-400">−</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
