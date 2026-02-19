import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

interface LoginPageProps {
  redirectTo?: string
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo ?? window.location.origin,
      },
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-200 opacity-40 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-sky-200 opacity-40 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-pink-200 opacity-40 blur-3xl" />
      </div>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center">
          <div>
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
              Teenie ToDo
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              The tiny todo app that keeps everyone in sync.
              <br className="hidden sm:block" />
              Real-time, searchable, and effortlessly shared.
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            size="lg"
            className="h-12 w-full max-w-xs text-base"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Built with care for people who like small, focused tools.
      </footer>
    </div>
  )
}

