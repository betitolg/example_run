'use client'

import { useState } from 'react'
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface InviteModalProps {
  clubSlug: string
  variant?: 'default' | 'primary'
}

export default function InviteModal({ clubSlug, variant = 'default' }: InviteModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/club/${clubSlug}`

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
      ? 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2'
      : 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2'

  return (
    <>
      {/* Trigger Button */}
      <button onClick={() => setIsOpen(true)} className={buttonClass}>
        <LinkIcon className="w-5 h-5" />
        Invitar Corredores
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Invitar Corredores
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Comparte este link para que se unan a tu club
                </p>
              </div>

              {/* URL Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link de Invitación
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
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

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  ¿Cómo funciona?
                </h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copia el link de invitación</li>
                  <li>Compártelo con tus corredores</li>
                  <li>Ellos se registran y se unen automáticamente</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
