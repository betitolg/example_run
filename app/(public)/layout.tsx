import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Minimalista */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Running Club
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 text-slate-300 hover:text-orange-500 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
