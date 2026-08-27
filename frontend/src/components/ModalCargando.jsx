export default function ModalCargando({ visible, titulo = 'Enviando...', mensaje }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
          <svg className="h-10 w-10 animate-spin text-[var(--color-ocre)]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
        {mensaje && <p className="mt-2 text-sm text-gray-500">{mensaje}</p>}
      </div>
    </div>
  )
}