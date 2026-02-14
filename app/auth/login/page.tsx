import AuthForm from './AuthForm'

interface LoginPageProps {
  searchParams: Promise<{
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextUrl = params.next || '/dashboard'

  return <AuthForm nextUrl={nextUrl} />
}
