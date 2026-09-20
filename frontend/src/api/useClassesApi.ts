import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { StudyClass } from '../lib/auth'
import { INITIAL_CLASSES } from './mockData'

const CLASSES_KEY = 'notevault_classes_db'

function getLocalClasses(): StudyClass[] {
  try {
    const raw = localStorage.getItem(CLASSES_KEY)
    if (raw) return JSON.parse(raw) as StudyClass[]
  } catch {}
  localStorage.setItem(CLASSES_KEY, JSON.stringify(INITIAL_CLASSES))
  return INITIAL_CLASSES
}

function saveLocalClasses(classes: StudyClass[]) {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes))
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      try {
        const res = await api.get<{ classes: StudyClass[] }>('/classes')
        if (res.data?.classes && res.data.classes.length > 0) return res.data.classes
      } catch {}
      return getLocalClasses()
    },
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string; subject: string; description: string }) => {
      try {
        const res = await api.post<{ class: StudyClass }>('/classes', payload)
        if (res.data?.class) return res.data.class
      } catch {}

      const all = getLocalClasses()
      const newClass: StudyClass = {
        id: payload.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: payload.name,
        subject: payload.subject,
        description: payload.description,
        noteCount: 0,
      }
      saveLocalClasses([...all, newClass])
      return newClass
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}
