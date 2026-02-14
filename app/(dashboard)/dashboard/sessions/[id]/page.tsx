import AttendanceRow from './AttendanceRow'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface SessionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

interface MembershipWithProfile {
  user_id: string
  role: string
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
  } | {
    id: string
    full_name: string
    avatar_url: string | null
  }[]
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Obtener datos del evento
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*, clubs(name)')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // 2. Obtener todos los miembros del club
  const { data: memberships, error: membershipsError } = await supabase
    .from('memberships')
    .select(
      `
      user_id,
      role,
      profiles!inner (
        id,
        full_name,
        avatar_url
      )
    `
    )
    .eq('club_id', event.club_id)
    .eq('status', 'active')

  if (membershipsError) {
    console.error('Error al obtener miembros:', membershipsError)
  }

  // 3. Obtener registros de asistencia para este evento
  const { data: attendanceRecords, error: attendanceError } = await supabase
    .from('attendance')
    .select('user_id, status, check_in_time')
    .eq('event_id', id)

  if (attendanceError) {
    console.error('Error al obtener asistencia:', attendanceError)
  }

  // Crear un mapa de asistencia para búsqueda rápida
  const attendanceMap = new Map(
    attendanceRecords?.map((record) => [record.user_id, record.status]) || []
  )

  // Formatear fecha de manera bonita
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return date.toLocaleDateString('es-ES', options)
  }

  // Contar asistencias
  const attendedCount =
    attendanceRecords?.filter((r) => r.status === 'attended').length || 0
  const skippedCount =
    attendanceRecords?.filter((r) => r.status === 'skipped').length || 0
  const totalMembers = memberships?.length || 0
  const pendingCount = totalMembers - attendedCount - skippedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-slate-400 text-sm">
                {event.clubs?.name || 'Club'}
              </p>
            </div>
            <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <span className="text-orange-400 font-semibold text-sm">
                Sesión de Entrenamiento
              </span>
            </div>
          </div>

          {/* Información del evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Fecha y Hora
                </p>
                <p className="text-slate-200 font-medium">
                  {formatDate(event.start_time)}
                </p>
              </div>
            </div>

            {event.location_name && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Ubicación
                  </p>
                  <p className="text-slate-200 font-medium">
                    {event.location_name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {event.description && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-slate-300 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas de Asistencia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm mb-1">Total Miembros</p>
            <p className="text-3xl font-bold text-white">{totalMembers}</p>
          </div>
          <div className="bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/30 p-4">
            <p className="text-green-400 text-sm mb-1">Asistieron</p>
            <p className="text-3xl font-bold text-green-400">{attendedCount}</p>
          </div>
          <div className="bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/30 p-4">
            <p className="text-red-400 text-sm mb-1">No Asistieron</p>
            <p className="text-3xl font-bold text-red-400">{skippedCount}</p>
          </div>
          <div className="bg-slate-500/10 backdrop-blur-sm rounded-xl border border-slate-500/30 p-4">
            <p className="text-slate-400 text-sm mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-slate-300">{pendingCount}</p>
          </div>
        </div>

        {/* Lista de Asistencia */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Lista de Asistencia
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚪</span>
                <span className="text-slate-400">Sin registrar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="text-slate-400">Asistió</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">❌</span>
                <span className="text-slate-400">No asistió</span>
              </div>
            </div>
          </div>

          {/* Lista de miembros */}
          <div className="space-y-3">
            {memberships && memberships.length > 0 ? (
              memberships.map((membership: MembershipWithProfile) => {
                // profiles viene como array de Supabase, tomamos el primer elemento
                const profile = Array.isArray(membership.profiles) 
                  ? membership.profiles[0] 
                  : membership.profiles
                
                if (!profile) return null

                const currentStatus = attendanceMap.get(profile.id) || null

                return (
                  <AttendanceRow
                    key={profile.id}
                    profile={{
                      id: profile.id,
                      full_name: profile.full_name,
                      avatar_url: profile.avatar_url || undefined,
                    }}
                    eventId={id}
                    initialStatus={currentStatus as 'attended' | 'skipped' | null}
                  />
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">
                  No hay miembros registrados en este club
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de volver */}
        <div className="mt-6">
          <a
            href="/dashboard/sessions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-full transition-colors border border-slate-600"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver a Sesiones
          </a>
        </div>
      </div>
    </div>
  )
}
