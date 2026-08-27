export default function ModalExito({ titulo = '¡Buen trabajo!', mensaje, onCerrar }) {
  if (!mensaje) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-200">
          <svg className="h-9 w-9 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        <p className="mt-3 text-sm text-gray-500">{mensaje}</p>

        <button
          type="button"
          onClick={onCerrar}
          className="mt-6 rounded-md bg-[var(--color-ocre)] px-7 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ocre-claro)] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  )
}