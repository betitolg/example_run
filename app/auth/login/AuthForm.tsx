'use client'

import { login, signup } from '@/app/auth/actions'
import { useActionState, useState } from 'react'

const initialState = {
  success: false,
  error: undefined,
}

interface AuthFormProps {
  nextUrl: string
}

export default function AuthForm({ nextUrl }: AuthFormProps) {
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-50 mb-2">
              Running Club
            </h1>
            <p className="text-slate-400">
              {isSignup
                ? 'Crea tu cuenta gratis'
                : 'Inicia sesión en tu cuenta'}
            </p>
          </div>

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

          {/* Auth Form */}
          <form action={formAction} className="space-y-6">
            {/* Hidden input for next URL */}
            <input type="hidden" name="next" value={nextUrl} />

            {/* Full Name - Only for Signup */}
            {isSignup && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 transition-colors"
                  placeholder="Tu nombre"
                  disabled={isPending}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 transition-colors"
                placeholder="tu@email.com"
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-50 placeholder-slate-500 transition-colors"
                placeholder="••••••••"
                disabled={isPending}
              />
              {isSignup && (
                <p className="mt-1 text-sm text-slate-500">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-full hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-orange-500/30"
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
              className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
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
