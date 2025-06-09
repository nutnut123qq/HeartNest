# CareNest Frontend Development Plan

## 🎯 Project Overview
CareNest là nền tảng chăm sóc sức khỏe gia đình giúp các thành viên nhắc nhở, theo dõi và hỗ trợ lẫn nhau trong các hoạt động sức khỏe hàng ngày.

## 📋 1. Page/Route Structure

### Public Routes
```
/                           # Landing page
/about                      # Giới thiệu về CareNest
/pricing                    # Bảng giá các gói dịch vụ
/contact                    # Liên hệ
/login                      # Đăng nhập
/register                   # Đăng ký
/forgot-password           # Quên mật khẩu
/reset-password            # Đặt lại mật khẩu
```

### Protected Routes (Authenticated Users)
```
/dashboard                  # Trang chủ sau đăng nhập
/profile                    # Thông tin cá nhân
/family                     # Quản lý gia đình
/family/invite             # Mời thành viên gia đình
/family/members            # Danh sách thành viên

/reminders                 # Quản lý nhắc nhở
/reminders/create          # Tạo nhắc nhở mới
/reminders/[id]            # Chi tiết nhắc nhở
/reminders/[id]/edit       # Chỉnh sửa nhắc nhở

/healthcare                # Dịch vụ y tế
/healthcare/map            # Bản đồ cơ sở y tế
/healthcare/providers      # Danh bạ nhà cung cấp
/healthcare/providers/[id] # Chi tiết nhà cung cấp

/chat                      # Hệ thống chat
/chat/[conversationId]     # Cuộc trò chuyện cụ thể

/subscription              # Quản lý gói dịch vụ
/subscription/upgrade      # Nâng cấp gói
/subscription/billing      # Lịch sử thanh toán

/settings                  # Cài đặt
/settings/notifications    # Cài đặt thông báo
/settings/privacy          # Cài đặt riêng tư
```

### Admin Routes (Premium Feature)
```
/admin/dashboard           # Dashboard quản trị
/admin/family-analytics    # Phân tích gia đình
/admin/reports             # Báo cáo
```

## 🧩 2. Component Architecture

### Core UI Components (`src/components/ui/`)
```
Button/                    # Các loại button
├── Button.tsx
├── IconButton.tsx
└── LoadingButton.tsx

Input/                     # Form inputs
├── TextInput.tsx
├── PasswordInput.tsx
├── DatePicker.tsx
├── TimePicker.tsx
└── SearchInput.tsx

Layout/                    # Layout components
├── Header.tsx
├── Sidebar.tsx
├── Footer.tsx
├── Container.tsx
└── Grid.tsx

Navigation/                # Navigation components
├── Navbar.tsx
├── Breadcrumb.tsx
├── Pagination.tsx
└── TabNavigation.tsx

Feedback/                  # User feedback
├── Alert.tsx
├── Toast.tsx
├── Modal.tsx
├── Tooltip.tsx
└── Loading.tsx

Data Display/              # Data presentation
├── Card.tsx
├── Table.tsx
├── List.tsx
├── Badge.tsx
└── Avatar.tsx
```

### Feature Components (`src/components/features/`)
```
Auth/                      # Authentication
├── LoginForm.tsx
├── RegisterForm.tsx
├── ForgotPasswordForm.tsx
└── ProtectedRoute.tsx

Dashboard/                 # Dashboard components
├── DashboardStats.tsx
├── RecentReminders.tsx
├── FamilyOverview.tsx
└── QuickActions.tsx

Reminders/                 # Reminder system
├── ReminderCard.tsx
├── ReminderForm.tsx
├── ReminderList.tsx
├── ReminderCalendar.tsx
└── ReminderNotification.tsx

Family/                    # Family management
├── FamilyMemberCard.tsx
├── FamilyInviteForm.tsx
├── FamilyTree.tsx
└── MemberPermissions.tsx

Healthcare/                # Healthcare features
├── HealthcareMap.tsx
├── ProviderCard.tsx
├── ProviderSearch.tsx
├── ProviderDetails.tsx
└── NearbyFacilities.tsx

Chat/                      # Chat system
├── ChatWindow.tsx
├── MessageList.tsx
├── MessageInput.tsx
├── ConversationList.tsx
└── UserTyping.tsx

Subscription/              # Subscription management
├── PricingCard.tsx
├── SubscriptionStatus.tsx
├── PaymentForm.tsx
└── BillingHistory.tsx
```

