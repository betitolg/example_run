'use client'

import { login, signup } from '@/app/auth/actions'
import { useActionState, useState } from 'react'

const initialState = {
  success: false,
  error: undefined,
}

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState
  )
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    initialState
  )

  const state = isSignup ? signupState : loginState
  const formAction = isSignup ? signupAction : loginAction
  const isPending = isSignup ? signupPending : loginPending

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Running Club
            </h1>
            <p className="text-gray-600">
              {isSignup
                ? 'Crea tu cuenta gratis'
                : 'Inicia sesión en tu cuenta'}
            </p>
          </div>

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

          {/* Auth Form */}
          <form action={formAction} className="space-y-6">
            {/* Full Name - Only for Signup */}
            {isSignup && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre"
                  disabled={isPending}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={isPending}
              />
              {isSignup && (
                <p className="mt-1 text-sm text-gray-500">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isPending
                ? isSignup
                  ? 'Creando cuenta...'
                  : 'Iniciando sesión...'
                : isSignup
                ? 'Crear Cuenta'
                : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignup
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate gratis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
