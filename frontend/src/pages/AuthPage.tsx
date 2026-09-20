import { Link } from 'react-router-dom'
import { AuthCard } from '../features/auth/AuthCard'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function AuthPage({ signup = false }: { signup?: boolean }) {
  return (
    <div className="min-h-screen bg-stone-50/80 dark:bg-zinc-950 flex flex-col justify-between py-8 px-4 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
      <header className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-zinc-100">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>NoteVault</span>
        </div>
      </header>

      <main className="w-full my-auto">
        <AuthCard mode={signup ? 'signup' : 'login'} />
      </main>

      <footer className="text-center text-xs text-stone-400 dark:text-zinc-500 pt-8">
        © NoteVault Academic Systems · Verified Peer Study Platform
      </footer>
    </div>
  )
}
