'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Layout'
import {
  Heart,
  Bell,
  Users,
  MapPin,
  MessageCircle,
  Shield,
  Clock,
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // If user is authenticated, don't show landing page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600">CareNest</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link href="/login">
                <Button>Bắt đầu miễn phí</Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-16 lg:py-20 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-soft text-xs sm:text-sm">
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium text-secondary-700">
                  Được tin tưởng bởi hơn 10,000+ gia đình Việt Nam
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary-900 leading-tight">
                Chăm sóc sức khỏe{' '}
                <span className="text-primary-600">gia đình</span>{' '}
                thông minh
              </h1>

              <p className="text-lg sm:text-xl text-secondary-600 leading-relaxed">
                CareNest kết nối các thành viên gia đình qua việc chăm sóc sức khỏe.
                Nhắc nhở uống thuốc, theo dõi lịch khám và hỗ trợ nhau
                <span className="text-primary-600 font-semibold"> mọi lúc, mọi nơi</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full px-8"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Bắt đầu miễn phí
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8"
                  leftIcon={<Clock className="h-5 w-5" />}
                >
                  Xem demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-secondary-500">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary-500 flex-shrink-0" />
                  <span>Miễn phí mãi mãi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-primary-500 flex-shrink-0" />
                  <span>Không cần thẻ tín dụng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-500 flex-shrink-0" />
                  <span>Bảo mật tuyệt đối</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden min-h-[300px] lg:min-h-[400px]">
                {/* Healthcare Visual */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-6 left-6 w-6 h-6 bg-primary-400 rounded-full"></div>
                    <div className="absolute top-12 right-8 w-4 h-4 bg-primary-300 rounded-full"></div>
                    <div className="absolute bottom-12 left-8 w-3 h-3 bg-primary-500 rounded-full"></div>
                    <div className="absolute bottom-6 right-6 w-8 h-8 bg-primary-200 rounded-full"></div>
                  </div>

                  {/* Main Content */}
                  <div className="text-center text-primary-600 z-10 relative">
                    <div className="relative mb-4 lg:mb-6">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Heart className="h-8 w-8 lg:h-10 lg:w-10 text-primary-500" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-success-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-secondary-800 mb-1 lg:mb-2">Gia đình khỏe mạnh</h3>
                    <p className="text-sm lg:text-base text-secondary-600">Hạnh phúc mỗi ngày</p>
                  </div>
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 lg:p-4 shadow-sm">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm lg:text-base font-semibold text-secondary-900 truncate">4 thành viên</h4>
                        <p className="text-xs lg:text-sm text-secondary-600 truncate">Được bảo vệ bởi CareNest</p>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Tính năng nổi bật</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Giải pháp chăm sóc sức khỏe{' '}
              <span className="text-primary-600">toàn diện</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Tất cả những gì bạn cần để quản lý và chăm sóc sức khỏe gia đình một cách hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Smart Reminders */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Nhắc nhở thông minh
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Nhắc nhở uống thuốc, lịch khám và các hoạt động sức khỏe qua nhiều kênh:
                Web, SMS, Zalo, Email để đảm bảo không bỏ lỡ.
              </p>
            </div>

            {/* Feature 2 - Family Management */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Quản lý gia đình
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Theo dõi sức khỏe của tất cả thành viên gia đình từ trẻ em đến người cao tuổi
                trong một hệ thống tập trung.
              </p>
            </div>

            {/* Feature 3 - Healthcare Map */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Bản đồ y tế
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Tìm kiếm phòng khám, bệnh viện, nhà thuốc gần nhất với thông tin chi tiết
                và đánh giá từ cộng đồng.
              </p>
            </div>

            {/* Feature 4 - Doctor Consultation */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Tư vấn trực tuyến
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Chat trực tiếp với bác sĩ và chuyên gia y tế để được tư vấn kịp thời
                về các vấn đề sức khỏe.
              </p>
            </div>

            {/* Feature 5 - Security */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Bảo mật tuyệt đối
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Thông tin sức khỏe được mã hóa và bảo vệ theo tiêu chuẩn quốc tế,
                đảm bảo quyền riêng tư tuyệt đối.
              </p>
            </div>

            {/* Feature 6 - Multi-platform */}
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Đa nền tảng
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Sử dụng trên web, mobile app và tích hợp với Zalo để tiện lợi nhất
                cho mọi thành viên gia đình.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-3 py-2 rounded-full mb-4 lg:mb-6 text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 flex-shrink-0" />
              <span className="font-medium text-primary-700">Gói dịch vụ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-3 lg:mb-4">
              Gói dịch vụ{' '}
              <span className="text-primary-600">phù hợp</span>
            </h2>
            <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto px-4">
              Chọn gói dịch vụ phù hợp với nhu cầu và quy mô gia đình bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-secondary-200 hover:border-primary-300 transition-all duration-300 shadow-soft h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Miễn phí</h3>
                <div className="text-3xl font-bold text-secondary-900 mb-2">
                  0đ
                </div>
                <p className="text-sm text-secondary-500">mãi mãi</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>1 thành viên</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Nhắc nhở cơ bản</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Tìm cơ sở y tế</span>
                </li>
              </ul>

              <div className="mt-auto">
                <Button variant="outline" className="w-full">
                  Bắt đầu
                </Button>
              </div>
            </div>

            {/* Small Family Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-secondary-200 hover:border-primary-300 transition-all duration-300 shadow-soft h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Gia đình nhỏ</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  89k
                </div>
                <p className="text-sm text-secondary-500">3 tháng</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>3 thành viên</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Nhắc nhở đầy đủ</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Chat cơ bản</span>
                </li>
              </ul>

              <div className="mt-auto">
                <Button
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-primary"
                >
                  Chọn gói
                </Button>
              </div>
            </div>

            {/* Popular Plan */}
            <div className="bg-primary-50 rounded-2xl p-6 border-2 border-primary-600 shadow-primary h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Gói gia đình</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  109k
                </div>
                <p className="text-sm text-secondary-500">3 tháng</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>5 thành viên</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Tất cả tính năng</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Hỗ trợ ưu tiên</span>
                </li>
              </ul>

              <div className="mt-auto pt-4">
                <button
                  className="w-full h-11 px-6 py-3 text-white font-semibold rounded-2xl transition-all duration-300 shadow-primary"
                  style={{
                    background: 'linear-gradient(135deg, #2935ab, #1e2680)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e2680, #161b5c)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2935ab, #1e2680)'
                  }}
                >
                  Chọn gói
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-6 border-2 border-secondary-200 hover:border-primary-300 transition-all duration-300 shadow-soft h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Tùy chỉnh</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  30k
                </div>
                <p className="text-sm text-secondary-500">người/3 tháng</p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Không giới hạn</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>Báo cáo nâng cao</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-3 flex-shrink-0" />
                  <span>API tùy chỉnh</span>
                </li>
              </ul>

              <div className="mt-auto">
                <Button variant="outline" className="w-full">
                  Liên hệ
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <Container>
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Heart className="h-4 w-4 text-white" />
              <span className="text-sm font-medium">Hơn 10,000+ gia đình đã tin tưởng</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu chăm sóc gia đình ngay hôm nay
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn gia đình đã tin tưởng CareNest để chăm sóc sức khỏe
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Đăng ký miễn phí ngay
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10"
                leftIcon={<MessageCircle className="h-5 w-5" />}
              >
                Tư vấn miễn phí
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Miễn phí mãi mãi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Thiết lập trong 2 phút</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareNest</span>
              </div>
              <p className="text-secondary-400 mb-6">
                Nền tảng chăm sóc sức khỏe gia đình thông minh và hiệu quả.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Users className="h-5 w-5 text-secondary-400 hover:text-white transition-colors" />
                </div>
                <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-secondary-400 hover:text-white transition-colors" />
                </div>
                <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <Smartphone className="h-5 w-5 text-secondary-400 hover:text-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Sản phẩm</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-primary-300 transition-colors">Nhắc nhở</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Quản lý gia đình</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Bản đồ y tế</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Tư vấn</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Hỗ trợ</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-primary-300 transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Báo lỗi</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Công ty</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-primary-300 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-primary-300 transition-colors">Báo chí</a></li>
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-secondary-800 mt-8 pt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap items-center space-x-6 text-sm text-secondary-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary-400" />
                  <span>Chứng nhận ISO 27001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-primary-400" />
                  <span>Tuân thủ GDPR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-400" />
                  <span>10,000+ gia đình tin tưởng</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-secondary-400">
                <span>Tự hào sản xuất tại Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-secondary-800 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 CareNest. Tất cả quyền được bảo lưu.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
