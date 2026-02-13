'use client'

import { useActionState } from 'react'
import { createSessionAction } from '../actions'
import Link from 'next/link'

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
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Nueva Sesión de Entrenamiento
          </h1>
          <p className="text-gray-600 mt-2">
            Programa un nuevo entrenamiento para tu club
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
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
                  <p className="text-sm text-red-800">{state.error}</p>
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Título del Entrenamiento *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Entrenamiento de Velocidad"
                disabled={isPending}
              />
            </div>

            {/* Date and Time */}
            <div>
              <label
                htmlFor="start_time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha y Hora *
              </label>
              <input
                id="start_time"
                name="start_time"
                type="datetime-local"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPending}
              />
              <p className="mt-1 text-sm text-gray-500">
                Selecciona cuándo será el entrenamiento
              </p>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ubicación
              </label>
              <input
                id="location_name"
                name="location_name"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Parque Kennedy"
                disabled={isPending}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe el tipo de entrenamiento, objetivos, etc."
                disabled={isPending}
              />
              <p className="mt-1 text-sm text-gray-500">
                Información adicional sobre la sesión (opcional)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Link
                href="/dashboard/sessions"
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
