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
  const { data: membership, error } = await supabase
    .from('memberships')
    .select('*, clubs(*)') // Traemos también los datos del club relacionado
    .eq('user_id', user.id)
    .maybeSingle()

  // Debug: Log de errores de RLS o permisos
  if (error) {
    console.log('Error fetching membership:', error)
  }

  // 3. LOGICA CONDICIONAL (El "Gatekeeper")
  
  // CASO A: Usuario Nuevo (Sin Club) -> Mostrar Formulario de Onboarding
  if (!membership) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <CreateClubForm />
      </div>
    )
  }

  // CASO B: Usuario con Club -> Mostrar Dashboard Real
  // (Aquí accedemos a los datos reales del club)
  const clubName = membership.clubs?.name || 'Tu Club'
  const userRole = membership.role === 'owner' ? 'Dueño' : 'Miembro'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{clubName}</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {userRole}. Aquí está el resumen de tu club.
        </p>
      </div>

      {/* Stats Grid (Mantuvimos tu diseño original) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Miembros Totales"
          value="1" 
          change="¡Eres el primero!"
          positive
        />
        <StatCard
          title="Próximo Evento"
          value="Sin programar"
          change="Crear evento"
          positive={false}
        />
        {/* Aquí puedes agregar más cards reales conectadas a la DB */}
      </div>

      {/* Placeholder de Actividad */}
      <div className="bg-white rounded-lg shadow p-6 text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Todo listo para empezar
          </h2>
          <p className="text-gray-500">
            Ya tienes tu club creado. El siguiente paso es invitar a tus corredores o crear tu primer entrenamiento.
          </p>
        </div>
      </div>
    </div>
  )
}

// --- Componentes UI (Los mantuve igual para que no se rompa el diseño) ---

function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string
  value: string
  change: string
  positive?: boolean
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p
        className={`text-sm ${
          positive === undefined
            ? 'text-gray-500'
            : positive
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      >
        {change}
      </p>
    </div>
  )
}