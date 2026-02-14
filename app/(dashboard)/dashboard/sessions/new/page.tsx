'use client'

import Link from 'next/link'
import { createSessionAction } from '../actions'
import { useActionState } from 'react'

const initialState = {
  success: false,
  error: undefined,
}

export default function NewSessionPage() {
  const [state, formAction, isPending] = useActionState(
    createSessionAction,
    initialState
  )

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50">
            Nueva Sesión de Entrenamiento
          </h1>
          <p className="text-slate-400 mt-2">
            Programa un nuevo entrenamiento para tu club
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
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

          {/* Form */}
          <form action={formAction} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Título del Entrenamiento *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500"
                placeholder="Ej: Entrenamiento de Velocidad"
                disabled={isPending}
              />
            </div>

            {/* Date and Time */}
            <div>
              <label
                htmlFor="start_time"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Fecha y Hora *
              </label>
              <input
                id="start_time"
                name="start_time"
                type="datetime-local"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50"
                disabled={isPending}
              />
              <p className="mt-1 text-sm text-slate-500">
                Selecciona cuándo será el entrenamiento
              </p>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location_name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Ubicación
              </label>
              <input
                id="location_name"
                name="location_name"
                type="text"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500"
                placeholder="Ej: Parque Kennedy"
                disabled={isPending}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 resize-none"
                placeholder="Describe el tipo de entrenamiento, objetivos, etc."
                disabled={isPending}
              />
              <p className="mt-1 text-sm text-slate-500">
                Información adicional sobre la sesión (opcional)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Link
                href="/dashboard/sessions"
                className="px-6 py-3 text-slate-300 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors font-medium"
              >
                Cancelar
              </Link>
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
                  'Crear Sesión'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
