import CreateClubForm from '@/components/CreateClubForm'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // 1. Conectar a Supabase y obtener usuario
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 2. Buscar si este usuario ya pertenece a algún club
  const { data: memberships, error } = await supabase
    .from('memberships')
    .select('*, clubs(*)')
    .eq('user_id', user.id)
    .limit(1)

  if (error) {
    console.log('Error fetching membership:', error)
  }

  const membership = memberships && memberships.length > 0 ? memberships[0] : null

  // CASO A: Usuario Nuevo (Sin Club) -> Mostrar Formulario de Onboarding
  if (!membership) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-950">
        <CreateClubForm />
      </div>
    )
  }

  // CASO B: Usuario con Club -> Fetch Data en Paralelo
  const clubId = membership.club_id
  const clubName = membership.clubs?.name || 'Tu Club'

  // 3. DATA FETCHING EN PARALELO (Promise.all)
  const [statsResult, nextEventResult, lastAttendanceResult] = await Promise.all([
    // Stats del Club: Cantidad total de miembros activos
    supabase
      .from('memberships')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('status', 'active'),

    // Próximo Evento: El evento futuro más cercano
    supabase
      .from('events')
      .select('id, title, start_time, location_name')
      .eq('club_id', clubId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(1)
      .single(),

    // Último Evento para calcular asistencia
    supabase
      .from('events')
      .select('id')
      .eq('club_id', clubId)
      .lte('start_time', new Date().toISOString())
      .order('start_time', { ascending: false })
      .limit(1)
      .single(),
  ])

  const totalMembers = statsResult.count || 0
  const nextEvent = nextEventResult.data
  
  // Calcular % de asistencia del último evento
  let attendancePercentage = null
  if (lastAttendanceResult.data) {
    const lastEventId = lastAttendanceResult.data.id
    
    const [attendedResult, totalMembersAtTime] = await Promise.all([
      supabase
        .from('attendance')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', lastEventId)
        .eq('status', 'attended'),
      
      supabase
        .from('memberships')
        .select('id', { count: 'exact', head: true })
        .eq('club_id', clubId)
        .eq('status', 'active'),
    ])

    const attended = attendedResult.count || 0
    const total = totalMembersAtTime.count || 1
    attendancePercentage = Math.round((attended / total) * 100)
  }

  // Formatear fecha del próximo evento
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('es-ES', { month: 'short' })
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return { day, month, time }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* CAJA 1: Hero - Próximo Entrenamiento (Ancho Completo) */}
        <div className="md:col-span-3 relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl hover:border-orange-500/50 transition-all group">
          {/* Fondo de mapa oscurecido */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
          
          <div className="relative p-8 md:p-12">
            {nextEvent ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-3 font-semibold">
                    Próximo Entrenamiento
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                    {nextEvent.title}
                  </h2>
                  {nextEvent.location_name && (
                    <div className="flex items-center gap-2 text-slate-300 mb-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg">{nextEvent.location_name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-7xl font-black text-orange-500 leading-none mb-2">
                      {formatEventDate(nextEvent.start_time).day}
                    </div>
                    <div className="text-orange-400 uppercase text-sm font-bold tracking-wider">
                      {formatEventDate(nextEvent.start_time).month}
                    </div>
                  </div>
                  <div className="h-20 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {formatEventDate(nextEvent.start_time).time}
                    </div>
                    <div className="text-slate-400 text-sm">Hora</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  No hay entrenamientos programados
                </h2>
                <p className="text-slate-400 mb-6">
                  Crea tu primera sesión y comienza a entrenar con tu equipo
                </p>
                <Link
                  href="/dashboard/sessions/new"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                >
                  Crear Evento
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CAJA 2: Miembros Activos (Cuadrada) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:border-orange-500/50 transition-all">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-4 font-semibold">
                Miembros Activos
              </p>
              <div className="text-8xl font-black text-orange-500 mb-4">
                {totalMembers}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">
                {totalMembers === 1 ? 'Miembro' : 'Miembros'} en {clubName}
              </span>
            </div>
          </div>
        </div>

        {/* CAJA 3: Última Asistencia (Cuadrada) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:border-orange-500/50 transition-all">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-4 font-semibold">
                Última Asistencia
              </p>
              {attendancePercentage !== null ? (
                <>
                  <div className="text-8xl font-black text-orange-500 mb-4">
                    {attendancePercentage}%
                  </div>
                  {/* Barra de progreso */}
                  <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 shadow-lg shadow-orange-500/50"
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-slate-500 text-sm">
                    Sin datos aún
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">
                {attendancePercentage !== null ? 'Último evento' : 'Esperando datos'}
              </span>
            </div>
          </div>
        </div>

        {/* CAJA 4: Accesos Rápidos (Rectangular - Ancho Completo) */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-6 font-semibold">
            Accesos Rápidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/members"
              className="group flex items-center gap-4 p-6 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                  Invitar Atleta
                </p>
                <p className="text-slate-400 text-sm">
                  Agregar miembros
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/sessions/new"
              className="group flex items-center gap-4 p-6 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                  Nueva Sesión
                </p>
                <p className="text-slate-400 text-sm">
                  Crear entrenamiento
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/sessions"
              className="group flex items-center gap-4 p-6 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                  Ver Sesiones
                </p>
                <p className="text-slate-400 text-sm">
                  Historial completo
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}