## 🗄️ 3. State Management Strategy

### Global State (Zustand)
```typescript
// User & Authentication
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateProfile: (data: ProfileData) => Promise<void>
}

// Family Management
interface FamilyStore {
  family: Family | null
  members: FamilyMember[]
  invitations: Invitation[]
  addMember: (member: FamilyMember) => void
  removeMember: (memberId: string) => void
  updateMemberPermissions: (memberId: string, permissions: Permission[]) => void
}

// Reminders
interface ReminderStore {
  reminders: Reminder[]
  activeReminders: Reminder[]
  createReminder: (reminder: CreateReminderData) => Promise<void>
  updateReminder: (id: string, data: UpdateReminderData) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  markAsCompleted: (id: string) => Promise<void>
}

// Chat
interface ChatStore {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  sendMessage: (message: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
}

// Subscription
interface SubscriptionStore {
  currentPlan: SubscriptionPlan | null
  usage: UsageStats
  billingHistory: BillingRecord[]
  upgradePlan: (planId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
}
```

### Local State (React useState/useReducer)
- Form states
- UI states (modals, dropdowns)
- Component-specific data
- Temporary data before API calls

## 🔌 4. API Integration Plan

### Authentication APIs
```typescript
// Auth Service
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Family Management APIs
```typescript
// Family Service
GET    /api/family
POST   /api/family/invite
GET    /api/family/members
PUT    /api/family/members/{id}
DELETE /api/family/members/{id}
GET    /api/family/invitations
POST   /api/family/invitations/{id}/accept
DELETE /api/family/invitations/{id}/decline
```

### Reminder APIs
```typescript
// Reminder Service
GET    /api/reminders
POST   /api/reminders
GET    /api/reminders/{id}
PUT    /api/reminders/{id}
DELETE /api/reminders/{id}
POST   /api/reminders/{id}/complete
GET    /api/reminders/upcoming
GET    /api/reminders/history
```

### Healthcare APIs
```typescript
// Healthcare Service
GET /api/healthcare/facilities/nearby?lat={lat}&lng={lng}&radius={radius}
GET /api/healthcare/providers
GET /api/healthcare/providers/{id}
GET /api/healthcare/providers/search?query={query}&type={type}
```

### Chat APIs
```typescript
// Chat Service
GET    /api/chat/conversations
POST   /api/chat/conversations
GET    /api/chat/conversations/{id}/messages
POST   /api/chat/conversations/{id}/messages
PUT    /api/chat/conversations/{id}/read
WebSocket /ws/chat/{conversationId}
```

### Subscription APIs
```typescript
// Subscription Service
GET  /api/subscription/plans
GET  /api/subscription/current
POST /api/subscription/upgrade
POST /api/subscription/cancel
GET  /api/subscription/billing-history
POST /api/subscription/payment
```

## 🔐 5. Authentication & Authorization

### Authentication Flow
```typescript
// JWT-based authentication
interface AuthFlow {
  // 1. User login
  login: (email: string, password: string) => Promise<AuthResponse>

  // 2. Store tokens
  storeTokens: (accessToken: string, refreshToken: string) => void

  // 3. Auto-refresh tokens
  refreshToken: () => Promise<string>

  // 4. Logout
  logout: () => void
}

