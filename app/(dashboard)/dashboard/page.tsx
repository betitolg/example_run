import CreateClubForm from '@/components/CreateClubForm'
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
  // Usamos limit(1) para tomar solo la primera membresía si hay múltiples
  const { data: memberships, error } = await supabase
    .from('memberships')
    .select('*, clubs(*)') // Traemos también los datos del club relacionado
    .eq('user_id', user.id)
    .limit(1)

  // Debug: Log de errores de RLS o permisos
  if (error) {
    console.log('Error fetching membership:', error)
  }

  // Tomar la primera membresía del array (si existe)
  const membership = memberships && memberships.length > 0 ? memberships[0] : null

  // 3. LOGICA CONDICIONAL (El "Gatekeeper")
  
  // CASO A: Usuario Nuevo (Sin Club) -> Mostrar Formulario de Onboarding
  if (!membership) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-950">
        <CreateClubForm />
      </div>
    )
  }

  // CASO B: Usuario con Club -> Mostrar Dashboard Real
  // (Aquí accedemos a los datos reales del club)
  const clubName = membership.clubs?.name || 'Tu Club'
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Corredor'
  const userRole = membership.role === 'owner' ? 'Dueño' : membership.role === 'coach' ? 'Coach' : 'Corredor'

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header - Bento Grid Principal */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-50 mb-2">
                Bienvenido, {userName}
              </h1>
              <p className="text-slate-400 text-lg">
                {userRole} de <span className="text-orange-500 font-semibold">{clubName}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-orange-500/50">
                {clubName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Miembros Totales"
          value="1" 
          change="¡Eres el primero!"
          icon="👥"
          positive
        />
        <StatCard
          title="Entrenamientos"
          value="0"
          change="Crear primero"
          icon="🏃"
          positive={false}
        />
        <StatCard
          title="Próximo Evento"
          value="--"
          change="Sin programar"
          icon="📅"
          positive={false}
        />
        <StatCard
          title="Actividad"
          value="100%"
          change="¡Excelente!"
          icon="⚡"
          positive
        />
      </div>

      {/* Quick Actions - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          title="Invitar Corredores"
          description="Comparte el link de tu club y haz crecer tu comunidad"
          buttonText="Invitar Ahora"
          href="/dashboard/members"
          icon="🎯"
        />
        <ActionCard
          title="Crear Entrenamiento"
          description="Programa tu primera sesión y comienza a entrenar"
          buttonText="Nueva Sesión"
          href="/dashboard/sessions/new"
          icon="🚀"
        />
      </div>

      {/* Activity Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-50 mb-3">
            Todo listo para empezar
          </h2>
          <p className="text-slate-400 text-lg mb-6">
            Ya tienes tu club creado. El siguiente paso es invitar a tus corredores o crear tu primer entrenamiento.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard/members"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              Invitar Miembros
            </a>
            <a
              href="/dashboard/sessions/new"
              className="px-6 py-3 bg-slate-800 text-slate-50 font-semibold rounded-full hover:bg-slate-700 transition-all border border-slate-700"
            >
              Crear Sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Componentes UI Rediseñados ---

function StatCard({
  title,
  value,
  change,
  icon,
  positive,
}: {
  title: string
  value: string
  change: string
  icon: string
  positive?: boolean
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all shadow-xl hover:shadow-orange-500/10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-5xl font-black text-orange-500 mb-3">{value}</p>
      <p
        className={`text-sm font-medium ${
          positive === undefined
            ? 'text-slate-500'
            : positive
            ? 'text-green-400'
            : 'text-slate-500'
        }`}
      >
        {change}
      </p>
    </div>
  )
}

function ActionCard({
  title,
  description,
  buttonText,
  href,
  icon,
}: {
  title: string
  description: string
  buttonText: string
  href: string
  icon: string
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all shadow-xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-50 mb-2">{title}</h3>
          <p className="text-slate-400 mb-4">{description}</p>
          <a
            href={href}
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}