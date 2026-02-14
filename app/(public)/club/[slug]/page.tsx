import JoinClubButton from './JoinClubButton'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

interface ClubPageProps {
  params: {
    slug: string
  }
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Buscar el club por slug
  const { data: club, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !club) {
    notFound()
  }

  // 2. Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Si está autenticado, verificar si ya es miembro
  let isMember = false
  if (user) {
    const { data: membership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('club_id', club.id)
      .limit(1)

    isMember = !!(membership && membership.length > 0)
  }

  return (
    <div className="w-full">
      {/* Club Info */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              {/* Logo Placeholder */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold shadow-lg">
                {club.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
                <p className="text-orange-100 text-lg">
                  Únete a nuestra comunidad de corredores
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-50 mb-4">
                Sobre el Club
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {club.description ||
                  'Un club de running dedicado a promover un estilo de vida saludable a través del deporte. Únete a nosotros para entrenar, competir y hacer nuevos amigos.'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-slate-800/50 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">50+</div>
                <div className="text-sm text-slate-400 mt-1">Miembros</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">20+</div>
                <div className="text-sm text-slate-400 mt-1">Entrenamientos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">5+</div>
                <div className="text-sm text-slate-400 mt-1">Eventos</div>
              </div>
            </div>

            {/* Join Button */}
            <JoinClubButton
              clubId={club.id}
              clubSlug={slug}
              isAuthenticated={!!user}
              isMember={isMember}
            />

            {/* Additional Info */}
            {isMember && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-center">
                  ✓ Ya eres miembro de este club.{' '}
                  <a
                    href="/dashboard"
                    className="font-medium underline hover:text-green-300"
                  >
                    Ir al Dashboard
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
