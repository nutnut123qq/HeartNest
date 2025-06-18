'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Eye,
  Type,
  Layout,
  Zap,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

type Theme = 'light' | 'dark' | 'system'
type FontSize = 'small' | 'medium' | 'large'
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'pink'

const themes = [
  { id: 'light' as Theme, name: 'Sáng', icon: Sun, description: 'Giao diện sáng, dễ nhìn ban ngày' },
  { id: 'dark' as Theme, name: 'Tối', icon: Moon, description: 'Giao diện tối, bảo vệ mắt ban đêm' },
  { id: 'system' as Theme, name: 'Hệ thống', icon: Monitor, description: 'Tự động theo cài đặt hệ thống' }
]

const fontSizes = [
  { id: 'small' as FontSize, name: 'Nhỏ', size: 'text-sm', description: 'Phù hợp cho màn hình lớn' },
  { id: 'medium' as FontSize, name: 'Vừa', size: 'text-base', description: 'Kích thước tiêu chuẩn' },
  { id: 'large' as FontSize, name: 'Lớn', size: 'text-lg', description: 'Dễ đọc hơn cho người lớn tuổi' }
]

const colorSchemes = [
  { id: 'blue' as ColorScheme, name: 'Xanh dương', color: 'bg-blue-500', primary: 'from-blue-500 to-blue-600' },
  { id: 'green' as ColorScheme, name: 'Xanh lá', color: 'bg-green-500', primary: 'from-green-500 to-green-600' },
  { id: 'purple' as ColorScheme, name: 'Tím', color: 'bg-purple-500', primary: 'from-purple-500 to-purple-600' },
  { id: 'orange' as ColorScheme, name: 'Cam', color: 'bg-orange-500', primary: 'from-orange-500 to-orange-600' },
  { id: 'pink' as ColorScheme, name: 'Hồng', color: 'bg-pink-500', primary: 'from-pink-500 to-pink-600' }
]

export const AppearanceSettings: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light')
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>('medium')
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>('blue')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  const saveSettings = () => {
    // TODO: Implement save to localStorage and apply changes
    localStorage.setItem('carenest_theme', selectedTheme)
    localStorage.setItem('carenest_font_size', selectedFontSize)
    localStorage.setItem('carenest_color_scheme', selectedColorScheme)
    localStorage.setItem('carenest_reduced_motion', reducedMotion.toString())
    localStorage.setItem('carenest_compact_mode', compactMode.toString())
    
    toast.success('Cài đặt giao diện đã được lưu!')
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Chủ đề giao diện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  'p-4 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-md',
                  selectedTheme === theme.id
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-secondary-200 hover:border-primary-300'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    selectedTheme === theme.id ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                  )}>
                    <theme.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">{theme.name}</div>
                    {selectedTheme === theme.id && (
                      <Check className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-secondary-600">{theme.description}</p>
                
                {/* Theme Preview */}
                <div className="mt-3 p-3 bg-white border border-secondary-200 rounded-lg">
                  <div className={cn(
                    'h-2 rounded mb-2',
                    theme.id === 'light' ? 'bg-gray-200' :
                    theme.id === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-200 to-gray-700'
                  )} />
                  <div className={cn(
                    'h-1 rounded w-3/4',
                    theme.id === 'light' ? 'bg-gray-300' :
                    theme.id === 'dark' ? 'bg-gray-600' : 'bg-gradient-to-r from-gray-300 to-gray-600'
                  )} />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Bảng màu chủ đạo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedColorScheme(scheme.id)}
                className={cn(
                  'p-4 border-2 rounded-xl text-center transition-all duration-300',
                  selectedColorScheme === scheme.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-full mx-auto mb-2',
                  scheme.color
                )} />
                <div className="font-medium text-secondary-900 text-sm">{scheme.name}</div>
                {selectedColorScheme === scheme.id && (
                  <Check className="h-4 w-4 text-primary-600 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Kích thước chữ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fontSizes.map((fontSize) => (
              <button
                key={fontSize.id}
                onClick={() => setSelectedFontSize(fontSize.id)}
                className={cn(
                  'p-4 border-2 rounded-xl text-left transition-all duration-300',
                  selectedFontSize === fontSize.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-secondary-900">{fontSize.name}</div>
                  {selectedFontSize === fontSize.id && (
                    <Check className="h-4 w-4 text-primary-600" />
                  )}
                </div>
                <p className="text-sm text-secondary-600 mb-3">{fontSize.description}</p>
                <div className={cn('text-secondary-900', fontSize.size)}>
                  Văn bản mẫu với kích thước này
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Cài đặt nâng cao
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium text-secondary-900">Giảm hiệu ứng chuyển động</div>
                <div className="text-sm text-secondary-600">Tắt animations để cải thiện hiệu suất</div>
              </div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                reducedMotion ? 'bg-primary-600' : 'bg-secondary-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Layout className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium text-secondary-900">Chế độ thu gọn</div>
                <div className="text-sm text-secondary-600">Giảm khoảng cách giữa các phần tử</div>
              </div>
            </div>
            <button
              onClick={() => setCompactMode(!compactMode)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                compactMode ? 'bg-primary-600' : 'bg-secondary-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  compactMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Xem trước</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-secondary-200 rounded-xl bg-white">
            <div className={cn(
              'mb-4 font-semibold',
              selectedFontSize === 'small' ? 'text-lg' :
              selectedFontSize === 'medium' ? 'text-xl' : 'text-2xl'
            )}>
              Tiêu đề mẫu
            </div>
            <div className={cn(
              'text-secondary-600 mb-4',
              selectedFontSize === 'small' ? 'text-sm' :
              selectedFontSize === 'medium' ? 'text-base' : 'text-lg'
            )}>
              Đây là đoạn văn bản mẫu để bạn có thể xem trước giao diện với các cài đặt đã chọn.
            </div>
            <div className={cn(
              'inline-flex px-4 py-2 rounded-lg text-white bg-gradient-to-r',
              colorSchemes.find(s => s.id === selectedColorScheme)?.primary || 'from-blue-500 to-blue-600'
            )}>
              Nút mẫu
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Lưu cài đặt
        </Button>
      </div>
    </div>
  )
}