// Route Protection
const ProtectedRoute = ({ children, requiredPlan }: {
  children: React.ReactNode
  requiredPlan?: SubscriptionPlan
}) => {
  const { isAuthenticated, user } = useAuthStore()
  const { currentPlan } = useSubscriptionStore()

  if (!isAuthenticated) return <Navigate to="/login" />
  if (requiredPlan && !hasAccess(currentPlan, requiredPlan)) {
    return <UpgradePrompt requiredPlan={requiredPlan} />
  }

  return <>{children}</>
}
```

### Authorization Levels
```typescript
enum SubscriptionTier {
  FREE = 'free',
  SMALL_FAMILY = 'small_family',
  LOVE_PACKAGE = 'love_package',
  CUSTOM = 'custom'
}

interface FeatureAccess {
  [SubscriptionTier.FREE]: {
    maxFamilyMembers: 1
    features: ['basic_reminders', 'nearby_facilities']
    channels: ['web', 'zalo', 'sms']
  }
  [SubscriptionTier.SMALL_FAMILY]: {
    maxFamilyMembers: 3
    features: ['full_reminders', 'healthcare_search', 'basic_chat']
    channels: ['web', 'zalo', 'sms', 'email']
  }
  [SubscriptionTier.LOVE_PACKAGE]: {
    maxFamilyMembers: 5
    features: ['all_features']
    channels: ['all']
  }
  [SubscriptionTier.CUSTOM]: {
    maxFamilyMembers: 'unlimited'
    features: ['all_features', 'analytics', 'priority_support']
    channels: ['all']
  }
}
```

## 🚀 6. Development Phases

### Phase 1: MVP Core (4-6 weeks)
**Priority: HIGH**
```
Week 1-2: Foundation
- ✅ Project setup (Next.js, TypeScript, Tailwind CSS)
- ✅ Authentication system (login/register)
- ✅ Basic routing and navigation
- ✅ Core UI components library

Week 3-4: Core Features
- ✅ Dashboard layout
- ✅ Basic reminder system (create, view, edit)
- ✅ Family member management
- ✅ User profile management

Week 5-6: Essential Features
- ✅ Nearby facilities map (Google Maps integration)
- ✅ Basic notification system
- ✅ Subscription management (FREE tier)
- ✅ Responsive design
```

### Phase 2: Premium Features (4-5 weeks)
**Priority: MEDIUM**
```
Week 7-8: Enhanced Reminders
- ✅ Advanced reminder scheduling
- ✅ Multiple notification channels
- ✅ Reminder templates
- ✅ Recurring reminders

Week 9-10: Healthcare Directory
- ✅ Healthcare provider search
- ✅ Provider details and reviews
- ✅ Appointment booking integration
- ✅ Emergency contacts

Week 11: Chat System Foundation
- ✅ Real-time chat infrastructure
- ✅ Basic messaging interface
- ✅ Doctor-patient chat rooms
```

### Phase 3: Advanced Features (3-4 weeks)
**Priority: MEDIUM-LOW**
```
Week 12-13: Advanced Chat
- ✅ File sharing in chat
- ✅ Voice messages
- ✅ Chat history and search
- ✅ Online status indicators

Week 14-15: Analytics & Reports
- ✅ Family health analytics
- ✅ Reminder completion reports
- ✅ Usage statistics
- ✅ Export functionality
```

### Phase 4: Polish & Optimization (2-3 weeks)
**Priority: LOW**
```
Week 16-17: Performance & UX
- ✅ Performance optimization
- ✅ Advanced animations
- ✅ Accessibility improvements
- ✅ SEO optimization

Week 18: Testing & Deployment
- ✅ End-to-end testing
- ✅ User acceptance testing
- ✅ Production deployment
- ✅ Monitoring setup
```

## 🛠️ 7. Technology Choices

### Core Framework & Tools
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS + Headless UI",
  "stateManagement": "Zustand",
  "formHandling": "React Hook Form + Zod",
  "httpClient": "Axios with interceptors"
}
```

