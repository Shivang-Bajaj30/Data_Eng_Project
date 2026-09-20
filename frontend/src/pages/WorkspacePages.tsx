import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNotes } from '../api/useNotesApi'
import { useClasses } from '../api/useClassesApi'
import { useAuth } from '../lib/auth'
import { useWorkspace } from '../lib/workspace'
import { NoteCard } from '../features/catalog/NoteCard'
import { CatalogFilters } from '../features/catalog/CatalogFilters'
import { NoteGrid } from '../features/catalog/NoteGrid'
import { Card, Badge, TrustBadge, Skeleton } from '../components/ui'
import {
  Files,
  Upload,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Layers,
} from 'lucide-react'

export function DashboardPage() {
  const { user, isTrusted, isModerator } = useAuth()
  const { data: notes = [], isLoading } = useNotes()
  const { data: classes = [] } = useClasses()
  const [selectedClass, setSelectedClass] = useState<string>('')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const filteredNotes = selectedClass
    ? notes.filter((n) => n.classId === selectedClass)
    : notes

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
            STUDENT STUDY WORKSPACE
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-zinc-50 mt-0.5">
            {greeting}, {user?.name.split(' ')[0] || 'Scholar'}.
          </h1>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Pick up right where you left off. Discover peer-moderated notes across your courses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isModerator ? (
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Course Notes
            </Link>
          ) : (
            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Explore All Notes
            </Link>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/70 via-white to-white dark:from-indigo-950/30 dark:via-zinc-900 dark:to-zinc-900 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Files className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
              Notes in Catalog
            </span>
            <span className="text-xl font-bold text-stone-900 dark:text-zinc-100 font-mono">
              {notes.length} verified
            </span>
          </div>
        </Card>

        <Card className="p-4 border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/70 via-white to-white dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-900 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
              Active Courses
            </span>
            <span className="text-xl font-bold text-stone-900 dark:text-zinc-100 font-mono">
              {classes.length} registered
            </span>
          </div>
        </Card>

        <Card className="p-4 border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50/70 via-white to-white dark:from-amber-950/30 dark:via-zinc-900 dark:to-zinc-900 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
              Your Reputation Tier
            </span>
            <div className="mt-0.5">
              <TrustBadge
                isTrusted={isTrusted}
                cleanCount={user?.cleanUploadCount ?? (isTrusted ? 5 : 0)}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Discovery Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold tracking-wide text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI-POWERED SEMANTIC RETRIEVAL
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
            Find the exact formula or concept in seconds.
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Search naturally by theoretical concept rather than exact filenames. AI generates on-the-fly study syntheses and flashcards.
          </p>
          <div className="pt-2">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-950 font-semibold text-xs hover:bg-indigo-50 shadow-xs transition-colors"
            >
              Launch AI Search <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Decorative Floating Query Bubble */}
        <div className="relative z-10 hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 max-w-xs shadow-lg">
          <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-200">
            Semantic Query Example:
          </span>
          <p className="font-semibold text-white">
            "How do red-black tree rotations maintain logarithmic search depth?"
          </p>
          <div className="flex items-center justify-between text-[11px] text-indigo-200 pt-1 border-t border-white/10">
            <span>Matches: CS 201</span>
            <span className="text-emerald-300 font-bold">94% Relevance</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Notes + Community Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notes Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                Latest Verified Notes
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Peer-reviewed materials recently approved for your curriculum.
              </p>
            </div>
            <Link
              to="/notes"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Course Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedClass('')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !selectedClass
                  ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              All Courses
            </button>
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedClass(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedClass === c.id
                    ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <Skeleton rows={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNotes.slice(0, 4).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Activity & Habit (1 col) */}
        <div className="space-y-6">
          {/* Study Corner Card */}
          <Card className="p-5 border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-orange-50/20 dark:from-zinc-900 dark:to-amber-950/20 dark:border-amber-900/60 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Study Habit Tip
              </span>
            </div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100 mb-1">
              The Feynman Technique in Note-Taking
            </h4>
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed mb-3">
              When uploading or reviewing notes, try explaining difficult proofs as if lecturing a first-year student. If you encounter a gap in reasoning, you have pinpointed the exact exam concept requiring revision.
            </p>
            <div className="pt-2 border-t border-amber-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-300 font-semibold">
              <span>Peer-reviewed knowledge sticks 2x longer</span>
            </div>
          </Card>

          {/* Recent Live Moderation Feed */}
          <Card className="p-5 border-stone-200/80 dark:border-zinc-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform Pulse
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-[10px] text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  AC
                </div>
                <div>
                  <p className="text-stone-800 dark:text-zinc-200 leading-snug">
                    <strong>Aisha Chen</strong> uploaded new notes in <em>CS 201</em>
                  </p>
                  <span className="text-[10px] text-stone-400">12 minutes ago · Auto-published</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center font-bold text-[10px] text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  DR
                </div>
                <div>
                  <p className="text-stone-800 dark:text-zinc-200 leading-snug">
                    <strong>Diego Ramirez</strong> earned +1 clean approval in <em>MA 202</em>
                  </p>
                  <span className="text-[10px] text-stone-400">1 hour ago · Trust: 2/5</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center font-bold text-[10px] text-purple-700 dark:text-purple-300 shrink-0 mt-0.5">
                  SC
                </div>
                <div>
                  <p className="text-stone-800 dark:text-zinc-200 leading-snug">
                    <strong>Sarah Connor</strong> verified 2 moderator requests
                  </p>
                  <span className="text-[10px] text-stone-400">3 hours ago · Admin audit logged</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function BrowsePage({ savedOnly = false }: { savedOnly?: boolean }) {
  const { saved } = useWorkspace()
  const { data: rawNotes = [], isLoading } = useNotes()
  const { data: classes = [] } = useClasses()
  const [params] = useSearchParams()

  const [search, setSearch] = useState(params.get('q') || '')
  const [selectedClass, setSelectedClass] = useState(params.get('class') || '')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const subjects = [...new Set(rawNotes.map((n) => n.subject).filter(Boolean))]

  const notes = rawNotes
    .filter((n) => {
      if (savedOnly && !saved.includes(n.id)) return false
      if (selectedClass && n.classId !== selectedClass) return false
      if (selectedSubject && n.subject !== selectedSubject) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const text = `${n.title} ${n.description} ${n.subject} ${(n.tags || []).join(' ')}`.toLowerCase()
        return text.includes(q)
      }
      return true
    })
    .sort((a, b) => {
      if (sort === 'popular') return (b.downloads || 0) - (a.downloads || 0)
      if (sort === 'title') return a.title.localeCompare(b.title)
      return Date.parse(b.createdAt || '') - Date.parse(a.createdAt || '')
    })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono px-2 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950/60 border border-indigo-300/60 dark:border-indigo-800/60">
            {savedOnly ? 'PERSONAL BOOKSHELF' : 'ACADEMIC REPOSITORY'}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-zinc-50 mt-1">
            {savedOnly ? 'Your Saved Study Notes' : 'Explore Course Study Notes'}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {savedOnly
              ? 'Quick access to bookmarks you have saved for exam prep and revision.'
              : 'Browse vetted study notes, lecture summaries, and problem sets.'}
          </p>
        </div>

        <Badge tone="accent">
          {notes.length} note{notes.length === 1 ? '' : 's'} available
        </Badge>
      </div>

      {/* Filters Toolbar */}
      <CatalogFilters
        search={search}
        onSearchChange={setSearch}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        classes={classes}
        subjects={subjects}
      />

      {/* Notes Grid */}
      <NoteGrid
        notes={notes}
        isLoading={isLoading}
        view={view}
        emptyTitle={savedOnly ? 'Your bookshelf is empty' : 'No matching notes found'}
        emptyHint={
          savedOnly
            ? 'Bookmark any note in the catalog by clicking its bookmark icon to keep it handy.'
            : 'Try refining your search keyword, clearing course filters, or upload your own.'
        }
        onResetFilters={() => {
          setSearch('')
          setSelectedClass('')
          setSelectedSubject('')
        }}
      />
    </div>
  )
}

export function ClassesPage() {
  const { data: classes = [], isLoading } = useClasses()

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="pb-3 border-b border-teal-100 dark:border-zinc-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono px-2 py-0.5 rounded-md bg-teal-100/70 dark:bg-teal-950/60 border border-teal-300/60 dark:border-teal-800/60">
          CURRICULUM DIRECTORY
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-zinc-50 mt-1">
          Registered Study Courses
        </h1>
        <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          Explore curriculum cohorts organized by faculty course codes and academic departments.
        </p>
      </div>

      {isLoading ? (
        <Skeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((c) => (
            <Card key={c.id} className="p-5 border-stone-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="accent" className="font-mono font-bold">
                    {c.name}
                  </Badge>
                  <span className="text-xs text-stone-500 dark:text-zinc-400">
                    {c.noteCount ?? 12} documents
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  {c.subject}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 dark:text-zinc-500">
                  Curated by trusted peers
                </span>
                <Link
                  to={`/notes?class=${c.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Browse Course <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
