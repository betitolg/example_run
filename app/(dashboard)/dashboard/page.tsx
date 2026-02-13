export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu panel de control del club de running
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Miembros Activos"
          value="124"
          change="+12%"
          positive
        />
        <StatCard
          title="Sesiones este Mes"
          value="18"
          change="+5%"
          positive
        />
        <StatCard
          title="Asistencia Promedio"
          value="85%"
          change="+3%"
          positive
        />
        <StatCard
          title="Próxima Sesión"
          value="Hoy 6:00 PM"
          change="En 4 horas"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          <ActivityItem
            title="Nueva inscripción"
            description="Juan Pérez se unió al club"
            time="Hace 2 horas"
          />
          <ActivityItem
            title="Sesión completada"
            description="Entrenamiento de velocidad - 15 asistentes"
            time="Hace 5 horas"
          />
          <ActivityItem
            title="Nuevo registro"
            description="María García registró un nuevo récord personal"
            time="Ayer"
          />
        </div>
      </div>
    </div>
  )
}

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

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  )
}
