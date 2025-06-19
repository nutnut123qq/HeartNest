// Constants for CareNest Frontend Application

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/auth/me',
  },

  // Family Management
  FAMILY: {
    BASE: '/api/family',
    INVITE: '/api/family/invite',
    MEMBERS: '/api/family/members',
    INVITATIONS: '/api/family/invitations',
  },

  // Reminders
  REMINDERS: {
    BASE: '/api/reminders',
    UPCOMING: '/api/reminders/upcoming',
    HISTORY: '/api/reminders/history',
  },

  // Healthcare
  HEALTHCARE: {
    FACILITIES: '/api/healthcare/facilities',
    PROVIDERS: '/api/healthcare/providers',
    NEARBY: '/api/healthcare/facilities/nearby',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/api/chat/conversations',
    MESSAGES: '/api/chat/conversations',
  },

  // Subscription
  SUBSCRIPTION: {
    PLANS: '/api/subscription/plans',
    CURRENT: '/api/subscription/current',
    UPGRADE: '/api/subscription/upgrade',
    CANCEL: '/api/subscription/cancel',
    BILLING: '/api/subscription/billing-history',
    PAYMENT: '/api/subscription/payment',
  },
} as const

// ===== SUBSCRIPTION PLANS =====
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Miễn phí',
    tier: 'free',
    price: 0,
    duration: 0,
    maxFamilyMembers: 1,
    features: [
      'Nhắc nhở cơ bản qua web/Zalo/SMS',
      'Tìm phòng khám/nhà thuốc gần nhất',
      'Hỗ trợ cơ bản'
    ],
    channels: ['web', 'zalo', 'sms'],
    popular: false,
  },

  SMALL_FAMILY: {
    id: 'small_family',
    name: 'Gói Gia Đình Nhỏ',
    tier: 'small_family',
    price: 89000,
    duration: 3,
    maxFamilyMembers: 3,
    features: [
      'Tất cả tính năng gói miễn phí',
      'Hệ thống nhắc nhở đầy đủ',
      'Tìm kiếm nhà cung cấp dịch vụ y tế',
      'Chat cơ bản với bác sĩ',
      'Quản lý 3 thành viên gia đình'
    ],
    channels: ['web', 'zalo', 'sms', 'email'],
    popular: false,
  },

  LOVE_PACKAGE: {
    id: 'love_package',
    name: 'Gói Yêu Thương',
    tier: 'love_package',
    price: 109000,
    duration: 3,
    maxFamilyMembers: 5,
    features: [
      'Tất cả tính năng gói gia đình nhỏ',
      'Quản lý 5 thành viên gia đình',
      'Chat không giới hạn với bác sĩ',
      'Thông báo đẩy (push notifications)',
      'Báo cáo sức khỏe gia đình',
      'Hỗ trợ ưu tiên'
    ],
    channels: ['web', 'zalo', 'sms', 'email', 'push'],
    popular: true,
  },

  CUSTOM: {
    id: 'custom',
    name: 'Gói Tùy Chỉnh',
    tier: 'custom',
    price: 30000,
    duration: 3,
    maxFamilyMembers: -1, // unlimited
    features: [
      'Tất cả tính năng gói yêu thương',
      'Không giới hạn thành viên gia đình',
      'Phân tích sức khỏe nâng cao',
      'Báo cáo chi tiết',
      'Hỗ trợ 24/7',
      'Tích hợp API tùy chỉnh'
    ],
    channels: ['web', 'zalo', 'sms', 'email', 'push'],
    popular: false,
    pricePerPerson: true,
  },
} as const

// ===== REMINDER TYPES =====
export const REMINDER_TYPES = {
  MEDICATION: {
    id: 'medication',
    name: 'Uống thuốc',
    icon: '💊',
    color: 'bg-blue-500',
  },
  APPOINTMENT: {
    id: 'appointment',
    name: 'Lịch hẹn khám',
    icon: '🏥',
    color: 'bg-green-500',
  },
  EXERCISE: {
    id: 'exercise',
    name: 'Tập thể dục',
    icon: '🏃‍♂️',
    color: 'bg-orange-500',
  },
  CHECKUP: {
    id: 'checkup',
    name: 'Kiểm tra sức khỏe',
    icon: '🩺',
    color: 'bg-purple-500',
  },
  CUSTOM: {
    id: 'custom',
    name: 'Tùy chỉnh',
    icon: '📝',
    color: 'bg-gray-500',
  },
} as const

