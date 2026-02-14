'use client'

import { useOptimistic, useState } from 'react'

import Image from 'next/image'
import { toggleAttendance } from '../actions'

type AttendanceStatus = 'attended' | 'skipped' | null

interface Profile {
  id: string
  full_name: string
  avatar_url?: string
}

interface AttendanceRowProps {
  profile: Profile
  eventId: string
  initialStatus: AttendanceStatus
}

export default function AttendanceRow({
  profile,
  eventId,
  initialStatus,
}: AttendanceRowProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: AttendanceStatus) => {
    // Actualización optimista
    setOptimisticStatus(newStatus)
    setIsLoading(true)

    try {
      // Si el nuevo status es null, no hacemos nada (no hay forma de "borrar" asistencia por ahora)
      if (newStatus === null) {
        setIsLoading(false)
        return
      }

      const result = await toggleAttendance(eventId, profile.id, newStatus)

      if (!result.success) {
        console.error('Error al actualizar asistencia:', result.error)
        // Revertir cambio optimista en caso de error
        setOptimisticStatus(initialStatus)
      }
    } catch (error) {
      console.error('Error al actualizar asistencia:', error)
      // Revertir cambio optimista
      setOptimisticStatus(initialStatus)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
      {/* Avatar y Nombre */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-orange-500/30 overflow-hidden">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            getInitials(profile.full_name)
          )}
        </div>
        <div>
          <p className="font-medium text-slate-200">{profile.full_name}</p>
          <p className="text-xs text-slate-400">
            {optimisticStatus === 'attended'
              ? 'Asistió'
              : optimisticStatus === 'skipped'
              ? 'No asistió'
              : 'Sin registrar'}
          </p>
        </div>
      </div>

      {/* Botones de Estado */}
      <div className="flex items-center gap-2">
        {/* Botón Sin Registrar */}
        <button
          onClick={() => handleStatusChange(null)}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            optimisticStatus === null
              ? 'bg-slate-600 border-2 border-slate-400 shadow-lg'
              : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50'
          }`}
          title="Sin registrar"
        >
          <span className="text-slate-400 text-xl">⚪</span>
        </button>

        {/* Botón Asistió */}
        <button
          onClick={() => handleStatusChange('attended')}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            optimisticStatus === 'attended'
              ? 'bg-green-500 border-2 border-green-400 shadow-lg shadow-green-500/30'
              : 'bg-slate-700/50 border border-slate-600 hover:bg-green-500/20 hover:border-green-500/50'
          }`}
          title="Asistió"
        >
          <span className="text-xl">✅</span>
        </button>

        {/* Botón No Asistió */}
        <button
          onClick={() => handleStatusChange('skipped')}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            optimisticStatus === 'skipped'
              ? 'bg-red-500 border-2 border-red-400 shadow-lg shadow-red-500/30'
              : 'bg-slate-700/50 border border-slate-600 hover:bg-red-500/20 hover:border-red-500/50'
          }`}
          title="No asistió"
        >
          <span className="text-xl">❌</span>
        </button>

        {/* Indicador de carga */}
        {isLoading && (
          <div className="ml-2">
            <svg
              className="animate-spin h-4 w-4 text-orange-500"
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
          </div>
        )}
      </div>
    </div>
  )
}
