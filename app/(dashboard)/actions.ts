'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface ActionResult {
  success: boolean
  error?: string
  clubId?: string
}

export async function createClubAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // 1. Verificar autenticación
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No hay sesión de usuario activa')
  }

  // 2. Extraer datos del formulario
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) {
    return {
      success: false,
      error: 'El nombre y el slug son requeridos',
    }
  }

  // 3. Transacción: Crear club
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .insert({
      name,
      slug,
    })
    .select('id')
    .single()

  if (clubError) {
    // Manejo de error de slug duplicado (código Postgres 23505)
    if (clubError.code === '23505') {
      return {
        success: false,
        error: 'Este URL de club ya está ocupado',
      }
    }

    console.error('Error al crear club:', clubError)
    return {
      success: false,
      error: 'Error al crear el club',
    }
  }

  if (!club) {
    return {
      success: false,
      error: 'No se pudo crear el club',
    }
  }

  // 4. Transacción: Crear membresía del owner
  const { error: membershipError } = await supabase
    .from('memberships')
    .insert({
      club_id: club.id,
      user_id: user.id,
      role: 'owner',
      status: 'active',
    })

  if (membershipError) {
    console.error('Error al crear membresía:', membershipError)
    
    // Si falla la membresía, idealmente deberíamos hacer rollback del club
    // pero Supabase no soporta transacciones multi-statement desde el cliente
    // En producción, esto debería manejarse con una función de base de datos
    return {
      success: false,
      error: 'Error al asignar permisos de owner',
    }
  }

  // 5. Revalidar y redirigir
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
