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
