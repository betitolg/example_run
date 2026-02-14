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

  // No mostrar menú si no es owner o si es el usuario actual o si es owner
  if (!isOwner || isCurrentUser || currentRole === 'owner') {
    return null
  }

  const handleRoleChange = async (newRole: 'coach' | 'runner') => {
    if (!confirm(`¿Estás seguro de cambiar el rol de ${memberName}?`)) {
      return
    }

    setIsLoading(true)
    setIsOpen(false)

    try {
      const result = await updateMemberRole(memberId, newRole)

      if (!result.success) {
        alert(result.error || 'Error al cambiar el rol')
      }
    } catch (err) {
      console.error('Error al cambiar rol:', err)
      alert('Error inesperado al cambiar el rol')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!confirm(`¿Estás seguro de eliminar a ${memberName} del club? Esta acción no se puede deshacer.`)) {
      return
    }

    alert('Función de eliminación no implementada aún')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Acciones del miembro"
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menú Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="py-1">
              {currentRole === 'runner' && (
                <button
                  onClick={() => handleRoleChange('coach')}
                  className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
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

              <div className="border-t border-slate-700 my-1"></div>

              <button
                onClick={handleRemoveMember}
                className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <div>
                  <p className="font-medium">Eliminar del Club</p>
                  <p className="text-xs text-red-400/70">Acción permanente</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
