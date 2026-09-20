import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Note } from '../../lib/auth'
import { useWorkspace } from '../../lib/workspace'
import { Button, Card, TrustBadge } from '../../components/ui'
import { AISummaryCard } from './AISummaryCard'
import { ReportDialog } from './ReportDialog'
import {
  ArrowLeft,
  Download,
  Bookmark,
  Flag,
  FileText,
  Minus,
  Plus,
} from 'lucide-react'

export interface NoteViewerProps {
  note: Note
}

export function NoteViewer({ note }: NoteViewerProps) {
  const { saved, toggleSave } = useWorkspace()
  const isSaved = saved.includes(note.id)

  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const totalPages = note.pages || 6

  const handleDownload = () => {
    const content = `NoteVault Academic Document: ${note.title}
Course: ${note.classId?.toUpperCase()} | Subject: ${note.subject}
Author: ${note.uploadedByName} | Trust Status: ${note.trusted ? 'TRUSTED' : 'REVIEWED'}
Date: ${note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}

SUMMARY:
${note.summary || note.description}

CORE CONCEPTS:
${(note.keyConcepts || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

==================================================
NoteVault - Reputation-Moderated Study Platform
==================================================`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = note.fileName || `NoteVault_${note.id}.txt`
    link.click()
    URL.revokeObjectURL(url)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-zinc-800">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={isSaved ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleSave(note.id)}
            leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />}
          >
            {isSaved ? 'Saved to Bookshelf' : 'Save for Later'}
          </Button>

          <Button
            variant="academic"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {downloadSuccess ? 'Downloaded!' : 'Download Notes'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReportOpen(true)}
            className="text-stone-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
            title="Report accuracy or integrity issue"
          >
            <Flag className="w-3.5 h-3.5 mr-1" />
            Report
          </Button>
        </div>
      </div>

      {/* Main Grid: Viewer + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Reader Canvas */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="overflow-hidden border-stone-200/80 dark:border-zinc-800 shadow-sm bg-stone-100/50 dark:bg-zinc-950">
            {/* Viewer Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold text-stone-800 dark:text-zinc-200 truncate">
                  {note.fileName || `${note.title}.pdf`}
                </span>
                <span className="text-stone-400 text-[11px] hidden sm:inline">
                  ({note.pages || 1} pages)
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-stone-200 dark:border-zinc-700 rounded-md bg-stone-50 dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => setScale(Math.max(0.7, scale - 0.1))}
                    className="p-1 text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    aria-label="Zoom out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-mono text-stone-600 dark:text-zinc-300">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setScale(Math.min(1.4, scale + 0.1))}
                    className="p-1 text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    aria-label="Zoom in"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Surface Paper */}
            <div className="p-6 md:p-10 flex justify-center overflow-auto min-h-[560px]">
              <div
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 shadow-md p-8 md:p-12 rounded-sm text-stone-900 dark:text-zinc-100 transition-transform duration-150 flex flex-col justify-between"
              >
                <div>
                  {/* Paper Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800 text-[10px] font-mono text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                    <span>NoteVault Academic Syntheses</span>
                    <span>{note.classId?.toUpperCase()} // LECTURE REV</span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="my-6">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                      {note.subject}
                    </span>
                    <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight mt-1 text-stone-950 dark:text-stone-50">
                      {note.title}
                    </h1>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-2 font-mono">
                      Curated by {note.uploadedByName} · Verified Peer Contributor
                    </p>
                  </div>

                  {/* Document Body Simulation */}
                  <div className="space-y-4 text-xs leading-relaxed text-stone-700 dark:text-zinc-300 font-serif">
                    <div className="p-4 rounded-md bg-stone-50 dark:bg-zinc-800/60 border-l-3 border-indigo-600 dark:border-indigo-400 text-stone-800 dark:text-zinc-200">
                      <p className="font-semibold font-sans text-xs uppercase tracking-wide text-indigo-900 dark:text-indigo-300 mb-1">
                        Executive Abstract
                      </p>
                      <p>{note.summary || note.description}</p>
                    </div>

                    <h3 className="font-sans font-bold text-sm tracking-tight text-stone-900 dark:text-zinc-100 pt-2">
                      1. Conceptual Foundations & Definitions
                    </h3>
                    <p>
                      This module articulates the essential theoretical framework required for midterm and comprehensive examinations. Understanding the interplay between formal mathematical properties and applied computational runtime is central to high mastery in {note.subject}.
                    </p>

                    <h3 className="font-sans font-bold text-sm tracking-tight text-stone-900 dark:text-zinc-100 pt-2">
                      2. Structural Theorems & Worked Analysis
                    </h3>
                    <p>
                      Theorem 1.1: Every balanced structure maintains dynamic equilibrium across invariant states. In practice, this avoids degenerate worst-case behaviors, reducing traversal costs from linear bounds to logarithmic bounds.
                    </p>

                    {note.keyConcepts && (
                      <div className="p-3 my-2 bg-amber-50/70 dark:bg-amber-950/30 rounded border border-amber-200/80 dark:border-amber-900/50 font-sans text-amber-900 dark:text-amber-200">
                        <strong className="block mb-1 text-[11px]">Primary Exam Checkpoints:</strong>
                        <ul className="list-disc list-inside space-y-1 text-[11px]">
                          {note.keyConcepts.map((kc, i) => (
                            <li key={i}>{kc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <h3 className="font-sans font-bold text-sm tracking-tight text-stone-900 dark:text-zinc-100 pt-2">
                      3. Concluding Synthesis
                    </h3>
                    <p>
                      Review worked problem sheets and check self-recall flashcards regularly. Active recall demonstrates a 40% retention increase over passive reading.
                    </p>
                  </div>
                </div>

                {/* Paper Footer */}
                <div className="mt-12 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-stone-400 dark:text-zinc-500">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>CONFIDENTIAL STUDY ARCHIVE</span>
                </div>
              </div>
            </div>

            {/* Page Navigator */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border-t border-stone-200 dark:border-zinc-800 text-xs">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous Page
              </Button>
              <span className="text-stone-500 dark:text-zinc-400 font-mono text-xs">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next Page
              </Button>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: AI Study Assistant & Metadata */}
        <div className="flex flex-col gap-5">
          {/* AI Companion Card */}
          <AISummaryCard note={note} />

          {/* Note Metadata Details Card */}
          <Card className="p-5 border-stone-200/80 dark:border-zinc-800">
            <h4 className="text-xs font-semibold text-stone-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Document Credentials
            </h4>

            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-stone-100 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-sm">
                {(note.uploadedByName || 'U')[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200 truncate">
                  {note.uploadedByName}
                </p>
                <div className="mt-0.5">
                  <TrustBadge isTrusted={note.trusted} cleanCount={5} />
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <dt className="text-stone-400 dark:text-zinc-500 text-[11px]">Subject</dt>
                <dd className="font-medium text-stone-800 dark:text-zinc-200 mt-0.5">{note.subject}</dd>
              </div>

              <div>
                <dt className="text-stone-400 dark:text-zinc-500 text-[11px]">Course Code</dt>
                <dd className="font-medium text-stone-800 dark:text-zinc-200 mt-0.5">
                  {note.classId?.toUpperCase() || 'General'}
                </dd>
              </div>

              <div>
                <dt className="text-stone-400 dark:text-zinc-500 text-[11px]">Published</dt>
                <dd className="font-medium text-stone-800 dark:text-zinc-200 mt-0.5">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Recent'}
                </dd>
              </div>

              <div>
                <dt className="text-stone-400 dark:text-zinc-500 text-[11px]">Downloads</dt>
                <dd className="font-medium text-stone-800 dark:text-zinc-200 mt-0.5">
                  {note.downloads || 0} students
                </dd>
              </div>
            </dl>

            {note.tags && note.tags.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                <span className="text-[11px] text-stone-400 dark:text-zinc-500 block mb-2">
                  Topic Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 text-[11px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Report Modal */}
      <ReportDialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        noteId={note.id}
        noteTitle={note.title}
      />
    </div>
  )
}
