'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface JoinResult {
  success: boolean
  error?: string
}

export async function joinClub(
  prevState: JoinResult,
  clubId: string
): Promise<JoinResult> {
  // 1. Verificar autenticación
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'Debes iniciar sesión para unirte al club',
    }
  }

  // 2. Verificar si el usuario ya es miembro
  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('club_id', clubId)
    .limit(1)

  if (existingMembership && existingMembership.length > 0) {
    return {
      success: false,
      error: 'Ya eres miembro de este club',
    }
  }

  // 3. Insertar nueva membresía con rol 'runner'
  const { error: insertError } = await supabase.from('memberships').insert({
    user_id: user.id,
    club_id: clubId,
    role: 'runner',
    status: 'active',
  })

  if (insertError) {
    console.error('Error al unirse al club:', insertError)
    return {
      success: false,
      error: 'Error al unirse al club. Inténtalo de nuevo.',
    }
  }

  // 4. Revalidar y redirigir al dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
