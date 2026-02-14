import {
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-orange-500">Running Club</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink href="/dashboard" icon={HomeIcon}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/members" icon={UsersIcon}>
            Miembros
          </NavLink>
          <NavLink href="/dashboard/sessions" icon={CalendarIcon}>
            Sesiones
          </NavLink>
          <NavLink href="/dashboard/reports" icon={ChartBarIcon}>
            Reportes
          </NavLink>
          <NavLink href="/dashboard/settings" icon={Cog6ToothIcon}>
            Configuración
          </NavLink>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-orange-500/30">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-50 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-50 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-orange-500 rounded-md transition-colors group"
    >
      <Icon className="w-5 h-5 group-hover:text-orange-500" />
      {children}
    </Link>
  )
}
