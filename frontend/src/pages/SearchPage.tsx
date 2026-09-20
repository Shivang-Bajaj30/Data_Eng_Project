import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Sparkles, ArrowUpRight, BookOpen } from 'lucide-react'
import { useNotes } from '../api/useNotesApi'
import { Button, Badge, Card, Empty, Skeleton } from '../components/ui'

export default function SearchPage() {
  const { data: notes = [], isLoading } = useNotes()
  const [params, setParams] = useSearchParams()

  const [input, setInput] = useState(params.get('q') || '')
  const query = params.get('q') || ''

  const handleSearch = (searchTerm: string) => {
    setInput(searchTerm)
    if (searchTerm.trim()) {
      setParams({ q: searchTerm.trim() })
    } else {
      setParams({})
    }
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)

  const results = notes
    .map((note) => {
      if (!terms.length) return { ...note, score: 0.85 }
      const text = `${note.title} ${note.description} ${note.subject} ${(note.tags || []).join(' ')}`.toLowerCase()
      let matches = 0
      for (const t of terms) {
        if (text.includes(t)) matches++
      }
      const score = matches > 0 ? Math.min(0.98, 0.6 + (matches / terms.length) * 0.38) : 0
      return { ...note, score }
    })
    .filter((n) => (terms.length ? n.score > 0 : true))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Search Header */}
      <div className="text-center py-6 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-POWERED CONCEPT RETRIEVAL</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-stone-900 dark:text-zinc-100">
          Find understanding, not just keywords.
        </h1>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 max-w-lg mx-auto">
          Query by algorithm, equation, or theoretical proof. NoteVault retrieves relevant peer notes with instant AI study synthesis.
        </p>

        {/* Large Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch(input)
          }}
          className="max-w-2xl mx-auto pt-2"
        >
          <div className="relative flex items-center shadow-md rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-1.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
            <Search className="w-5 h-5 text-stone-400 dark:text-zinc-500 ml-3 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Dijkstra binary heaps, normalization BCNF, or Maxwell equations..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-stone-900 dark:text-zinc-100 placeholder-stone-400"
            />
            <Button type="submit" variant="primary" size="md">
              Search Notes
            </Button>
          </div>
        </form>

        {/* Recommended Sample Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-[11px] text-stone-400 dark:text-zinc-500">Try searching:</span>
          {[
            'Data structures algorithms',
            'Eigenvalues linear algebra',
            'Relational normalization BCNF',
            'Maxwell equations flux',
            'Cellular respiration Krebs cycle',
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => handleSearch(sample)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-zinc-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 text-stone-600 dark:text-zinc-400 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-zinc-800">
          <span className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
            {query ? `Search Results for "${query}"` : 'All Study Documents'}
          </span>
          <Badge tone="accent">
            {results.length} result{results.length === 1 ? '' : 's'}
          </Badge>
        </div>

        {isLoading ? (
          <Skeleton rows={4} />
        ) : results.length === 0 ? (
          <Empty
            title="No direct concept match"
            hint="Try searching with broader academic terminology, or browse by registered course classes."
            icon={BookOpen}
          />
        ) : (
          <div className="space-y-4">
            {results.map((note) => (
              <Card
                key={note.id}
                className="p-5 border-stone-200/80 dark:border-zinc-800 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {note.classId?.toUpperCase() || note.subject}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">
                        {note.subject}
                      </span>
                    </div>

                    <Link
                      to={`/notes/${note.id}`}
                      className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    >
                      <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 leading-snug">
                        {note.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed">
                      {note.description}
                    </p>

                    {/* AI Executive Concept Snippet */}
                    {note.summary && (
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60 text-xs text-stone-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
                          <Sparkles className="w-3 h-3" />
                          AI Key Insight:
                        </div>
                        <p className="line-clamp-2 text-[11px]">{note.summary}</p>
                      </div>
                    )}

                    {/* Tags & Relevance */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-stone-400">Semantic Relevance:</span>
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(note.score * 100)}%
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {(note.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-[10px] text-stone-500 dark:text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                    <Link to={`/notes/${note.id}`}>
                      <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                        Study Note
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
