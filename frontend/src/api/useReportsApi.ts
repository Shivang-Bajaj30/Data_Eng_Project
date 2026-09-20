import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Report } from '../lib/auth'
import { INITIAL_REPORTS } from './mockData'

const REPORTS_KEY = 'notevault_reports_db'

function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    if (raw) return JSON.parse(raw) as Report[]
  } catch {}
  localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS))
  return INITIAL_REPORTS
}

function saveLocalReports(reports: Report[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const res = await api.get<{ reports: Report[] }>('/reports')
        if (res.data?.reports) return res.data.reports
      } catch {}
      return getLocalReports()
    },
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ noteId, reason, noteTitle, reportedByName }: { noteId: string; reason: string; noteTitle?: string; reportedByName?: string }) => {
      try {
        const res = await api.post<{ report: Report }>('/reports', { noteId, reason })
        if (res.data?.report) return res.data.report
      } catch {}

      const all = getLocalReports()
      const newReport: Report = {
        id: 'rep_' + Date.now(),
        noteId,
        noteTitle: noteTitle || 'Study Note #' + noteId,
        reportedByName: reportedByName || 'Anonymous Student',
        reason,
        status: 'open',
        createdAt: new Date().toISOString(),
      }
      saveLocalReports([newReport, ...all])
      return newReport
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useResolveReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'valid' | 'dismissed' }) => {
      try {
        await api.post(`/reports/${id}/resolve`, { decision })
      } catch {}

      const all = getLocalReports()
      const updated = all.map((r) => (r.id === id ? { ...r, status: decision as any } : r))
      saveLocalReports(updated)
      return { id, decision }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}
