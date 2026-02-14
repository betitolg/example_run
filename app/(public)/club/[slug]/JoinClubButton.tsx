'use client'

import { joinClub } from '../../actions'
import { useState } from 'react'

interface JoinClubButtonProps {
  clubId: string
  clubSlug: string
  isAuthenticated: boolean
  isMember: boolean
}

export default function JoinClubButton({
  clubId,
  clubSlug,
  isAuthenticated,
  isMember,
}: JoinClubButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async () => {
    setIsLoading(true)
    setError(null)

    const result = await joinClub({ success: false, error: undefined }, clubId)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // Si no hay error, el redirect se ejecutará automáticamente
  }

  // Si no está autenticado, redirigir a login con next parameter
  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <a
          href={`/auth/login?next=/club/${clubSlug}`}
          className="inline-block w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          Unirme al Club
        </a>
        <p className="mt-3 text-sm text-slate-400">
          Necesitas iniciar sesión para unirte
        </p>
      </div>
    )
  }

  // Si ya es miembro, no mostrar botón
  if (isMember) {
    return null
  }

  // Usuario autenticado pero no es miembro
  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Join Button */}
      <button
        onClick={handleJoin}
        disabled={isLoading}
        className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
      >
        {isLoading ? (
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
              Uniéndome...
            </>
          ) : (
          'Unirme al Club'
        )}
      </button>

      <p className="mt-3 text-sm text-slate-400 text-center">
        Al unirte, tendrás acceso a todos los entrenamientos y eventos del club
      </p>
    </div>
  )
}
