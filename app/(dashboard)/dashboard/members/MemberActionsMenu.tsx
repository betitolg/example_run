'use client'

import { useState } from 'react'
import { updateMemberRole } from '../../members/actions'

interface MemberActionsMenuProps {
  memberId: string
  memberName: string
  currentRole: 'owner' | 'coach' | 'runner'
  isCurrentUser: boolean
  isOwner: boolean
}

export default function MemberActionsMenu({
  memberId,
  memberName,
  currentRole,
  isCurrentUser,
  isOwner,
}: MemberActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Mensaje de error inline en lugar de alert()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // No mostrar menú si no es owner, si es el usuario actual, o si el objetivo es owner
  if (!isOwner || isCurrentUser || currentRole === 'owner') {
    return null
  }

  const handleRoleChange = async (newRole: 'coach' | 'runner') => {
    setErrorMsg(null)
    setIsLoading(true)
    setIsOpen(false)

    try {
      const result = await updateMemberRole(memberId, newRole)

      if (!result.success) {
        setErrorMsg(result.error || 'Error al cambiar el rol')
      }
    } catch (err) {
      console.error('Error al cambiar rol:', err)
      setErrorMsg('Error inesperado al cambiar el rol')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Mensaje de error inline */}
      {errorMsg && (
        <p className="text-xs text-red-400 mb-1 text-right max-w-[14rem]">{errorMsg}</p>
      )}

      <button
        onClick={() => { setIsOpen(!isOpen); setErrorMsg(null) }}
        disabled={isLoading}
        className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Acciones para ${memberName}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {isLoading ? (
          <svg
            className="animate-spin w-5 h-5 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menú Dropdown */}
          <div role="menu" className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="py-1">
              {currentRole === 'runner' && (
                <button
                  role="menuitem"
                  onClick={() => handleRoleChange('coach')}
                  className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Ascender a Coach</p>
                    <p className="text-xs text-slate-400">Dar permisos de entrenador</p>
                  </div>
                </button>
              )}

              {currentRole === 'coach' && (
                <button
                  role="menuitem"
                  onClick={() => handleRoleChange('runner')}
                  className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Degradar a Runner</p>
                    <p className="text-xs text-slate-400">Quitar permisos de entrenador</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
