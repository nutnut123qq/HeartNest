import { UserRole } from '@/types'

/**
 * Get the appropriate dashboard route based on user role
 */
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return '/admin/dashboard'
    case UserRole.Nurse:
      return '/nurse/dashboard'
    case UserRole.User:
    default:
      return '/dashboard'
  }
}

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return 'Quản trị viên'
    case UserRole.Nurse:
      return 'Điều dưỡng'
    case UserRole.User:
    default:
      return 'Người dùng'
  }
}

/**
 * Check if user has permission to access a route
 */
export const hasRoutePermission = (userRole: UserRole, route: string): boolean => {
  // Admin can access everything
  if (userRole === UserRole.Admin) {
    return true
  }

  // Nurse can access nurse routes and general routes
  if (userRole === UserRole.Nurse) {
    return !route.startsWith('/admin/')
  }

  // User can only access general routes (not admin or nurse specific)
  return !route.startsWith('/admin/') && !route.startsWith('/nurse/')
}
