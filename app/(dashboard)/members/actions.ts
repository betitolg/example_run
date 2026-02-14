'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface MemberResult {
  success: boolean
  error?: string
}

/**
 * Remove a member from the club
 * TODO: Implement this function when member management is needed
 * Only owners should be able to remove members
 */
export async function removeMember(
  prevState: MemberResult,
  memberId: string
): Promise<MemberResult> {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'No hay sesión de usuario activa',
    }
  }

  // 2. TODO: Verificar que el usuario actual sea owner del club
  // 3. TODO: No permitir eliminar al owner
  // 4. TODO: Eliminar la membresía

  return {
    success: false,
    error: 'Función no implementada aún',
  }
}

export async function updateMemberRole(
  memberId: string,
  newRole: 'coach' | 'runner'
): Promise<MemberResult> {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'No hay sesión de usuario activa',
    }
  }

  // 2. Obtener el club_id y role del usuario actual
  const { data: currentUserMembership, error: currentUserError } =
    await supabase
      .from('memberships')
      .select('club_id, role')
      .eq('user_id', user.id)
      .single()

  if (currentUserError || !currentUserMembership) {
    return {
      success: false,
      error: 'No perteneces a ningún club',
    }
  }

  // 3. SEGURIDAD CRÍTICA: Solo los owners pueden cambiar roles
  if (currentUserMembership.role !== 'owner') {
    return {
      success: false,
      error: 'Solo los propietarios del club pueden cambiar roles',
    }
  }

  // 4. Verificar que el miembro objetivo pertenezca al mismo club
  const { data: targetMembership, error: targetError } = await supabase
    .from('memberships')
    .select('club_id, role, user_id')
    .eq('id', memberId)
    .single()

  if (targetError || !targetMembership) {
    return {
      success: false,
      error: 'Miembro no encontrado',
    }
  }

  // 5. Verificar que pertenezcan al mismo club
  if (targetMembership.club_id !== currentUserMembership.club_id) {
    return {
      success: false,
      error: 'No puedes modificar miembros de otro club',
    }
  }

  // 6. No permitir cambiar el rol del owner
  if (targetMembership.role === 'owner') {
    return {
      success: false,
      error: 'No puedes cambiar el rol del propietario del club',
    }
  }

  // 7. No permitir que el owner se cambie su propio rol
  if (targetMembership.user_id === user.id) {
    return {
      success: false,
      error: 'No puedes cambiar tu propio rol',
    }
  }

  // 8. Actualizar el rol en la tabla memberships
  const { error: updateError } = await supabase
    .from('memberships')
    .update({ role: newRole })
    .eq('id', memberId)

  if (updateError) {
    console.error('Error al actualizar rol:', updateError)
    return {
      success: false,
      error: 'Error al actualizar el rol del miembro',
    }
  }

  // 9. Revalidar la página de miembros
  revalidatePath('/dashboard/members')

  return {
    success: true,
  }
}
