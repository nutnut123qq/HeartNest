# Trang Family - CareNest

## Tổng quan
Trang `/family` là một phần quan trọng của hệ thống CareNest, cho phép người dùng quản lý gia đình và các thành viên trong gia đình.

## Tính năng đã triển khai

### 1. Trang chính (`page.tsx`)
- **Hiển thị thông tin gia đình**: Tên gia đình, số thành viên, thống kê
- **Quản lý thành viên**: Danh sách thành viên với avatar, tên, vai trò
- **Mời thành viên mới**: Chỉ admin mới có quyền mời
- **Quản lý lời mời**: Xem, chấp nhận, từ chối lời mời
- **Loading states**: Hiển thị loading khi đang tải dữ liệu
- **Empty state**: Hiển thị form tạo gia đình khi chưa có gia đình

### 2. Components đã tạo

#### `FamilyStats.tsx`
- Hiển thị thống kê tổng quan của gia đình
- 4 cards thống kê: Tổng thành viên, Quản trị viên, Nhắc nhở hôm nay, Hoạt động gần đây
- Responsive design với grid layout

#### `InvitationManager.tsx`
- Quản lý lời mời tham gia gia đình
- Hiển thị lời mời đang chờ với actions (chấp nhận/từ chối)
- Lịch sử lời mời đã xử lý
- Badge hiển thị số lượng lời mời đang chờ

#### `AddMemberModal.tsx`
- Modal để mời thành viên mới
- Form validation cho email và vai trò
- Chọn vai trò: Thành viên hoặc Con em
- UI/UX thân thiện với thông tin hướng dẫn

#### `MemberActionsDropdown.tsx`
- Dropdown menu cho các hành động với thành viên
- Thay đổi vai trò (Admin/Member/Child)
- Xóa thành viên khỏi gia đình
- Chỉ admin mới thấy và sử dụng được

#### `FamilyOverview.tsx`
- Hiển thị thông tin chi tiết về gia đình
- Thống kê phân bố vai trò
- Thông tin ngày tạo, hoạt động gần đây
- Layout 2 cột responsive

#### `CreateFamilyCard.tsx`
- Form tạo gia đình mới cho người dùng chưa có gia đình
- Validation tên gia đình
- Hiển thị tính năng nổi bật
- Onboarding experience tốt

### 3. Tích hợp với hệ thống

#### State Management
- Sử dụng `useFamilyStore` từ Zustand
- Tích hợp với `useAuthStore` để lấy thông tin user
- Quản lý loading states và error handling

#### API Integration
- Sẵn sàng tích hợp với backend APIs:
  - `GET /api/family` - Lấy thông tin gia đình
  - `GET /api/family/members` - Lấy danh sách thành viên
  - `GET /api/family/invitations` - Lấy lời mời
  - `POST /api/family/invite` - Gửi lời mời
  - `PUT /api/family/members/{id}` - Cập nhật vai trò
  - `DELETE /api/family/members/{id}` - Xóa thành viên

#### UI Components
- Sử dụng design system có sẵn
- Consistent với các trang khác
- Responsive design
- Accessibility support

### 4. Permissions & Security
- **Role-based access control**:
  - Admin: Có thể mời, xóa thành viên, thay đổi vai trò
  - Member: Chỉ xem thông tin gia đình
  - Child: Quyền hạn chế nhất
- **UI restrictions**: Chỉ hiển thị actions cho user có quyền
- **Confirmation dialogs**: Cho các hành động nguy hiểm

### 5. UX/UI Design
- **Color scheme**: Navy blue (#2935AB) làm màu chính
- **Icons**: Family-oriented icons (Users, Crown, Baby, etc.)
- **Layout**: DashboardLayout với sidebar navigation
- **Responsive**: Mobile-first design
- **Loading states**: Skeleton loading và spinners
- **Empty states**: Meaningful empty states với call-to-action

## Cấu trúc file
```
FE/src/app/family/
├── page.tsx                    # Trang chính
├── components/
│   ├── FamilyStats.tsx        # Thống kê gia đình
│   ├── FamilyOverview.tsx     # Tổng quan chi tiết
│   ├── InvitationManager.tsx  # Quản lý lời mời
│   ├── AddMemberModal.tsx     # Modal thêm thành viên
│   ├── MemberActionsDropdown.tsx # Actions cho thành viên
│   └── CreateFamilyCard.tsx   # Form tạo gia đình mới
└── README.md                  # Documentation
```

## Tính năng cần phát triển tiếp (Phase 2)
1. **Family Settings**: Cài đặt gia đình (đổi tên, xóa gia đình)
2. **Family Calendar**: Lịch chung của gia đình
3. **Family Health Dashboard**: Dashboard sức khỏe tổng hợp
4. **Shared Medication Tracking**: Theo dõi thuốc chung
5. **Family Emergency Contacts**: Danh bạ khẩn cấp
6. **Family Health History**: Lịch sử sức khỏe gia đình
7. **Notifications**: Thông báo real-time cho gia đình
8. **Family Chat**: Chat nội bộ gia đình

## Testing
- Cần viết unit tests cho các components
- Integration tests cho user flows
- E2E tests cho các tính năng chính

## Performance
- Lazy loading cho các components lớn
- Memoization cho expensive calculations
- Optimistic updates cho better UX
