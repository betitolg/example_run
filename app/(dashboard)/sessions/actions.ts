'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface SessionResult {
  success: boolean
  error?: string
}

export async function createSessionAction(
  prevState: SessionResult,
  formData: FormData
): Promise<SessionResult> {
  // 1. Verificar autenticación
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No hay sesión de usuario activa')
  }

  // 2. Obtener club_id del usuario y verificar rol
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('club_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError || !membership) {
    return {
      success: false,
      error: 'No perteneces a ningún club',
    }
  }

  // 3. Verificar que sea owner o coach
  if (membership.role !== 'owner' && membership.role !== 'coach') {
    return {
      success: false,
      error: 'Solo los owners y coaches pueden crear sesiones',
    }
  }

  // 4. Extraer datos del formulario
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const locationName = formData.get('location_name') as string
  const startTime = formData.get('start_time') as string

  if (!title || !startTime) {
    return {
      success: false,
      error: 'El título y la fecha/hora son requeridos',
    }
  }

  // 5. Convertir datetime-local a ISO timestamp
  // El input datetime-local retorna formato: "2024-02-13T18:00"
  // Lo convertimos a ISO string para Postgres
  const startTimeISO = new Date(startTime).toISOString()

  // 6. Insertar evento en la base de datos
  const { error: insertError } = await supabase.from('events').insert({
    club_id: membership.club_id,
    title,
    description: description || null,
    location_name: locationName || null,
    start_time: startTimeISO,
    created_by: user.id,
  })

  if (insertError) {
    console.error('Error al crear sesión:', insertError)
    return {
      success: false,
      error: 'Error al crear la sesión de entrenamiento',
    }
  }

  // 7. Revalidar y redirigir
  revalidatePath('/dashboard/sessions')
  redirect('/dashboard/sessions')
}