### UI & Design System
```json
{
  "componentLibrary": "Headless UI + Custom components",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "charts": "Recharts",
  "dateHandling": "date-fns",
  "notifications": "React Hot Toast"
}
```

### Maps & Location
```json
{
  "mapProvider": "Google Maps API",
  "mapLibrary": "@googlemaps/react-wrapper",
  "geocoding": "Google Geocoding API",
  "directions": "Google Directions API"
}
```

### Real-time Communication
```json
{
  "websockets": "Socket.io-client",
  "pushNotifications": "Web Push API",
  "voiceChat": "WebRTC (future enhancement)"
}
```

### Development & Testing
```json
{
  "testing": "Jest + React Testing Library",
  "e2eTesting": "Playwright",
  "linting": "ESLint + Prettier",
  "typeChecking": "TypeScript strict mode",
  "bundleAnalysis": "Next.js Bundle Analyzer"
}
```

### Deployment & Monitoring
```json
{
  "hosting": "Vercel (recommended for Next.js)",
  "cdn": "Vercel Edge Network",
  "analytics": "Vercel Analytics",
  "errorTracking": "Sentry",
  "performance": "Web Vitals"
}
```

## 📱 8. Responsive Design Strategy

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px'   /* Mobile landscape */
md: '768px'   /* Tablet */
lg: '1024px'  /* Desktop */
xl: '1280px'  /* Large desktop */
2xl: '1536px' /* Extra large */
```

### Key Responsive Features
- ✅ Mobile-first navigation (hamburger menu)
- ✅ Touch-friendly interface elements
- ✅ Responsive grid layouts
- ✅ Adaptive typography
- ✅ Progressive Web App (PWA) capabilities

## 🔔 9. Notification Strategy

### Notification Channels by Tier
```typescript
interface NotificationChannels {
  FREE: ['web', 'email']
  SMALL_FAMILY: ['web', 'email', 'sms']
  LOVE_PACKAGE: ['web', 'email', 'sms', 'push']
  CUSTOM: ['web', 'email', 'sms', 'push', 'zalo']
}
```

### Implementation
- ✅ Web notifications (browser API)
- ✅ Email notifications (backend integration)
- ✅ SMS integration (Twilio/local provider)
- ✅ Push notifications (service worker)
- ✅ Zalo integration (Zalo API)

## 📊 10. Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Additional Metrics
- **Time to Interactive**: < 3s
- **Bundle Size**: < 250KB (gzipped)
- **API Response Time**: < 500ms
- **Offline Capability**: Basic functionality available

## 🧪 11. Testing Strategy

### Unit Testing (70%)
- Component testing with React Testing Library
- Hook testing with @testing-library/react-hooks
- Utility function testing

### Integration Testing (20%)
- API integration tests
- State management tests
- Form submission flows

### E2E Testing (10%)
- Critical user journeys
- Payment flows
- Cross-browser compatibility

## 🚀 12. Deployment Pipeline

### Development Workflow
```
1. Feature branch → Development
2. Pull request → Code review
3. Staging deployment → QA testing
4. Production deployment → Monitoring
```

### Environment Strategy
- **Development**: Local development with hot reload
- **Staging**: Preview deployments for testing
- **Production**: Optimized build with CDN

---

## 📋 Next Steps

1. **Setup Development Environment**
   - Initialize Next.js project with TypeScript
   - Configure Tailwind CSS and ESLint
   - Setup folder structure according to plan

2. **Implement Authentication**
   - Create login/register forms
   - Setup JWT token management
   - Implement route protection

3. **Build Core UI Components**
   - Design system components
   - Layout components
   - Form components

4. **Start MVP Development**
   - Dashboard implementation
   - Basic reminder system
   - Family management

Bạn có muốn tôi bắt đầu implement bất kỳ phần nào trong kế hoạch này không?