// ===== NOTIFICATION CHANNELS =====
export const NOTIFICATION_CHANNELS = {
  WEB: {
    id: 'web',
    name: 'Thông báo web',
    icon: '🌐',
    description: 'Thông báo trên trình duyệt',
  },
  EMAIL: {
    id: 'email',
    name: 'Email',
    icon: '📧',
    description: 'Gửi email nhắc nhở',
  },
  SMS: {
    id: 'sms',
    name: 'SMS',
    icon: '📱',
    description: 'Tin nhắn SMS',
  },
  PUSH: {
    id: 'push',
    name: 'Push notification',
    icon: '🔔',
    description: 'Thông báo đẩy trên thiết bị',
  },
  ZALO: {
    id: 'zalo',
    name: 'Zalo',
    icon: '💬',
    description: 'Tin nhắn qua Zalo',
  },
} as const

// ===== HEALTHCARE FACILITY TYPES =====
export const FACILITY_TYPES = {
  HOSPITAL: {
    id: 'hospital',
    name: 'Bệnh viện',
    icon: '🏥',
    color: 'text-red-600',
  },
  CLINIC: {
    id: 'clinic',
    name: 'Phòng khám',
    icon: '🏥',
    color: 'text-blue-600',
  },
  PHARMACY: {
    id: 'pharmacy',
    name: 'Nhà thuốc',
    icon: '💊',
    color: 'text-green-600',
  },
  LABORATORY: {
    id: 'laboratory',
    name: 'Phòng xét nghiệm',
    icon: '🔬',
    color: 'text-purple-600',
  },
  EMERGENCY: {
    id: 'emergency',
    name: 'Cấp cứu',
    icon: '🚑',
    color: 'text-red-800',
  },
} as const

// ===== FAMILY ROLES =====
export const FAMILY_ROLES = {
  ADMIN: {
    id: 'admin',
    name: 'Quản trị viên',
    description: 'Có quyền quản lý toàn bộ gia đình',
    permissions: ['all'],
  },
  MEMBER: {
    id: 'member',
    name: 'Thành viên',
    description: 'Thành viên bình thường của gia đình',
    permissions: ['view_family', 'create_reminders', 'chat'],
  },
  CHILD: {
    id: 'child',
    name: 'Con em',
    description: 'Thành viên nhỏ tuổi, quyền hạn chế',
    permissions: ['view_reminders', 'chat_supervised'],
  },
} as const

// ===== UI CONSTANTS =====
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,

  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
} as const

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+84|0)[3-9]\d{8}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZÀ-ỹ\s]+$/,
  },
} as const

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_WEAK: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  NAME_TOO_SHORT: 'Tên phải có ít nhất 2 ký tự',
  NAME_TOO_LONG: 'Tên không được quá 50 ký tự',
  INVALID_NAME: 'Tên chỉ được chứa chữ cái và khoảng trắng',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  FORBIDDEN: 'Truy cập bị từ chối',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi máy chủ, vui lòng thử lại sau',
} as const

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công',
  REMINDER_CREATED: 'Tạo nhắc nhở thành công',
  REMINDER_UPDATED: 'Cập nhật nhắc nhở thành công',
  REMINDER_DELETED: 'Xóa nhắc nhở thành công',
  FAMILY_MEMBER_INVITED: 'Gửi lời mời thành công',
  FAMILY_MEMBER_REMOVED: 'Xóa thành viên thành công',
  SUBSCRIPTION_UPGRADED: 'Nâng cấp gói dịch vụ thành công',
  MESSAGE_SENT: 'Gửi tin nhắn thành công',
} as const

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'carenest_access_token',
  REFRESH_TOKEN: 'carenest_refresh_token',
  USER_DATA: 'carenest_user_data',
  THEME: 'carenest_theme',
  LANGUAGE: 'carenest_language',
  NOTIFICATION_SETTINGS: 'carenest_notification_settings',
} as const

// ===== ROUTES =====
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PRICING: '/pricing',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  FAMILY: '/family',
  FAMILY_INVITE: '/family/invite',
  FAMILY_MEMBERS: '/family/members',

  REMINDERS: '/reminders',
  REMINDERS_CREATE: '/reminders/create',

  HEALTHCARE: '/healthcare',
  HEALTHCARE_MAP: '/map',
  HEALTHCARE_PROVIDERS: '/healthcare/providers',

  CHAT: '/chat',

  SUBSCRIPTION: '/subscription',
  SUBSCRIPTION_UPGRADE: '/subscription/upgrade',
  SUBSCRIPTION_BILLING: '/subscription/billing',

  SETTINGS: '/settings',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy',
} as const
