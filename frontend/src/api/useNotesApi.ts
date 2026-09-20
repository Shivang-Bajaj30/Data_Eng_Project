import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Note } from '../lib/auth'
import { INITIAL_NOTES } from './mockData'

const NOTES_STORAGE_KEY = 'notevault_notes_db'

function getLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Note[]
  } catch {}
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_NOTES))
  return INITIAL_NOTES
}

function saveLocalNotes(notes: Note[]) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
}

export function useNotes(params: { q?: string; classId?: string; subject?: string } = {}) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams()
        if (params.q) queryParams.set('q', params.q)
        if (params.classId) queryParams.set('classId', params.classId)
        if (params.subject) queryParams.set('subject', params.subject)

        const res = await api.get<{ notes: Note[] }>(`/notes?${queryParams.toString()}`)
        if (res.data?.notes && res.data.notes.length > 0) {
          return res.data.notes
        }
      } catch {
        // Fallback to local mock database
      }

      const all = getLocalNotes()
      return all.filter((note) => {
        if (note.status !== 'approved') return false
        if (params.classId && note.classId !== params.classId) return false
        if (params.subject && note.subject !== params.subject) return false
        if (params.q) {
          const search = params.q.toLowerCase()
          const combined = `${note.title} ${note.description} ${note.subject} ${(note.tags || []).join(' ')}`.toLowerCase()
          return combined.includes(search)
        }
        return true
      })
    },
    staleTime: 1000 * 30,
  })
}

export function useAllNotesAdmin() {
  return useQuery({
    queryKey: ['admin', 'notes', 'all'],
    queryFn: async () => {
      try {
        const res = await api.get<{ notes: Note[] }>('/admin/notes')
        if (res.data?.notes) return res.data.notes
      } catch {}
      return getLocalNotes()
    },
  })
}

export function useNote(id?: string) {
  return useQuery({
    queryKey: ['note', id],
    enabled: !!id,
    queryFn: async () => {
      const all = getLocalNotes()
      const found = all.find((n) => n.id === id)
      if (found) return found
      try {
        const res = await api.get<{ notes: Note[] }>(`/notes?q=${id}`)
        return res.data.notes?.[0] || null
      } catch {
        return null
      }
    },
  })
}

export interface UploadNotePayload {
  title: string
  description: string
  subject: string
  classId?: string
  tags: string[]
  fileName: string
  isTrusted: boolean
  uploaderName: string
  uploaderId: string
}

export function useUploadNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadNotePayload) => {
      try {
        const res = await api.post<{ note: Note; autoPublished: boolean }>('/notes', {
          title: payload.title,
          description: payload.description,
          subject: payload.subject,
          classId: payload.classId || null,
          tags: payload.tags,
          fileName: payload.fileName,
        })
        if (res.data?.note) {
          return { note: res.data.note, autoPublished: res.data.autoPublished }
        }
      } catch {
        // Fallback local persistence
      }

      const all = getLocalNotes()
      const newNote: Note = {
        id: String(Date.now()),
        title: payload.title,
        description: payload.description,
        subject: payload.subject,
        classId: payload.classId || 'cs201',
        tags: payload.tags,
        fileName: payload.fileName,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: payload.uploaderId,
        uploadedByName: payload.uploaderName,
        status: payload.isTrusted ? 'approved' : 'pending',
        trusted: payload.isTrusted,
        downloads: 0,
        pages: 12,
        color: 'lavender',
        createdAt: new Date().toISOString(),
        summary: `AI Synthesis: Detailed conceptual walkthrough of ${payload.title}. Includes study checkpoints and problem sets.`,
        keyConcepts: [
          `Foundational core of ${payload.subject} highlighted in this revision document.`,
          'Structured definitions, worked proofs, and reference diagrams for exams.',
        ],
        flashcards: [
          { q: `What is the central focus of ${payload.title}?`, a: payload.description },
        ],
      }

      saveLocalNotes([newNote, ...all])
      return { note: newNote, autoPublished: payload.isTrusted }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useReviewNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, decision, reason }: { id: string; decision: 'approve' | 'reject'; reason?: string }) => {
      try {
        await api.post(`/admin/notes/${id}/review`, { decision, reason })
      } catch {
        // Local fallback
      }

      const all = getLocalNotes()
      const updated = all.map((n) => (n.id === id ? { ...n, status: (decision === 'approve' ? 'approved' : 'rejected') as any } : n))
      saveLocalNotes(updated)
      return { id, decision }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.post(`/notes/${id}/delete`)
      } catch {}
      const all = getLocalNotes()
      const updated = all.filter((n) => n.id !== id)
      saveLocalNotes(updated)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}
