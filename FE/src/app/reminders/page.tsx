'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusIcon, BellIcon } from '@/components/ui/Icons';
import { ReminderList } from '@/components/reminder/ReminderList';
import { ReminderStatsCard } from '@/components/reminder/ReminderStatsCard';
import { Modal } from '@/components/ui/Modal';
import { ReminderForm } from '@/components/reminder/ReminderForm';
import { useReminderStore } from '@/store/reminderStore';
import { useAuthStore } from '@/store/authStore';
import type { ReminderResponse, CreateReminderRequest, UpdateReminderRequest, ReminderFilters } from '@/types/reminder';
import { toast } from 'react-hot-toast';

function RemindersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const {
    reminders,
    stats,
    loading,
    error,
    fetchReminders,
    fetchStats,
    createReminder,
    updateReminder,
    deleteReminder,
    clearError
  } = useReminderStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderResponse | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchReminders();
    fetchStats();

    // Check for action parameter
    const action = searchParams?.get('action');
    if (action === 'create') {
      setShowCreateModal(true);
    }
  }, [user, router, fetchReminders, fetchStats, searchParams]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreateReminder = async (data: CreateReminderRequest) => {
    try {
      await createReminder(data);
      setShowCreateModal(false);
      toast.success('Tạo nhắc nhở thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo nhắc nhở');
    }
  };

  const handleEditReminder = (reminder: ReminderResponse) => {
    setEditingReminder(reminder);
  };

  const handleUpdateReminder = async (data: UpdateReminderRequest) => {
    if (!editingReminder) return;

    try {
      await updateReminder(editingReminder.id, data);
      setEditingReminder(null);
      toast.success('Cập nhật nhắc nhở thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật nhắc nhở');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id);
      setDeleteConfirmId(null);
      toast.success('Xóa nhắc nhở thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa nhắc nhở');
    }
  };

  const handleFiltersChange = (filters: ReminderFilters) => {
    // Handle filters change - could be used to refetch data with filters
    console.log('Filters changed:', filters);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nhắc nhở</h1>
                <p className="text-sm text-gray-600">Quản lý các nhắc nhở sức khỏe của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tạo nhắc nhở
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <ReminderStatsCard stats={stats} loading={loading} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ReminderList
              reminders={reminders}
              loading={loading}
              error={error}
              onEdit={handleEditReminder}
              onDelete={(id) => setDeleteConfirmId(id)}
              onFiltersChange={handleFiltersChange}
              showFilters={true}
            />
          </div>
        </div>
      </div>

      {/* Create Reminder Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo nhắc nhở mới"
        size="lg"
      >
        <ReminderForm
          onSubmit={handleCreateReminder}
          onCancel={() => setShowCreateModal(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Reminder Modal */}
      <Modal
        isOpen={!!editingReminder}
        onClose={() => setEditingReminder(null)}
        title="Chỉnh sửa nhắc nhở"
        size="lg"
      >
        {editingReminder && (
          <ReminderForm
            reminder={editingReminder}
            onSubmit={handleUpdateReminder}
            onCancel={() => setEditingReminder(null)}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Xác nhận xóa"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa nhắc nhở này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={() => deleteConfirmId && handleDeleteReminder(deleteConfirmId)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function RemindersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <RemindersPageContent />
    </Suspense>
  );
}
