import InviteModal from './InviteModal'
import { UserIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MembersPage() {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 2. Obtener club_id del usuario (toma el primero si hay múltiples)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('club_id, clubs(slug)')
    .eq('user_id', user.id)
    .limit(1)

  const userMembership = memberships && memberships.length > 0 ? memberships[0] : null

  if (!userMembership) {
    redirect('/dashboard')
  }

  // Supabase retorna clubs como array, tomar el primero
  const clubs = userMembership.clubs as any
  const clubSlug = (Array.isArray(clubs) ? clubs[0]?.slug : clubs?.slug) || ''

  // 3. Consultar todos los miembros del club con sus perfiles
  const { data: clubMembers } = await supabase
    .from('memberships')
    .select(`
      id,
      role,
      status,
      joined_at,
      profiles (
        id,
        email,
        full_name
      )
    `)
    .eq('club_id', userMembership.club_id)
    .order('joined_at', { ascending: true })

  const members = clubMembers || []
  const isOnlyOwner = members.length === 1 && members[0].role === 'owner'

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Miembros del Club</h1>
          <p className="text-slate-400 mt-2">
            Gestiona los miembros de tu club de running
          </p>
        </div>

        {/* Invite Button */}
        <InviteModal clubSlug={clubSlug} />
      </div>

      {/* Empty State - Solo Owner */}
      {isOnlyOwner ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-50 mb-3">
              ¡Invita a tu primer corredor!
            </h2>
            <p className="text-slate-400 mb-6">
              Tu club está listo. Comparte el link de invitación con tus corredores
              para que se unan y comiencen a entrenar juntos.
            </p>
            <InviteModal clubSlug={clubSlug} variant="primary" />
          </div>
        </div>
      ) : (
        /* Members Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Avatar + Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-orange-500/30">
                            {(() => {
                              const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
                              return profile?.full_name?.[0]?.toUpperCase() ||
                                profile?.email?.[0]?.toUpperCase() ||
                                'U'
                            })()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-50">
                            {(() => {
                              const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
                              return profile?.full_name || 'Sin nombre'
                            })()}
                          </div>
                          <div className="text-sm text-slate-400">
                            {(() => {
                              const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
                              return profile?.email
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.role === 'owner'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : member.role === 'coach'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-700 text-slate-300 border border-slate-600'
                        }`}
                      >
                        {member.role === 'owner'
                          ? 'Dueño'
                          : member.role === 'coach'
                          ? 'Coach'
                          : 'Corredor'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {member.status === 'active' ? 'Activo' : 'Pendiente'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(member.joined_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Total de miembros: <span className="font-semibold text-orange-500">{members.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
