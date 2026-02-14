'use client'

import { useState } from 'react'
import { updateMemberRole } from '../../members/actions'

interface RoleChangeButtonProps {
  memberId: string
  currentRole: 'owner' | 'coach' | 'runner'
  isCurrentUser: boolean
  isOwner: boolean
}

export default function RoleChangeButton({
  memberId,
  currentRole,
  isCurrentUser,
  isOwner,
}: RoleChangeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // No mostrar acciones si no es owner o si es el usuario actual
  if (!isOwner || isCurrentUser || currentRole === 'owner') {
    return null
  }

  const handleRoleChange = async (newRole: 'coach' | 'runner') => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateMemberRole(memberId, newRole)

      if (!result.success) {
        setError(result.error || 'Error al cambiar el rol')
      }
    } catch (err) {
      console.error('Error al cambiar rol:', err)
      setError('Error inesperado al cambiar el rol')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {currentRole === 'runner' ? (
        <button
          onClick={() => handleRoleChange('coach')}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Procesando...
            </span>
          ) : (
            '↑ Hacer Coach'
          )}
        </button>
      ) : currentRole === 'coach' ? (
        <button
          onClick={() => handleRoleChange('runner')}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 hover:border-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Procesando...
            </span>
          ) : (
            '↓ Degradar a Runner'
          )}
        </button>
      ) : null}

      {error && (
        <div className="absolute mt-16 p-2 bg-red-500/10 border border-red-500/50 rounded-lg text-xs text-red-400 max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}
