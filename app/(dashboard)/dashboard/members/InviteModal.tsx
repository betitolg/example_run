'use client'

import { useEffect, useState } from 'react'
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface InviteModalProps {
  clubSlug: string
  variant?: 'default' | 'primary'
}

export default function InviteModal({ clubSlug, variant = 'default' }: InviteModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/club/${clubSlug}`

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const buttonClass =
    variant === 'primary'
      ? 'px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2'
      : 'px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2'

  return (
    <>
      {/* Botón disparador */}
      <button onClick={() => setIsOpen(true)} className={buttonClass}>
        <LinkIcon className="w-5 h-5" />
        Invitar Corredores
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          aria-describedby="invite-modal-desc"
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Fondo semitransparente */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Contenido del modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
              {/* Encabezado */}
              <div className="mb-4">
                <h3 id="invite-modal-title" className="text-xl font-semibold text-slate-50">
                  Invitar Corredores
                </h3>
                <p id="invite-modal-desc" className="text-sm text-slate-400 mt-1">
                  Comparte este link para que se unan a tu club
                </p>
              </div>

              {/* URL de invitación */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Link de Invitación
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-sm text-slate-300"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-orange-400 mb-2">
                  ¿Cómo funciona?
                </h4>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Copia el link de invitación</li>
                  <li>Compártelo con tus corredores</li>
                  <li>Ellos se registran y se unen automáticamente</li>
                </ol>
              </div>

              {/* Acciones */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
