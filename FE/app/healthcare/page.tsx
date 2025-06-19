'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Filter, Hospital, Stethoscope, Pill, TestTube, Ambulance, Building2 } from 'lucide-react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HealthcareFacilitySummary, HealthcareProviderSummary, HealthcareFacilityType, ProviderSpecialization } from '@/types'
import { healthcareApiService } from '@/services/healthcareApi'
import { toast } from 'sonner'
import Link from 'next/link'

const facilityTypeIcons = {
  [HealthcareFacilityType.Hospital]: Hospital,
  [HealthcareFacilityType.Clinic]: Building2,
  [HealthcareFacilityType.Pharmacy]: Pill,
  [HealthcareFacilityType.Laboratory]: TestTube,
  [HealthcareFacilityType.Emergency]: Ambulance,
  [HealthcareFacilityType.SpecialtyCenter]: Stethoscope
}

const facilityTypeLabels = {
  [HealthcareFacilityType.Hospital]: 'Bệnh viện',
  [HealthcareFacilityType.Clinic]: 'Phòng khám',
  [HealthcareFacilityType.Pharmacy]: 'Nhà thuốc',
  [HealthcareFacilityType.Laboratory]: 'Phòng xét nghiệm',
  [HealthcareFacilityType.Emergency]: 'Cấp cứu',
  [HealthcareFacilityType.SpecialtyCenter]: 'Trung tâm chuyên khoa'
}

export default function HealthcarePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<HealthcareFacilityType | ''>('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<ProviderSpecialization | ''>('')
  const [facilities, setFacilities] = useState<HealthcareFacilitySummary[]>([])
  const [providers, setProviders] = useState<HealthcareProviderSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('facilities')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {

      const [facilitiesResponse, providersResponse] = await Promise.all([
        healthcareApiService.facilities.getAll(),
        healthcareApiService.providers.getAll()
      ])

      if (facilitiesResponse.success) {
        setFacilities(facilitiesResponse.data)
      }

      if (providersResponse.success) {
        setProviders(providersResponse.data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      if (activeTab === 'facilities') {
        const response = await healthcareApiService.facilities.search({
          searchTerm: searchTerm || undefined,
          type: selectedType || undefined
        })
        
        if (response.success) {
          setFacilities(response.data)
        }
      } else {
        const response = await healthcareApiService.providers.search({
          searchTerm: searchTerm || undefined,
          specialization: selectedSpecialization || undefined
        })
        
        if (response.success) {
          setProviders(response.data)
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tìm kiếm')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const FacilityCard = ({ facility }: { facility: HealthcareFacilitySummary }) => {
    const IconComponent = facilityTypeIcons[facility.type]
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <Link href={`/healthcare/facilities/${facility.id}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{facility.typeDisplay}</span>
                    {facility.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {facility.address}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {renderStars(facility.averageRating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {facility.averageRating.toFixed(1)} ({facility.reviewCount} đánh giá)
                  </span>
                </div>
                {facility.distanceKm && (
                  <span className="text-sm text-gray-500">
                    {facility.distanceKm.toFixed(1)} km
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  const ProviderCard = ({ provider }: { provider: HealthcareProviderSummary }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <Link href={`/healthcare/providers/${provider.id}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {provider.profileImage ? (
                  <img 
                    src={provider.profileImage} 
                    alt={provider.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <Stethoscope className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{provider.fullName}</CardTitle>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{provider.title}</div>
                  <div className="flex items-center space-x-2">
                    <span>{provider.specializationDisplay}</span>
                    {provider.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {provider.yearsOfExperience} năm kinh nghiệm
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {renderStars(provider.averageRating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {provider.averageRating.toFixed(1)} ({provider.reviewCount} đánh giá)
                  </span>
                </div>
                {provider.acceptsNewPatients && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Nhận bệnh nhân mới
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thư viện Y tế CareNest
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tìm kiếm cơ sở y tế và bác sĩ uy tín gần bạn. Đọc đánh giá từ cộng đồng để đưa ra lựa chọn tốt nhất cho sức khỏe gia đình.
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm cơ sở y tế hoặc bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {activeTab === 'facilities' ? (
              <Select value={selectedType === '' ? 'all' : selectedType.toString()} onValueChange={(value) => setSelectedType(value === 'all' ? '' : parseInt(value) as HealthcareFacilityType)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  {Object.entries(facilityTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedSpecialization === '' ? 'all' : selectedSpecialization.toString()} onValueChange={(value) => setSelectedSpecialization(value === 'all' ? '' : parseInt(value) as ProviderSpecialization)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                  <SelectItem value="0">Bác sĩ đa khoa</SelectItem>
                  <SelectItem value="1">Tim mạch</SelectItem>
                  <SelectItem value="2">Da liễu</SelectItem>
                  <SelectItem value="8">Nhi khoa</SelectItem>
                  <SelectItem value="13">Phụ khoa</SelectItem>
                  {/* Add more specializations as needed */}
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="facilities">Cơ sở Y tế</TabsTrigger>
          <TabsTrigger value="providers">Bác sĩ</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Không có cơ sở y tế nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Không có bác sĩ nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}
