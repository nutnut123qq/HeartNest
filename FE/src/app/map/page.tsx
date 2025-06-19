'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Star,
  Phone,
  Clock,
  Stethoscope,
  Building2,
  Heart,
  Pill,
  Activity,
  Users,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { healthcareApiService } from '@/services/healthcareApi'
import { toast } from 'react-hot-toast'
import { MapView } from '@/components/map/MapView'

interface HealthcareFacility {
  id: string
  name: string
  type: string
  address: string
  phone?: string
  rating: number
  reviewCount: number
  distance?: number
  latitude: number
  longitude: number
  isOpen?: boolean
  openingHours?: string
  description?: string
}

const FACILITY_TYPES = [
  { id: 'all', name: 'Tất cả', icon: Building2 },
  { id: 'hospital', name: 'Bệnh viện', icon: Building2 },
  { id: 'clinic', name: 'Phòng khám', icon: Stethoscope },
  { id: 'pharmacy', name: 'Nhà thuốc', icon: Pill },
  { id: 'dental', name: 'Nha khoa', icon: Heart },
  { id: 'laboratory', name: 'Xét nghiệm', icon: Activity }
]

const HealthcareMapPage = () => {
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<HealthcareFacility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Get user location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          loadNearbyFacilities(location.lat, location.lng)
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Không thể lấy vị trí hiện tại')
          // Default to Quy Nhon City
          const defaultLocation = { lat: 13.7563, lng: 109.2297 }
          setUserLocation(defaultLocation)
          loadNearbyFacilities(defaultLocation.lat, defaultLocation.lng)
        }
      )
    } else {
      toast.error('Trình duyệt không hỗ trợ định vị')
      const defaultLocation = { lat: 13.7563, lng: 109.2297 }
      setUserLocation(defaultLocation)
      loadNearbyFacilities(defaultLocation.lat, defaultLocation.lng)
    }
  }, [])

  // Load nearby facilities
  const loadNearbyFacilities = async (lat: number, lng: number, radius: number = 10) => {
    setLoading(true)
    try {
      // Mock data for Quy Nhon city - replace with real API call later
      const mockFacilities: HealthcareFacility[] = [
        {
          id: '1',
          name: 'Bệnh viện Đa khoa tỉnh Bình Định',
          type: 'hospital',
          address: '374 Hùng Vương, TP. Quy Nhơn, Bình Định',
          phone: '0256 3822 074',
          rating: 4.1,
          reviewCount: 850,
          latitude: 13.7563,
          longitude: 109.2297,
          isOpen: true
        },
        {
          id: '2',
          name: 'Bệnh viện Đa khoa Quy Nhơn',
          type: 'hospital',
          address: '374 Nguyễn Huệ, TP. Quy Nhơn, Bình Định',
          phone: '0256 3821 333',
          rating: 4.0,
          reviewCount: 620,
          latitude: 13.7612,
          longitude: 109.2285,
          isOpen: true
        },
        {
          id: '3',
          name: 'Phòng khám Đa khoa An Khang',
          type: 'clinic',
          address: '123 Lê Lợi, TP. Quy Nhơn, Bình Định',
          phone: '0256 3825 678',
          rating: 4.3,
          reviewCount: 340,
          latitude: 13.7598,
          longitude: 109.2312,
          isOpen: true
        },
        {
          id: '4',
          name: 'Nhà thuốc Pharmacity Quy Nhơn',
          type: 'pharmacy',
          address: '456 Trần Hưng Đạo, TP. Quy Nhơn, Bình Định',
          phone: '1800 6821',
          rating: 4.2,
          reviewCount: 280,
          latitude: 13.7634,
          longitude: 109.2268,
          isOpen: false
        },
        {
          id: '5',
          name: 'Bệnh viện Mắt Quy Nhơn',
          type: 'hospital',
          address: '789 Ngô Mây, TP. Quy Nhơn, Bình Định',
          phone: '0256 3827 456',
          rating: 4.4,
          reviewCount: 190,
          latitude: 13.7545,
          longitude: 109.2325,
          isOpen: true
        },
        {
          id: '6',
          name: 'Phòng khám Nha khoa Smile',
          type: 'dental',
          address: '321 Lý Thường Kiệt, TP. Quy Nhơn, Bình Định',
          phone: '0256 3829 123',
          rating: 4.5,
          reviewCount: 150,
          latitude: 13.7578,
          longitude: 109.2341,
          isOpen: true
        }
      ]

      setFacilities(mockFacilities)
      setFilteredFacilities(mockFacilities)

      // Uncomment this for real API call:
      // const response = await healthcareApiService.facilities.getNearby(lat, lng, radius)
      // if (response.success) {
      //   setFacilities(response.data)
      //   setFilteredFacilities(response.data)
      // }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Filter facilities
  useEffect(() => {
    let filtered = facilities

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(facility => facility.type === selectedType)
    }

    setFilteredFacilities(filtered)
  }, [facilities, searchTerm, selectedType])

  // Initialize map and location
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  const handleSearch = () => {
    if (userLocation) {
      loadNearbyFacilities(userLocation.lat, userLocation.lng)
    }
  }

  const getFacilityIcon = (type: string) => {
    const facilityType = FACILITY_TYPES.find(t => t.id === type)
    return facilityType?.icon || Building2
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ))
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-secondary-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-600" />
                Bản đồ y tế
              </h1>
              <p className="text-secondary-600 mt-1">
                Tìm kiếm cơ sở y tế gần bạn
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Tìm kiếm cơ sở y tế..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="w-full sm:w-80"
                />
                <Button onClick={handleSearch} loading={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                rightIcon={<ChevronDown className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')} />}
              >
                <Filter className="h-4 w-4" />
                Lọc
              </Button>

              <Button
                variant="outline"
                onClick={getUserLocation}
                leftIcon={<Navigation className="h-4 w-4" />}
              >
                Vị trí của tôi
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
              <div className="flex flex-wrap gap-2">
                {FACILITY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedType === type.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-secondary-700 hover:bg-secondary-100'
                    )}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar - Facility List */}
          <div className="w-full lg:w-96 bg-white border-r border-secondary-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-secondary-900">
                  Kết quả ({filteredFacilities.length})
                </h2>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
              </div>

              <div className="space-y-3">
                {filteredFacilities.map((facility) => {
                  const FacilityIcon = getFacilityIcon(facility.type)

                  return (
                    <Card
                      key={facility.id}
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-md',
                        selectedFacility?.id === facility.id && 'ring-2 ring-primary-500 shadow-md'
                      )}
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FacilityIcon className="h-5 w-5 text-primary-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-secondary-900 truncate">
                              {facility.name}
                            </h3>

                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(facility.rating)}
                              <span className="text-sm text-secondary-600 ml-1">
                                ({facility.reviewCount})
                              </span>
                            </div>

                            <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                              {facility.address}
                            </p>

                            <div className="flex items-center gap-4 mt-2 text-xs text-secondary-500">
                              {facility.distance && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {facility.distance.toFixed(1)} km
                                </span>
                              )}

                              {facility.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {facility.phone}
                                </span>
                              )}

                              <span className={cn(
                                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                facility.isOpen
                                  ? 'bg-success-100 text-success-700'
                                  : 'bg-secondary-100 text-secondary-600'
                              )}>
                                <Clock className="h-3 w-3" />
                                {facility.isOpen ? 'Đang mở' : 'Đã đóng'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {!loading && filteredFacilities.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-600">Không tìm thấy cơ sở y tế nào</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <MapView
              facilities={filteredFacilities}
              center={userLocation ? [userLocation.lat, userLocation.lng] : [13.7563, 109.2297]}
              zoom={13}
              onFacilitySelect={setSelectedFacility}
              selectedFacility={selectedFacility}
              userLocation={userLocation ? [userLocation.lat, userLocation.lng] : null}
            />

            {/* Selected Facility Info */}
            {selectedFacility && (
              <div className="absolute top-4 right-4 w-80 z-10">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary-600" />
                      {selectedFacility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFacility.rating)}
                        <span className="text-sm text-secondary-600 ml-1">
                          ({selectedFacility.reviewCount} đánh giá)
                        </span>
                      </div>

                      <p className="text-sm text-secondary-600">
                        {selectedFacility.address}
                      </p>

                      {selectedFacility.description && (
                        <p className="text-sm text-secondary-700">
                          {selectedFacility.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Gọi điện
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          Chỉ đường
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HealthcareMapPage
