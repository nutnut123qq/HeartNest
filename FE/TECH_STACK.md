# CareNest Frontend Technology Stack

## 🚀 Core Framework & Language

### Next.js 14 (App Router)
```bash
npx create-next-app@latest carenest-frontend --typescript --tailwind --eslint --app
```

**Lý do chọn:**
- Server-side rendering (SSR) và Static Site Generation (SSG)
- App Router mới với layout system mạnh mẽ
- Built-in optimization (Image, Font, Bundle)
- Excellent developer experience
- Perfect cho SEO và performance

### TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Lý do chọn:**
- Type safety giảm bugs
- Better IDE support và autocomplete
- Easier refactoring và maintenance
- Team collaboration tốt hơn

## 🎨 Styling & UI Framework

### Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npm install @tailwindcss/forms @tailwindcss/typography
```

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Headless UI
```bash
npm install @headlessui/react
```

**Components sử dụng:**
- Dialog (Modals)
- Disclosure (Accordions)
- Listbox (Select dropdowns)
- Menu (Dropdown menus)
- Switch (Toggle switches)
- Tabs
- Combobox (Autocomplete)

## 🗄️ State Management

### Zustand
```bash
npm install zustand
```

**Store Structure:**
```typescript
// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // Implementation
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
```

**Lý do chọn Zustand:**
- Lightweight (2.9kb gzipped)
- No boilerplate code
- TypeScript support tốt
- Easy to test
- Không cần providers

## 📝 Form Handling

### React Hook Form + Zod
```bash
npm install react-hook-form @hookform/resolvers zod
```

**Example Usage:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginForm) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

## 🌐 HTTP Client

### Axios with Interceptors
```bash
npm install axios
```

**Configuration:**
```typescript
// src/lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken })
          const { accessToken } = response.data
          useAuthStore.getState().setAccessToken(accessToken)
          return api.request(error.config)
        } catch (refreshError) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

## 🗺️ Maps & Location

### Google Maps Integration
```bash
npm install @googlemaps/react-wrapper
npm install @types/google.maps
```

**Setup:**
```typescript
// src/components/features/Healthcare/HealthcareMap.tsx
import { Wrapper, Status } from '@googlemaps/react-wrapper'

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>
    case Status.FAILURE:
      return <div>Error loading map</div>
    default:
      return null
  }
}

const HealthcareMap = () => {
  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      render={render}
    >
      <MapComponent />
    </Wrapper>
  )
}
```

## 💬 Real-time Communication

### Socket.io Client
```bash
npm install socket.io-client
```

**Setup:**
```typescript
// src/lib/socket.ts
import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId)
  }

  sendMessage(roomId: string, message: string) {
    this.socket?.emit('send-message', { roomId, message })
  }

  onMessage(callback: (message: any) => void) {
    this.socket?.on('new-message', callback)
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }
}

export const socketService = new SocketService()
```

## 🎭 Icons & Animations

### Lucide React (Icons)
```bash
npm install lucide-react
```

### Framer Motion (Animations)
```bash
npm install framer-motion
```

**Example Usage:**
```typescript
import { motion } from 'framer-motion'
import { Heart, Bell, MapPin } from 'lucide-react'

const AnimatedCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center space-x-2">
        <Heart className="w-5 h-5 text-red-500" />
        <span>CareNest</span>
      </div>
    </motion.div>
  )
}
```

## 📊 Charts & Data Visualization

### Recharts
```bash
npm install recharts
```

**Example Usage:**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const HealthAnalytics = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="completedReminders" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

## 🕒 Date & Time Handling

### date-fns
```bash
npm install date-fns
```

**Utilities:**
```typescript
// src/lib/dateUtils.ts
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'

export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) return 'Hôm nay'
  if (isTomorrow(dateObj)) return 'Ngày mai'
  
  return format(dateObj, 'dd/MM/yyyy', { locale: vi })
}

export const formatTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm')
}

export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: vi })
}
```

## 🔔 Notifications

### React Hot Toast
```bash
npm install react-hot-toast
```

**Setup:**
```typescript
// src/components/ui/Toast.tsx
import toast, { Toaster } from 'react-hot-toast'

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => toast.promise(promise, messages),
}

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  )
}
```

## 🧪 Testing

### Jest + React Testing Library
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Playwright (E2E Testing)
```bash
npm install -D @playwright/test
```

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build"
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.carenest.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_SOCKET_URL=wss://api.carenest.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://carenest.com
```

---

## 📋 Installation Commands Summary

```bash
# Create Next.js project
npx create-next-app@latest carenest-frontend --typescript --tailwind --eslint --app

# Core dependencies
npm install zustand axios react-hook-form @hookform/resolvers zod
npm install @headlessui/react lucide-react framer-motion
npm install recharts date-fns react-hot-toast
npm install socket.io-client @googlemaps/react-wrapper

# Development dependencies
npm install -D @types/google.maps jest @testing-library/react @testing-library/jest-dom
npm install -D jest-environment-jsdom @playwright/test
npm install -D @tailwindcss/forms @tailwindcss/typography

# Optional: Bundle analyzer
npm install -D @next/bundle-analyzer
```

Đây là tech stack hoàn chỉnh cho CareNest Frontend. Bạn có muốn tôi bắt đầu implement bất kỳ phần nào không?
