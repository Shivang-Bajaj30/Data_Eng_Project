import { useAuth, DEMO_USERS } from '../../lib/auth'
import { ShieldCheck, ShieldAlert, User, Sparkles } from 'lucide-react'

export function DemoPersonaBar() {
  const { user, switchPersona } = useAuth()

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-stone-200 border-b border-indigo-900/50 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2.5 shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          Test Persona Switcher
        </span>
        <span className="text-indigo-400/60 hidden sm:inline">•</span>
        <span className="text-indigo-200/80 font-medium text-[11px] hidden md:inline">
          Switch roles instantly to test guards, trust levels, and moderation workflows:
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Student Button */}
        <button
          type="button"
          onClick={() => switchPersona('student')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs ${
            user?.role === 'student'
              ? 'bg-sky-500 text-white border-sky-300 ring-2 ring-sky-400/50 shadow-sky-500/30'
              : 'bg-sky-950/40 text-sky-300 border-sky-800/80 hover:bg-sky-900/60 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5 text-sky-300" />
          Student (Alex)
        </button>

        {/* Diego (Unproven Moderator) */}
        <button
          type="button"
          onClick={() => switchPersona('diego')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs ${
            user?.email === DEMO_USERS.diego.email
              ? 'bg-amber-500 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 shadow-amber-500/30 font-bold'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-900/60 hover:text-white'
          }`}
          title="Unproven Moderator: 2/5 approved uploads. Notes go to admin review."
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          Diego (Mod 2/5)
        </button>

        {/* Aisha (Trusted Moderator) */}
        <button
          type="button"
          onClick={() => switchPersona('aisha')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs ${
            user?.email === DEMO_USERS.aisha.email
              ? 'bg-emerald-500 text-white border-emerald-300 ring-2 ring-emerald-400/50 shadow-emerald-500/30'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60 hover:text-white'
          }`}
          title="Trusted Moderator: 5/5 approvals. Uploads auto-publish instantly!"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          Aisha (Trusted Mod)
        </button>

        {/* Admin */}
        <button
          type="button"
          onClick={() => switchPersona('admin')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs ${
            user?.role === 'admin'
              ? 'bg-purple-600 text-white border-purple-300 ring-2 ring-purple-400/50 shadow-purple-500/30'
              : 'bg-purple-950/40 text-purple-300 border-purple-800/80 hover:bg-purple-900/60 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
          Sarah Connor (Admin)
        </button>
      </div>
    </div>
  )
}
