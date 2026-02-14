import InviteModal from './InviteModal'
import MemberActionsMenu from './MemberActionsMenu'
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

  // 2. Obtener club_id y role del usuario (toma el primero si hay múltiples)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('club_id, role, clubs(slug)')
    .eq('user_id', user.id)
    .limit(1)

  const userMembership = memberships && memberships.length > 0 ? memberships[0] : null

  if (!userMembership) {
    redirect('/dashboard')
  }

  const isOwner = userMembership.role === 'owner'

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
        /* Members Table - Diseño Moderno */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              {/* Header con diseño moderno */}
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800/50">
                {members.map((member) => {
                  const profile = Array.isArray(member.profiles) 
                    ? member.profiles[0] 
                    : member.profiles
                  
                  const memberName = profile?.full_name || 'Sin nombre'
                  const memberEmail = profile?.email || ''
                  const memberInitial = memberName[0]?.toUpperCase() || memberEmail[0]?.toUpperCase() || 'U'
                  const isCurrentUser = profile?.id === user.id

                  return (
                    <tr 
                      key={member.id} 
                      className="hover:bg-slate-800/30 transition-all duration-150"
                    >
                      {/* Avatar + Name + Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {/* Avatar redondo con gradiente */}
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30 ring-2 ring-slate-800">
                              {memberInitial}
                            </div>
                            {/* Indicador de usuario actual */}
                            {isCurrentUser && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                              {memberName}
                              {isCurrentUser && (
                                <span className="text-xs text-slate-400 font-normal">(Tú)</span>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">
                              {memberEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge - Colores mejorados */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
                            member.role === 'owner'
                              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                              : member.role === 'coach'
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                              : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                          }`}
                        >
                          {member.role === 'owner'
                            ? '👑 Dueño'
                            : member.role === 'coach'
                            ? '🎯 Coach'
                            : '🏃 Corredor'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
                            member.status === 'active'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-500/10'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              member.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                            }`}></span>
                            {member.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(member.joined_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions Menu */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <MemberActionsMenu
                          memberId={member.id}
                          memberName={memberName}
                          currentRole={member.role as 'owner' | 'coach' | 'runner'}
                          isCurrentUser={isCurrentUser}
                          isOwner={isOwner}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer con estadísticas */}
          <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Total de miembros: <span className="font-bold text-orange-500">{members.length}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>
                  Owners: {members.filter(m => m.role === 'owner').length}
                </span>
                <span>•</span>
                <span>
                  Coaches: {members.filter(m => m.role === 'coach').length}
                </span>
                <span>•</span>
                <span>
                  Runners: {members.filter(m => m.role === 'runner').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
