import { create } from 'zustand'
import { Reminder, CreateReminderData, UpdateReminderData } from '@/types'
import { api } from '@/lib/api'

interface ReminderState {
  // State
  reminders: Reminder[]
  activeReminders: Reminder[]
  upcomingReminders: Reminder[]
  isLoading: boolean

  // Actions
  fetchReminders: () => Promise<void>
  fetchUpcomingReminders: () => Promise<void>
  createReminder: (data: CreateReminderData) => Promise<void>
  updateReminder: (id: string, data: UpdateReminderData) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  markAsCompleted: (id: string) => Promise<void>
  markAsMissed: (id: string) => Promise<void>
  setReminders: (reminders: Reminder[]) => void
  addReminder: (reminder: Reminder) => void
  updateReminderInStore: (id: string, updates: Partial<Reminder>) => void
  removeReminderFromStore: (id: string) => void
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  // Initial state
  reminders: [],
  activeReminders: [],
  upcomingReminders: [],
  isLoading: false,

  // Actions
  fetchReminders: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get<Reminder[]>('/api/reminders')
      const reminders = response.data
      
      set({
        reminders,
        activeReminders: reminders.filter((r) => r.status === 'active'),
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchUpcomingReminders: async () => {
    try {
      const response = await api.get<Reminder[]>('/api/reminders/upcoming')
      set({ upcomingReminders: response.data })
    } catch (error) {
      console.error('Failed to fetch upcoming reminders:', error)
    }
  },

  createReminder: async (data: CreateReminderData) => {
    set({ isLoading: true })
    try {
      const response = await api.post<Reminder>('/api/reminders', data)
      const newReminder = response.data
      
      set((state) => ({
        reminders: [...state.reminders, newReminder],
        activeReminders: newReminder.status === 'active' 
          ? [...state.activeReminders, newReminder]
          : state.activeReminders,
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateReminder: async (id: string, data: UpdateReminderData) => {
    set({ isLoading: true })
    try {
      const response = await api.put<Reminder>(`/api/reminders/${id}`, data)
      const updatedReminder = response.data
      
      set((state) => ({
        reminders: state.reminders.map((r) => r.id === id ? updatedReminder : r),
        activeReminders: state.activeReminders.map((r) => 
          r.id === id ? updatedReminder : r
        ).filter((r) => r.status === 'active'),
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  deleteReminder: async (id: string) => {
    set({ isLoading: true })
    try {
      await api.delete(`/api/reminders/${id}`)
      
      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
        activeReminders: state.activeReminders.filter((r) => r.id !== id),
        upcomingReminders: state.upcomingReminders.filter((r) => r.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  markAsCompleted: async (id: string) => {
    try {
      const response = await api.post<Reminder>(`/api/reminders/${id}/complete`)
      const updatedReminder = response.data
      
      set((state) => ({
        reminders: state.reminders.map((r) => r.id === id ? updatedReminder : r),
        activeReminders: state.activeReminders.filter((r) => r.id !== id),
        upcomingReminders: state.upcomingReminders.filter((r) => r.id !== id),
      }))
    } catch (error) {
      throw error
    }
  },

  markAsMissed: async (id: string) => {
    try {
      const response = await api.put<Reminder>(`/api/reminders/${id}`, { status: 'missed' })
      const updatedReminder = response.data
      
      set((state) => ({
        reminders: state.reminders.map((r) => r.id === id ? updatedReminder : r),
        activeReminders: state.activeReminders.filter((r) => r.id !== id),
        upcomingReminders: state.upcomingReminders.filter((r) => r.id !== id),
      }))
    } catch (error) {
      throw error
    }
  },

  setReminders: (reminders: Reminder[]) => {
    set({
      reminders,
      activeReminders: reminders.filter((r) => r.status === 'active'),
    })
  },

  addReminder: (reminder: Reminder) => {
    set((state) => ({
      reminders: [...state.reminders, reminder],
      activeReminders: reminder.status === 'active' 
        ? [...state.activeReminders, reminder]
        : state.activeReminders,
    }))
  },

  updateReminderInStore: (id: string, updates: Partial<Reminder>) => {
    set((state) => ({
      reminders: state.reminders.map((r) => 
        r.id === id ? { ...r, ...updates } : r
      ),
      activeReminders: state.activeReminders.map((r) => 
        r.id === id ? { ...r, ...updates } : r
      ).filter((r) => r.status === 'active'),
    }))
  },

  removeReminderFromStore: (id: string) => {
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
      activeReminders: state.activeReminders.filter((r) => r.id !== id),
      upcomingReminders: state.upcomingReminders.filter((r) => r.id !== id),
    }))
  },
}))
