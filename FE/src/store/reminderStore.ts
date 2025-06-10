import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { reminderService } from '@/services/reminderService';
import type { 
  ReminderResponse, 
  CreateReminderRequest, 
  UpdateReminderRequest, 
  ReminderStatsResponse,
  ReminderFilters,
  ReminderType 
} from '@/types/reminder';

interface ReminderState {
  // Data
  reminders: ReminderResponse[];
  currentReminder: ReminderResponse | null;
  stats: ReminderStatsResponse | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: ReminderFilters;
  
  // Actions
  fetchReminders: () => Promise<void>;
  fetchReminderById: (id: string) => Promise<void>;
  fetchUpcomingReminders: (hours?: number) => Promise<void>;
  fetchOverdueReminders: () => Promise<void>;
  fetchTodayReminders: () => Promise<void>;
  fetchActiveReminders: () => Promise<void>;
  fetchCompletedReminders: () => Promise<void>;
  fetchRemindersByType: (type: ReminderType) => Promise<void>;
  searchReminders: (searchTerm: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  
  createReminder: (data: CreateReminderRequest) => Promise<ReminderResponse>;
  updateReminder: (id: string, data: UpdateReminderRequest) => Promise<ReminderResponse>;
  deleteReminder: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAsIncomplete: (id: string) => Promise<void>;
  
  // Utility actions
  setFilters: (filters: Partial<ReminderFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  setCurrentReminder: (reminder: ReminderResponse | null) => void;
}

export const useReminderStore = create<ReminderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      reminders: [],
      currentReminder: null,
      stats: null,
      loading: false,
      error: null,
      filters: {},

      // Fetch all reminders
      fetchReminders: async () => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getReminders();
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch reminders',
            loading: false 
          });
        }
      },

      // Fetch reminder by ID
      fetchReminderById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const reminder = await reminderService.getReminderById(id);
          set({ currentReminder: reminder, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch reminder',
            loading: false 
          });
        }
      },

      // Fetch upcoming reminders
      fetchUpcomingReminders: async (hours = 24) => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getUpcomingReminders(hours);
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch upcoming reminders',
            loading: false 
          });
        }
      },

      // Fetch overdue reminders
      fetchOverdueReminders: async () => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getOverdueReminders();
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch overdue reminders',
            loading: false 
          });
        }
      },

      // Fetch today's reminders
      fetchTodayReminders: async () => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getTodayReminders();
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch today reminders',
            loading: false 
          });
        }
      },

      // Fetch active reminders
      fetchActiveReminders: async () => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getActiveReminders();
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch active reminders',
            loading: false 
          });
        }
      },

      // Fetch completed reminders
      fetchCompletedReminders: async () => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getCompletedReminders();
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch completed reminders',
            loading: false 
          });
        }
      },

      // Fetch reminders by type
      fetchRemindersByType: async (type: ReminderType) => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.getRemindersByType(type);
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch reminders by type',
            loading: false 
          });
        }
      },

      // Search reminders
      searchReminders: async (searchTerm: string) => {
        set({ loading: true, error: null });
        try {
          const reminders = await reminderService.searchReminders(searchTerm);
          set({ reminders, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search reminders',
            loading: false 
          });
        }
      },

      // Fetch stats
      fetchStats: async () => {
        set({ loading: true, error: null });
        try {
          const stats = await reminderService.getReminderStats();
          set({ stats, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
            loading: false 
          });
        }
      },

      // Create reminder
      createReminder: async (data: CreateReminderRequest) => {
        set({ loading: true, error: null });
        try {
          const newReminder = await reminderService.createReminder(data);
          const { reminders } = get();
          set({ 
            reminders: [newReminder, ...reminders],
            loading: false 
          });
          return newReminder;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create reminder',
            loading: false 
          });
          throw error;
        }
      },

      // Update reminder
      updateReminder: async (id: string, data: UpdateReminderRequest) => {
        set({ loading: true, error: null });
        try {
          const updatedReminder = await reminderService.updateReminder(id, data);
          const { reminders } = get();
          set({ 
            reminders: reminders.map(r => r.id === id ? updatedReminder : r),
            currentReminder: updatedReminder,
            loading: false 
          });
          return updatedReminder;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update reminder',
            loading: false 
          });
          throw error;
        }
      },

      // Delete reminder
      deleteReminder: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await reminderService.deleteReminder(id);
          const { reminders } = get();
          set({ 
            reminders: reminders.filter(r => r.id !== id),
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete reminder',
            loading: false 
          });
          throw error;
        }
      },

      // Mark as completed
      markAsCompleted: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const updatedReminder = await reminderService.markAsCompleted(id);
          const { reminders } = get();
          set({ 
            reminders: reminders.map(r => r.id === id ? updatedReminder : r),
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark as completed',
            loading: false 
          });
          throw error;
        }
      },

      // Mark as incomplete
      markAsIncomplete: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const updatedReminder = await reminderService.markAsIncomplete(id);
          const { reminders } = get();
          set({ 
            reminders: reminders.map(r => r.id === id ? updatedReminder : r),
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark as incomplete',
            loading: false 
          });
          throw error;
        }
      },

      // Utility actions
      setFilters: (newFilters: Partial<ReminderFilters>) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      clearError: () => {
        set({ error: null });
      },

      setCurrentReminder: (reminder: ReminderResponse | null) => {
        set({ currentReminder: reminder });
      }
    }),
    {
      name: 'reminder-store'
    }
  )
);
