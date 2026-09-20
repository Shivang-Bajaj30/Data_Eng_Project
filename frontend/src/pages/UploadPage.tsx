import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { TrustProgressWidget } from '../features/upload/TrustProgressWidget'
import { DropzoneUploader } from '../features/upload/DropzoneUploader'
import { UploadHistoryTable } from '../features/upload/UploadHistoryTable'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '../components/ui'

export default function UploadPage() {
  const { isTrusted } = useAuth()

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header Card with Subtle Color Wash */}
      <div className="p-6 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/60 via-rose-50/30 to-indigo-50/40 dark:from-amber-950/20 dark:via-rose-950/15 dark:to-indigo-950/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono px-2.5 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-800/60 shadow-2xs">
              MODERATOR UPLOAD PORTAL
            </span>
            <Badge tone={isTrusted ? 'success' : 'warning'}>
              {isTrusted ? '✨ Auto-Publish Active' : '🛡️ Review Gated'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 dark:text-zinc-50 mt-1.5">
            Share High-Trust Course Notes
          </h1>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Contribute peer-verified lecture syntheses and exam guides. Unlocks instant publishing at 5 clean approvals.
          </p>
        </div>

        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/80 transition-all shadow-xs shrink-0 self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          View Catalog
        </Link>
      </div>

      {/* Trust Progress Bar Widget (X/5 Approvals Tracker) */}
      <TrustProgressWidget />

      {/* Dropzone & Metadata Upload Form */}
      <DropzoneUploader />

      {/* Upload History Table (Moderator's Submissions & Review Status) */}
      <UploadHistoryTable />
    </div>
  )
}
