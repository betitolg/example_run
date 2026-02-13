# Supabase Setup - Running Club SaaS

## 📋 Configuración Completada

Se han creado los siguientes archivos para la integración con Supabase:

### 1. **utils/supabase/server.ts**
Cliente de Supabase para operaciones del lado del servidor (Server Components, Route Handlers, Server Actions).

**Uso:**
```typescript
import { createClient } from '@/utils/supabase/server'

export async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ...
}
```

### 2. **utils/supabase/client.ts**
Cliente de Supabase para operaciones del lado del cliente (Client Components, hooks).

**Uso:**
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'

export function ClientComponent() {
  const supabase = createClient()
  // ...
}
```

### 3. **middleware.ts**
Middleware que gestiona:
- Renovación automática de sesiones
- Protección de rutas `/dashboard/*` (requiere autenticación)
- Redirección de usuarios autenticados desde `/auth/*` al dashboard

### 4. **utils/supabase/types.ts**
Tipos TypeScript para el esquema de base de datos con arquitectura multi-tenant.

**Tablas incluidas:**
- `clubs`: Clubes de running
- `profiles`: Perfiles de usuario (vinculados con Supabase Auth)
- `club_members`: Relación usuario-club con roles (admin, coach, member)
- `members`: Miembros del club (datos completos)
- `training_sessions`: Sesiones de entrenamiento
- `session_attendance`: Asistencia a sesiones

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## 🗄️ Arquitectura Multi-Tenant

### Estrategia: Shared Schema con Aislamiento Lógico

Todas las tablas principales incluyen `club_id` para aislar datos por club:

```sql
-- Ejemplo: tabla members
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  -- ... otros campos
);
```

### Row Level Security (RLS)

La seguridad se maneja en la base de datos, NO en el frontend. Ejemplo de política RLS:

```sql
-- Solo miembros del club pueden ver sus datos
CREATE POLICY "Users can view members of their clubs"
ON members FOR SELECT
USING (
  club_id IN (
    SELECT club_id FROM club_members 
    WHERE user_id = auth.uid()
  )
);
```

## 📦 Dependencias Requeridas

Instala las dependencias de Supabase:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 🚀 Próximos Pasos

1. **Crear las tablas en Supabase:**
   - Ve a tu proyecto en Supabase Dashboard
   - Ejecuta el SQL para crear las tablas (ver `types.ts` para referencia)
   - Configura las políticas RLS

2. **Crear rutas de autenticación:**
   - `app/auth/login/page.tsx`
   - `app/auth/callback/route.ts`

3. **Crear layout del dashboard:**
   - `app/(dashboard)/layout.tsx` con sidebar
   - `app/(dashboard)/dashboard/page.tsx`

4. **Implementar funcionalidades:**
   - Gestión de miembros
   - Sesiones de entrenamiento
   - Asistencia
   - Reportes

## 🔧 Estructura de Carpetas Recomendada

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── callback/
│       └── route.ts
├── (dashboard)/
│   ├── layout.tsx          # Layout con sidebar
│   ├── dashboard/
│   │   └── page.tsx
│   ├── members/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── sessions/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── settings/
│       └── page.tsx
utils/
├── supabase/
│   ├── server.ts           ✅ Creado
│   ├── client.ts           ✅ Creado
│   └── types.ts            ✅ Creado
middleware.ts               ✅ Creado
```

## 📚 Recursos

- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js 15 App Router](https://nextjs.org/docs)
