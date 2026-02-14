'use client'

import { useActionState, useState } from 'react'

import { createClubAction } from '@/app/(dashboard)/actions'

const initialState = {
  success: false,
  error: undefined,
}

export default function CreateClubForm() {
  const [state, formAction, isPending] = useActionState(
    createClubAction,
    initialState
  )

  const [clubName, setClubName] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)

  // Generar slug automáticamente desde el nombre
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
  }

  // Usar slug manual o auto-generado
  const slug = isSlugManual ? customSlug : generateSlug(clubName)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClubName(e.target.value)
    // Si el usuario no ha editado manualmente el slug, se mantiene auto
    if (!isSlugManual) {
      setCustomSlug('')
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManual(true)
    setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-50">Crear Nuevo Club</h2>
        <p className="text-slate-400 mt-2">
          Configura tu club de running y comienza a gestionar tu comunidad
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Error Message */}
        {state?.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-400">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Club Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Nombre del Club
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={clubName}
            onChange={handleNameChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 transition-colors"
            placeholder="Ej: Corredores de Lima"
            disabled={isPending}
          />
          <p className="mt-1 text-sm text-slate-500">
            El nombre público de tu club de running
          </p>
        </div>

        {/* Slug Input */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            URL del Club (Slug)
          </label>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-3 rounded-l-lg border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-sm">
              tuapp.com/club/
            </span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={handleSlugChange}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 transition-colors"
              placeholder="corredores-de-lima"
              disabled={isPending}
            />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Se genera automáticamente desde el nombre. Solo letras minúsculas,
            números y guiones.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 text-slate-300 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors font-medium"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-orange-500/30"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </>
            ) : (
              'Crear Club'
            )}
          </button>
        </div>
      </form>

      {/* Preview */}
      {clubName && (
        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
          <p className="text-sm font-medium text-orange-400 mb-1">
            Vista previa:
          </p>
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-slate-50">{clubName}</span>
            <br />
            <span className="text-orange-400">
              URL: tuapp.com/club/{slug || '...'}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
