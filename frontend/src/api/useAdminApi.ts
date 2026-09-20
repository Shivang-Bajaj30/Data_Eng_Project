import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ModeratorRequest } from '../lib/auth'
import {
  INITIAL_MOD_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_STREAM_EVENTS,
  type KafkaStreamEvent,
} from './mockData'

const MOD_REQS_KEY = 'notevault_mod_requests_db'
const AUDIT_KEY = 'notevault_audit_logs_db'
const STREAM_KEY = 'notevault_stream_events_db'

function getLocalModRequests(): ModeratorRequest[] {
  try {
    const raw = localStorage.getItem(MOD_REQS_KEY)
    if (raw) return JSON.parse(raw) as ModeratorRequest[]
  } catch {}
  localStorage.setItem(MOD_REQS_KEY, JSON.stringify(INITIAL_MOD_REQUESTS))
  return INITIAL_MOD_REQUESTS
}

function saveLocalModRequests(reqs: ModeratorRequest[]) {
  localStorage.setItem(MOD_REQS_KEY, JSON.stringify(reqs))
}

function getLocalAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  localStorage.setItem(AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS))
  return INITIAL_AUDIT_LOGS
}

function getLocalStreams(): KafkaStreamEvent[] {
  try {
    const raw = localStorage.getItem(STREAM_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  localStorage.setItem(STREAM_KEY, JSON.stringify(INITIAL_STREAM_EVENTS))
  return INITIAL_STREAM_EVENTS
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/analytics')
        if (res.data) return res.data
      } catch {}

      return {
        totals: {
          notes: 76,
          approved: 64,
          pending: 12,
          classes: 6,
          users: 312,
          openReports: 2,
          pendingModeratorRequests: 2,
        },
        uploadsPerSubject: {
          'Computer Science': 42,
          Mathematics: 19,
          Physics: 16,
          Biology: 11,
          Economics: 9,
        },
        trustedModerators: 14,
        unprovenModerators: 6,
      }
    },
  })
}

export function useAdminStreams() {
  return useQuery({
    queryKey: ['admin', 'streams'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/streams')
        if (res.data) return res.data
      } catch {}

      return {
        status: 'HEALTHY',
        lastProcessedAt: new Date().toISOString(),
        totalProcessed: 18452,
        consumerLag: 0,
        instance: 'oracle-vm-cluster-1 (Aiven Kafka)',
        topics: ['note-events', 'audit-stream', 'reputation-stream', 'user-events', 'search-events'],
      }
    },
    refetchInterval: 5000,
  })
}

export function useAdminEvents() {
  return useQuery({
    queryKey: ['admin', 'events'],
    queryFn: async () => {
      try {
        const res = await api.get<{ events: KafkaStreamEvent[] }>('/admin/events')
        if (res.data?.events) return res.data.events
      } catch {}
      return getLocalStreams()
    },
    refetchInterval: 6000,
  })
}

export function useAdminAudit() {
  return useQuery({
    queryKey: ['admin', 'audit'],
    queryFn: async () => {
      try {
        const res = await api.get<{ logs: any[] }>('/admin/audit')
        if (res.data?.logs) return res.data.logs
      } catch {}
      return getLocalAuditLogs()
    },
  })
}

export function useModeratorRequests() {
  return useQuery({
    queryKey: ['admin', 'moderator-requests'],
    queryFn: async () => {
      try {
        const res = await api.get<{ requests: ModeratorRequest[] }>('/moderator-requests')
        if (res.data?.requests) return res.data.requests
      } catch {}
      return getLocalModRequests()
    },
  })
}

export function useReviewModeratorRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'approved' | 'rejected' }) => {
      try {
        await api.post(`/moderator-requests/${id}/review`, { decision })
      } catch {}

      const all = getLocalModRequests()
      const updated = all.map((r) => (r.id === id ? { ...r, status: decision } : r))
      saveLocalModRequests(updated)
      return { id, decision }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderator-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] })
    },
  })
}
