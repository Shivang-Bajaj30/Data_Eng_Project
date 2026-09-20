import { Search, LayoutGrid, List } from 'lucide-react'
import type { StudyClass } from '../../lib/auth'

export interface CatalogFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedClass: string
  onClassChange: (value: string) => void
  selectedSubject: string
  onSubjectChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  view: 'grid' | 'list'
  onViewChange: (value: 'grid' | 'list') => void
  classes: StudyClass[]
  subjects: string[]
}

export function CatalogFilters({
  search,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedSubject,
  onSubjectChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  classes,
  subjects,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-white via-indigo-50/25 to-purple-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/20 border border-indigo-200/70 dark:border-zinc-800 rounded-2xl shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500/80 dark:text-indigo-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter notes by topic, concept, or keyword..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-800/80 border border-indigo-200/80 dark:border-zinc-700/80 rounded-xl text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-500 shadow-2xs transition-all"
        />
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Class Filter */}
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          aria-label="Filter by course"
          className="px-3 py-2 text-xs bg-white dark:bg-zinc-800/80 border border-indigo-200/80 dark:border-zinc-700/80 rounded-xl text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-500 shadow-2xs cursor-pointer"
        >
          <option value="">All Courses</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.subject})
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          aria-label="Filter by subject"
          className="px-3 py-2 text-xs bg-white dark:bg-zinc-800/80 border border-indigo-200/80 dark:border-zinc-700/80 rounded-xl text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-500 shadow-2xs cursor-pointer"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort order"
          className="px-3 py-2 text-xs bg-white dark:bg-zinc-800/80 border border-indigo-200/80 dark:border-zinc-700/80 rounded-xl text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/25 focus:border-indigo-500 shadow-2xs cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="title">Title (A-Z)</option>
        </select>

        {/* View Switcher */}
        <div className="flex items-center border border-stone-200 dark:border-zinc-700/80 rounded-lg p-0.5 bg-stone-50 dark:bg-zinc-800/60">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-md transition-colors ${
              view === 'grid'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            aria-label="List view"
            className={`p-1.5 rounded-md transition-colors ${
              view === 'list'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
