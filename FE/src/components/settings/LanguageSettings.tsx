'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Globe, 
  Calendar, 
  DollarSign,
  Clock,
  Check,
  Download,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  progress: number
  isDownloaded: boolean
  isDownloading: boolean
}

interface RegionSetting {
  id: string
  name: string
  value: string
  options: { value: string; label: string }[]
}

export const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [languages, setLanguages] = useState<Language[]>([
    {
      code: 'vi',
      name: 'Tiếng Việt',
      nativeName: 'Tiếng Việt',
      flag: '🇻🇳',
      progress: 100,
      isDownloaded: true,
      isDownloading: false
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      progress: 100,
      isDownloaded: true,
      isDownloading: false
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      progress: 85,
      isDownloaded: false,
      isDownloading: false
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      progress: 75,
      isDownloaded: false,
      isDownloading: false
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      progress: 60,
      isDownloaded: false,
      isDownloading: false
    },
    {
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย',
      flag: '🇹🇭',
      progress: 45,
      isDownloaded: false,
      isDownloading: false
    }
  ])

  const [regionSettings, setRegionSettings] = useState<RegionSetting[]>([
    {
      id: 'dateFormat',
      name: 'Định dạng ngày',
      value: 'dd/mm/yyyy',
      options: [
        { value: 'dd/mm/yyyy', label: '31/12/2024' },
        { value: 'mm/dd/yyyy', label: '12/31/2024' },
        { value: 'yyyy-mm-dd', label: '2024-12-31' },
        { value: 'dd-mm-yyyy', label: '31-12-2024' }
      ]
    },
    {
      id: 'timeFormat',
      name: 'Định dạng giờ',
      value: '24h',
      options: [
        { value: '24h', label: '23:59' },
        { value: '12h', label: '11:59 PM' }
      ]
    },
    {
      id: 'currency',
      name: 'Tiền tệ',
      value: 'VND',
      options: [
        { value: 'VND', label: 'Việt Nam Đồng (₫)' },
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'JPY', label: 'Japanese Yen (¥)' }
      ]
    },
    {
      id: 'numberFormat',
      name: 'Định dạng số',
      value: 'comma',
      options: [
        { value: 'comma', label: '1,234,567.89' },
        { value: 'dot', label: '1.234.567,89' },
        { value: 'space', label: '1 234 567.89' }
      ]
    }
  ])

  const downloadLanguage = async (languageCode: string) => {
    setLanguages(prev => prev.map(lang => 
      lang.code === languageCode 
        ? { ...lang, isDownloading: true }
        : lang
    ))

    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLanguages(prev => prev.map(lang => 
      lang.code === languageCode 
        ? { ...lang, isDownloading: false, isDownloaded: true }
        : lang
    ))

    toast.success(`Đã tải xuống gói ngôn ngữ ${languages.find(l => l.code === languageCode)?.name}`)
  }

  const updateRegionSetting = (settingId: string, value: string) => {
    setRegionSettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, value } : setting
    ))
  }

  const saveSettings = () => {
    localStorage.setItem('carenest_language', selectedLanguage)
    localStorage.setItem('carenest_region_settings', JSON.stringify(regionSettings))
    toast.success('Cài đặt ngôn ngữ đã được lưu!')
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-success-500'
    if (progress >= 70) return 'bg-care-500'
    return 'bg-secondary-400'
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Ngôn ngữ giao diện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {languages.map((language) => (
              <div
                key={language.code}
                className={cn(
                  'flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300',
                  selectedLanguage === language.code
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                )}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => language.isDownloaded && setSelectedLanguage(language.code)}
                    disabled={!language.isDownloaded}
                    className="flex items-center gap-3"
                  >
                    <span className="text-2xl">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-medium text-secondary-900">
                        {language.name}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {language.nativeName}
                      </div>
                    </div>
                  </button>
                  
                  {selectedLanguage === language.code && (
                    <Check className="h-5 w-5 text-primary-600" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full transition-all duration-300', getProgressColor(language.progress))}
                        style={{ width: `${language.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-secondary-600 w-10">
                      {language.progress}%
                    </span>
                  </div>

                  {/* Download Button */}
                  {!language.isDownloaded && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadLanguage(language.code)}
                      disabled={language.isDownloading}
                      leftIcon={
                        language.isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )
                      }
                    >
                      {language.isDownloading ? 'Đang tải...' : 'Tải xuống'}
                    </Button>
                  )}

                  {language.isDownloaded && language.code !== 'vi' && language.code !== 'en' && (
                    <span className="text-sm text-success-600 font-medium">
                      Đã tải
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
            <div className="text-sm text-secondary-600">
              <strong>Lưu ý:</strong> Một số ngôn ngữ có thể chưa được dịch hoàn chỉnh. 
              Chúng tôi đang liên tục cập nhật để cải thiện chất lượng dịch thuật.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cài đặt khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {regionSettings.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <label className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                {setting.id === 'dateFormat' && <Calendar className="h-4 w-4" />}
                {setting.id === 'timeFormat' && <Clock className="h-4 w-4" />}
                {setting.id === 'currency' && <DollarSign className="h-4 w-4" />}
                {setting.id === 'numberFormat' && <Globe className="h-4 w-4" />}
                {setting.name}
              </label>
              <select
                value={setting.value}
                onChange={(e) => updateRegionSetting(setting.id, e.target.value)}
                className="w-full h-11 px-3 py-2 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {setting.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Xem trước định dạng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary-50 rounded-xl">
              <div className="text-sm font-medium text-secondary-700 mb-2">Ngày giờ</div>
              <div className="text-secondary-900">
                {regionSettings.find(s => s.id === 'dateFormat')?.value === 'dd/mm/yyyy' && '31/12/2024'}
                {regionSettings.find(s => s.id === 'dateFormat')?.value === 'mm/dd/yyyy' && '12/31/2024'}
                {regionSettings.find(s => s.id === 'dateFormat')?.value === 'yyyy-mm-dd' && '2024-12-31'}
                {regionSettings.find(s => s.id === 'dateFormat')?.value === 'dd-mm-yyyy' && '31-12-2024'}
                {' '}
                {regionSettings.find(s => s.id === 'timeFormat')?.value === '24h' ? '14:30' : '2:30 PM'}
              </div>
            </div>

            <div className="p-4 bg-secondary-50 rounded-xl">
              <div className="text-sm font-medium text-secondary-700 mb-2">Số và tiền tệ</div>
              <div className="text-secondary-900">
                {(() => {
                  const numberFormat = regionSettings.find(s => s.id === 'numberFormat')?.value
                  const currency = regionSettings.find(s => s.id === 'currency')?.value
                  const currencySymbol = currency === 'VND' ? '₫' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '¥'
                  
                  let formattedNumber = '1234567'
                  if (numberFormat === 'comma') formattedNumber = '1,234,567'
                  else if (numberFormat === 'dot') formattedNumber = '1.234.567'
                  else if (numberFormat === 'space') formattedNumber = '1 234 567'
                  
                  return currency === 'VND' ? `${formattedNumber}${currencySymbol}` : `${currencySymbol}${formattedNumber}`
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Contribution */}
      <Card>
        <CardHeader>
          <CardTitle>Đóng góp dịch thuật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <div className="font-medium text-primary-900 mb-1">
                  Giúp cải thiện bản dịch
                </div>
                <div className="text-sm text-primary-700 mb-3">
                  Bạn có thể đóng góp để cải thiện chất lượng dịch thuật cho cộng đồng CareNest.
                </div>
                <Button variant="outline" size="sm">
                  Tham gia dịch thuật
                </Button>
              </div>
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
