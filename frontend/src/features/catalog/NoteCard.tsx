import { Link } from 'react-router-dom'
import type { Note } from '../../lib/auth'
import { useWorkspace } from '../../lib/workspace'
import { TrustBadge, StatusBadge } from '../../components/ui'
import { Download, Bookmark, FileText, ArrowUpRight } from 'lucide-react'

export interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { saved, toggleSave } = useWorkspace()
  const isSaved = saved.includes(note.id)

  const coverPalette: Record<string, string> = {
    lavender: 'bg-gradient-to-br from-indigo-100/90 via-purple-50/80 to-indigo-50/60 border-indigo-200/80 text-indigo-950 dark:from-indigo-950/50 dark:via-purple-950/40 dark:to-zinc-900 dark:border-indigo-900/70 dark:text-indigo-200',
    peach: 'bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-amber-50/60 border-amber-200/80 text-amber-950 dark:from-amber-950/50 dark:via-orange-950/40 dark:to-zinc-900 dark:border-amber-900/70 dark:text-amber-200',
    mint: 'bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-emerald-50/60 border-emerald-200/80 text-emerald-950 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-zinc-900 dark:border-emerald-900/70 dark:text-emerald-200',
    blue: 'bg-gradient-to-br from-sky-100/90 via-blue-50/80 to-cyan-50/60 border-sky-200/80 text-sky-950 dark:from-sky-950/50 dark:via-blue-950/40 dark:to-zinc-900 dark:border-sky-900/70 dark:text-sky-200',
    sand: 'bg-gradient-to-br from-stone-100/90 via-amber-50/60 to-stone-50/60 border-amber-200/60 text-stone-900 dark:bg-zinc-800/60 dark:border-zinc-700/70 dark:text-zinc-200',
    rose: 'bg-gradient-to-br from-rose-100/90 via-pink-50/80 to-rose-50/60 border-rose-200/80 text-rose-950 dark:from-rose-950/50 dark:via-pink-950/40 dark:to-zinc-900 dark:border-rose-900/70 dark:text-rose-200',
  }

  const selectedCover = coverPalette[note.color || 'lavender'] || coverPalette.lavender

  return (
    <div className="group relative flex flex-col rounded-2xl border border-indigo-100/80 bg-gradient-to-b from-white via-white to-slate-50/30 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Cover Header */}
      <div className={`relative h-36 p-4 border-b flex flex-col justify-between ${selectedCover}`}>
        <div className="flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-zinc-900/90 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-xs shadow-2xs">
            <FileText className="w-3 h-3 text-stone-600 dark:text-zinc-400" />
            {note.classId?.toUpperCase() || note.subject}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleSave(note.id)
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save note'}
            className={`p-1.5 rounded-full transition-colors backdrop-blur-xs ${
              isSaved
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-600 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Tactile Academic Notebook visual */}
        <div className="absolute inset-x-8 bottom-0 top-12 bg-white/60 dark:bg-zinc-900/60 rounded-t-lg border-t border-x border-stone-200/60 dark:border-zinc-700/40 p-3 shadow-2xs group-hover:translate-y-[-2px] transition-transform">
          <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-700 rounded-full mb-2" />
          <p className="text-[11px] font-semibold text-stone-800 dark:text-zinc-200 line-clamp-2 leading-tight">
            {note.title}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-medium opacity-80 z-10">
          <span>{note.pages ? `${note.pages} pages` : 'Synthesis'}</span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {note.downloads || 0}
          </span>
        </div>
      </div>

      {/* Note Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TrustBadge isTrusted={note.trusted} cleanCount={5} />
            {note.status !== 'approved' && <StatusBadge status={note.status} />}
          </div>

          <Link to={`/notes/${note.id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <h4 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-zinc-100 line-clamp-2 leading-snug">
              {note.title}
            </h4>
          </Link>

          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        </div>

        {/* Author and Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-stone-700 dark:text-zinc-300 shrink-0">
              {(note.uploadedByName || 'C')[0]}
            </span>
            <span className="text-[11px] truncate">{note.uploadedByName || 'Contributor'}</span>
          </div>

          <Link
            to={`/notes/${note.id}`}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 shrink-0"
          >
            Study <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
