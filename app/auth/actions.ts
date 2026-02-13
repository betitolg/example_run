'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface AuthResult {
  success: boolean
  error?: string
}

export async function signup(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password) {
    return {
      success: false,
      error: 'Email y contraseña son requeridos',
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres',
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || 'Corredor',
      },
    },
  })

  if (error) {
    console.error('Error en signup:', error)
    return {
      success: false,
      error: error.message || 'Error al crear la cuenta',
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: 'No se pudo crear el usuario',
    }
  }

  // Revalidar y redirigir al dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function login(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      success: false,
      error: 'Email y contraseña son requeridos',
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error en login:', error)
    return {
      success: false,
      error: 'Credenciales inválidas',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
