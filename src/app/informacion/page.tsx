export default function InformacionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-pink-700 mb-2">Información</h1>
        <p className="text-gray-500">
          Aprende sobre tu ciclo menstrual y salud reproductiva.
        </p>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 space-y-4">
        <h2 className="text-lg font-semibold text-pink-700">¿Qué es el ciclo menstrual?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          El ciclo menstrual es el proceso mensual que prepara tu cuerpo para un posible embarazo.
          Se cuenta desde el primer día de un período hasta el primer día del siguiente.
          Un ciclo típico dura entre 21 y 35 días, con un promedio de 28 días.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 space-y-4">
        <h2 className="text-lg font-semibold text-pink-700">Las 4 fases del ciclo</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-red-400 pl-4">
            <h3 className="font-medium text-red-600">1. Menstruación (Días 1-5)</h3>
            <p className="text-sm text-gray-500 mt-1">
              El revestimiento del útero se desprende y sale como sangrado menstrual.
              Es normal que dure entre 3 y 7 días. Puedes sentir cólicos, fatiga o cambios de humor.
            </p>
          </div>

          <div className="border-l-4 border-orange-400 pl-4">
            <h3 className="font-medium text-orange-600">2. Fase folicular (Días 1-13)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Comienza el primer día de tu período. Tu cuerpo produce hormona foliculoestimulante (FSH)
              que estimula a los ovarios a desarrollar folículos. El estrógeno sube y el revestimiento
              uterino se engrosa de nuevo. Sueles sentirte con más energía.
            </p>
          </div>

          <div className="border-l-4 border-pink-400 pl-4">
            <h3 className="font-medium text-pink-600">3. Ovulación (Día ~14)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Un óvulo maduro se libera del ovario. Este es el momento más fértil del ciclo.
              El óvulo vive entre 12 y 24 horas. Algunas personas sienten un dolor leve en un
              lado del abdomen (mittelschmerz).
            </p>
          </div>

          <div className="border-l-4 border-purple-400 pl-4">
            <h3 className="font-medium text-purple-600">4. Fase lútea (Días 15-28)</h3>
            <p className="text-sm text-gray-500 mt-1">
              El folículo vacío se convierte en cuerpo lúteo y produce progesterona.
              Si no hay embarazo, las hormonas bajan y se prepara un nuevo período.
              Aquí es cuando pueden aparecer síntomas premenstruales (SPM): hinchazón,
              sensibilidad en senos, cambios de humor.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 space-y-4">
        <h2 className="text-lg font-semibold text-pink-700">¿Cuándo consultar a un médico?</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex gap-2"><span className="text-pink-500">•</span> Períodos que duran más de 7 días</li>
          <li className="flex gap-2"><span className="text-pink-500">•</span> Sangrado muy abundante (cambiar protección cada hora)</li>
          <li className="flex gap-2"><span className="text-pink-500">•</span> Dolor menstrual que no mejora con analgésicos</li>
          <li className="flex gap-2"><span className="text-pink-500">•</span> Ciclos menores a 21 días o mayores a 35</li>
          <li className="flex gap-2"><span className="text-pink-500">•</span> Sangrado entre períodos o después de relaciones</li>
          <li className="flex gap-2"><span className="text-pink-500">•</span> Ausencia de período por más de 3 meses (sin embarazo)</li>
        </ul>
      </section>

      <section className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
        <p className="text-sm text-pink-700">
          <strong>Nota:</strong> Esta información es educativa y no sustituye la consulta médica profesional.
          Si tienes dudas sobre tu salud, consulta a tu ginecólogo/a.
        </p>
      </section>
    </div>
  );
}
