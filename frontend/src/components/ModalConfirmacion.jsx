export default function ModalConfirmacion({ titulo = '¿Estás seguro?', mensaje, visible, onConfirmar, onCancelar }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-ocre-claro)]">
          <svg className="h-9 w-9 text-[var(--color-ocre)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        <p className="mt-3 text-sm text-gray-500">{mensaje}</p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-md bg-[var(--color-ocre)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ocre-claro)] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}