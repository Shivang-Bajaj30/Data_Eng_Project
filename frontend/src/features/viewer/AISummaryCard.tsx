import { useState } from 'react'
import type { Note } from '../../lib/auth'
import { Card, CardHeader, CardContent, Button } from '../../components/ui'
import { Sparkles, BrainCircuit, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react'

export interface AISummaryCardProps {
  note: Note
}

export function AISummaryCard({ note }: AISummaryCardProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const flashcards = note.flashcards && note.flashcards.length > 0
    ? note.flashcards
    : [
        { q: `What is the primary topic of ${note.title}?`, a: note.description },
        { q: `Which academic domain does this document fall under?`, a: note.subject },
      ]

  const currentCard = flashcards[currentCardIndex]

  const nextCard = () => {
    setIsFlipped(false)
    setCurrentCardIndex((i) => (i + 1) % flashcards.length)
  }

  const prevCard = () => {
    setIsFlipped(false)
    setCurrentCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <Card className="border-indigo-200/70 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-purple-950/10 dark:border-indigo-900/50 shadow-xs">
      <CardHeader className="pb-3 border-b border-indigo-100/80 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                AI Study Assistant
              </h4>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Auto-generated synthesis & recall flashcards
              </p>
            </div>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-indigo-100/60 dark:bg-zinc-800 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'summary'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-zinc-900 dark:text-indigo-400'
                  : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-zinc-900 dark:text-indigo-400'
                  : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Flashcards ({flashcards.length})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {activeTab === 'summary' ? (
          <div className="space-y-3.5 text-xs">
            <div>
              <h5 className="font-semibold text-stone-900 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Core Takeaway
              </h5>
              <p className="text-stone-600 dark:text-zinc-300 leading-relaxed bg-white/80 dark:bg-zinc-800/60 p-3 rounded-lg border border-stone-200/60 dark:border-zinc-700/50">
                {note.summary || note.description}
              </p>
            </div>

            {note.keyConcepts && note.keyConcepts.length > 0 && (
              <div>
                <h5 className="font-semibold text-stone-900 dark:text-zinc-200 mb-1.5">
                  Key Insights for Exams
                </h5>
                <ul className="space-y-1.5">
                  {note.keyConcepts.map((concept, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-stone-600 dark:text-zinc-300 text-[11px] leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Flashcard interactive flip box */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsFlipped(!isFlipped)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
              className="w-full min-h-[140px] p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-zinc-800 shadow-xs cursor-pointer flex flex-col justify-between hover:border-indigo-400 transition-all text-center select-none"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  {isFlipped ? 'Answer' : 'Question (Click to flip)'}
                </span>
              </div>

              <div className="my-auto py-2">
                <p className="text-xs font-medium text-stone-800 dark:text-zinc-100 leading-snug">
                  {isFlipped ? currentCard.a : currentCard.q}
                </p>
              </div>

              <p className="text-[10px] text-stone-400 dark:text-zinc-500">
                {isFlipped ? 'Tap to see prompt again' : 'Tap card or spacebar to reveal key concept'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={prevCard}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={nextCard}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next Card
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
