import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

import type { Event } from '@/types/database'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SessionsPage() {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 2. Obtener club_id del usuario
  const { data: membership } = await supabase
    .from('memberships')
    .select('club_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    redirect('/dashboard')
  }

  // 3. Consultar eventos del club, ordenados por fecha
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('club_id', membership.club_id)
    .order('start_time', { ascending: true })

  // 4. Verificar si el usuario puede crear sesiones
  const canCreateSessions = membership.role === 'owner' || membership.role === 'coach'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sesiones de Entrenamiento
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona los entrenamientos de tu club
          </p>
        </div>

        {canCreateSessions && (
          <Link
            href="/dashboard/sessions/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" />
            Nueva Sesión
          </Link>
        )}
      </div>

      {/* Empty State */}
      {!events || events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No hay entrenamientos programados
            </h2>
            <p className="text-gray-500 mb-6">
              {canCreateSessions
                ? 'Comienza creando tu primera sesión de entrenamiento'
                : 'Aún no hay sesiones programadas por los coaches'}
            </p>
            {canCreateSessions && (
              <Link
                href="/dashboard/sessions/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <CalendarIcon className="w-5 h-5" />
                Crear Primera Sesión
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const startDate = new Date(event.start_time)
  
  // Formatear fecha
  const dayNumber = startDate.getDate()
  const month = startDate.toLocaleDateString('es-ES', { month: 'short' })
  const time = startDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const weekday = startDate.toLocaleDateString('es-ES', { weekday: 'long' })

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Date Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{dayNumber}</div>
            <div className="text-sm uppercase">{month}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm opacity-90 capitalize">{weekday}</div>
            <div className="flex items-center gap-1 mt-1">
              <ClockIcon className="w-4 h-4" />
              <span className="font-medium">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {event.location_name && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4" />
            <span>{event.location_name}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          Ver Detalles
        </button>
      </div>
    </div>
  )
}
