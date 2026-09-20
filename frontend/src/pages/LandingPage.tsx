import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Radio,
} from 'lucide-react'
import { Badge, Card } from '../components/ui'
import { useAuth } from '../lib/auth'

export default function LandingPage() {
  const { switchPersona } = useAuth()
  const navigate = useNavigate()

  const launchAs = (persona: 'student' | 'diego' | 'aisha' | 'admin', path: string) => {
    switchPersona(persona)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
      {/* Top Navbar */}
      <header className="h-16 border-b border-stone-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4" />
          </span>
          <span>
            NoteVault<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600 dark:text-zinc-300">
          <a href="#how-it-works" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Reputation Model
          </a>
          <Link to="/notes" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Browse Catalog
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link to="/login" className="text-xs font-semibold px-3 py-1.5 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Reputation-Moderated · Verified Peer Knowledge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 dark:text-white leading-[1.08] font-serif">
            Study sharper.
            <br />
            Trust <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300/60 dark:decoration-indigo-700">every page</span>.
          </h1>

          <p className="text-base sm:text-lg font-medium text-indigo-950/80 dark:text-indigo-200/90 max-w-xl leading-relaxed">
            NoteVault is the academic notes platform where unproven contributors earn publishing trust at <strong className="text-indigo-600 dark:text-indigo-400">5 clean approvals</strong>, AI turns dense documents into recall flashcards, and peer accountability ensures zero misinformation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-sm transition-all"
            >
              Start Exploring Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 font-medium text-sm hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all shadow-2xs"
            >
              Browse Note Catalog
            </Link>
          </div>

          {/* Quick Demo Launchers */}
          <div className="pt-4 border-t border-stone-200/80 dark:border-zinc-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider block">
              1-Click Demo Personas:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => launchAs('student', '/home')}
                className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-medium transition-colors"
              >
                🎓 Student (Alex)
              </button>
              <button
                type="button"
                onClick={() => launchAs('diego', '/upload')}
                className="px-2.5 py-1 rounded-md bg-amber-100/70 dark:bg-amber-950/40 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-medium transition-colors"
              >
                ⏳ Unproven Mod (Diego, 2/5)
              </button>
              <button
                type="button"
                onClick={() => launchAs('aisha', '/upload')}
                className="px-2.5 py-1 rounded-md bg-emerald-100/70 dark:bg-emerald-950/40 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-medium transition-colors"
              >
                🛡️ Trusted Mod (Aisha)
              </button>
              <button
                type="button"
                onClick={() => launchAs('admin', '/admin')}
                className="px-2.5 py-1 rounded-md bg-purple-100/70 dark:bg-purple-950/40 hover:bg-purple-200 text-purple-900 dark:text-purple-200 text-xs font-medium transition-colors"
              >
                ⚡ Admin Console
              </button>
            </div>
          </div>
        </div>

        {/* Hero Interactive Document Card Visual */}
        <div className="flex-1 w-full max-w-lg">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-amber-500/20 blur-xl opacity-70" />

            <div className="relative rounded-2xl border border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
              <div className="p-4 bg-stone-100/80 dark:bg-zinc-800/60 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-stone-400 font-mono text-[11px] ml-2">cs201_trees.pdf</span>
                </div>
                <Badge tone="success">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Trusted Contributor
                </Badge>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase font-mono">
                    CS 201 · DATA STRUCTURES
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 mt-0.5">
                    Data Structures & Algorithmic Complexity: Master Guide
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                    Balanced binary search trees, Dijkstra graph traversal, and amortized complexity proofs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 dark:bg-indigo-950/30 dark:border-indigo-900/60">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    AI Key Concept Generator
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-zinc-300 leading-relaxed">
                    "Self-balancing trees maintain logarithmic invariant states via constant-time pivot rotations. Dijkstra runtime scales to O((V + E) log V) when indexed with binary heaps."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-zinc-800 text-xs">
                  <span className="text-stone-500 dark:text-zinc-400 font-mono">
                    342 downloads · 28 pages
                  </span>
                  <Link
                    to="/notes/1"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Open in Viewer <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-16 bg-white dark:bg-zinc-900/50 border-y border-stone-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono">
              The Three Pillars of NoteVault
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900 dark:text-zinc-100">
              Where academic rigor meets modern collaboration.
            </h2>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              A balanced ecosystem designed to reward high-quality contributions and eliminate study misinformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/30 dark:to-zinc-900 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-indigo-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 mb-2">
                1. Student Discovery & AI Recall
              </h3>
              <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed font-medium">
                Filter course documents by department and keyword. Read interactive syntheses, flip through AI recall flashcards, and download clean study materials.
              </p>
            </Card>

            <Card className="p-6 border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/30 dark:to-zinc-900 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 mb-2">
                2. Reputation-Based Moderation
              </h3>
              <p className="text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed font-medium">
                New moderators start as <strong className="text-amber-600 dark:text-amber-400">unproven</strong> (manual review queue). Reach <strong className="text-emerald-600 dark:text-emerald-400">5 approved uploads</strong> to flip to <strong className="text-emerald-600 dark:text-emerald-400">Trusted</strong> for instant auto-publishing. Valid reports reset trust to 0.
              </p>
            </Card>

            <Card className="p-6 border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/30 dark:to-zinc-900 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-500/20">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 mb-2">
                3. Kafka Streams & Observability
              </h3>
              <p className="text-xs text-purple-950/80 dark:text-purple-200/80 leading-relaxed font-medium">
                Admins monitor review queues, report resolutions, and a real-time event pipeline mirroring Kafka topics (`note-events`, `audit-stream`) with complete JSON inspection.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-zinc-800 py-8 px-6 lg:px-12 bg-white dark:bg-zinc-950 text-xs text-stone-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-zinc-200">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>NoteVault Academic Systems</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/notes" className="hover:underline">Catalog</Link>
          <Link to="/upload" className="hover:underline">Moderator Portal</Link>
          <Link to="/admin" className="hover:underline">Admin Console</Link>
        </div>

        <span>Built for collaborative academic excellence.</span>
      </footer>
    </div>
  )
}
