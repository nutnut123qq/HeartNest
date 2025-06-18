'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

interface FAQProps {
  className?: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Tôi có thể thay đổi gói dịch vụ bất cứ lúc nào không?',
    answer: 'Có, bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào. Khi nâng cấp, bạn sẽ được tính phí theo tỷ lệ thời gian còn lại. Khi hạ cấp, số tiền thừa sẽ được hoàn lại vào tài khoản của bạn.',
    category: 'billing'
  },
  {
    id: '2',
    question: 'Có được hoàn tiền nếu không hài lòng không?',
    answer: 'Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ. Sau thời gian này, bạn có thể hủy gói và không bị tính phí cho chu kỳ tiếp theo.',
    category: 'billing'
  },
  {
    id: '3',
    question: 'Dữ liệu của tôi có được bảo mật không?',
    answer: 'Tất cả dữ liệu được mã hóa AES-256 và bảo mật theo tiêu chuẩn quốc tế ISO 27001. Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ ba và tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu.',
    category: 'security'
  },
  {
    id: '4',
    question: 'Tôi có thể sử dụng trên nhiều thiết bị không?',
    answer: 'Có, bạn có thể đăng nhập và sử dụng CareNest trên nhiều thiết bị khác nhau với cùng một tài khoản. Dữ liệu sẽ được đồng bộ tự động giữa các thiết bị.',
    category: 'usage'
  },
  {
    id: '5',
    question: 'Làm thế nào để thêm thành viên gia đình?',
    answer: 'Bạn có thể mời thành viên gia đình thông qua email hoặc số điện thoại trong phần "Quản lý gia đình". Số lượng thành viên tối đa phụ thuộc vào gói dịch vụ bạn đang sử dụng.',
    category: 'usage'
  },
  {
    id: '6',
    question: 'Tôi có thể tùy chỉnh thông báo nhắc nhở không?',
    answer: 'Có, bạn có thể tùy chỉnh thời gian, tần suất, và kênh thông báo cho từng loại nhắc nhở. Các gói cao cấp hỗ trợ nhiều kênh thông báo hơn như push notification và SMS.',
    category: 'features'
  },
  {
    id: '7',
    question: 'Có hỗ trợ khách hàng 24/7 không?',
    answer: 'Gói Custom có hỗ trợ 24/7. Các gói khác có hỗ trợ trong giờ hành chính (8:00 - 17:00, thứ 2 - thứ 6). Gói Love Package có hỗ trợ ưu tiên với thời gian phản hồi nhanh hơn.',
    category: 'support'
  },
  {
    id: '8',
    question: 'Tôi có thể xuất dữ liệu sức khỏe không?',
    answer: 'Có, bạn có thể xuất dữ liệu sức khỏe của mình dưới dạng PDF hoặc Excel. Tính năng này có sẵn cho tất cả các gói dịch vụ.',
    category: 'features'
  }
]

export const FAQ: React.FC<FAQProps> = ({ className }) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const categories = [
    { id: 'billing', name: 'Thanh toán & Gói dịch vụ', icon: '💳' },
    { id: 'security', name: 'Bảo mật & Quyền riêng tư', icon: '🔒' },
    { id: 'usage', name: 'Sử dụng & Quản lý', icon: '⚙️' },
    { id: 'features', name: 'Tính năng', icon: '✨' },
    { id: 'support', name: 'Hỗ trợ', icon: '🎧' }
  ]

  return (
    <div className={cn('bg-gradient-to-br from-primary-50 to-care-50 rounded-3xl p-8', className)}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-soft mb-4">
          <HelpCircle className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">Hỗ trợ khách hàng</span>
        </div>
        
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          Câu hỏi thường gặp
        </h2>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Những thắc mắc phổ biến về gói dịch vụ CareNest. Không tìm thấy câu trả lời? 
          Hãy liên hệ với chúng tôi để được hỗ trợ.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => {
          const categoryItems = faqData.filter(item => item.category === category.id)
          return (
            <div
              key={category.id}
              className="bg-white px-4 py-2 rounded-full shadow-soft border border-secondary-200"
            >
              <span className="text-sm font-medium text-secondary-700">
                {category.icon} {category.name} ({categoryItems.length})
              </span>
            </div>
          )
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item) => {
          const isOpen = openItems.includes(item.id)
          const category = categories.find(cat => cat.id === item.category)
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-soft border border-secondary-100 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left hover:bg-secondary-25 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {category && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          {category.icon} {category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-secondary-900 text-left">
                      {item.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    )}
                  </div>
                </div>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-4">
                  <div className="border-t border-secondary-100 pt-4">
                    <p className="text-secondary-600 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Contact support */}
      <div className="mt-8 text-center">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-100">
          <h3 className="font-semibold text-secondary-900 mb-2">
            Vẫn có thắc mắc?
          </h3>
          <p className="text-secondary-600 text-sm mb-4">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@carenest.vn"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              📧 Email hỗ trợ
            </a>
            <a
              href="tel:1900123456"
              className="inline-flex items-center justify-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-colors text-sm font-medium"
            >
              📞 Hotline: 1900 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
