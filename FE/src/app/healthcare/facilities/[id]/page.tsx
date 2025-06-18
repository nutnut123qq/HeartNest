'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Clock, CheckCircle, Users, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HealthcareFacility, FacilityReview, HealthcareProviderSummary } from '@/types'
import { healthcareApiService } from '@/services/healthcareApi'
import { toast } from 'sonner'
import Link from 'next/link'

export default function FacilityDetailPage() {
  const params = useParams()
  const facilityId = params?.id as string
  
  const [facility, setFacility] = useState<HealthcareFacility | null>(null)
  const [reviews, setReviews] = useState<FacilityReview[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (facilityId) {
      loadFacilityData()
    }
  }, [facilityId])

  const loadFacilityData = async () => {
    setLoading(true)
    try {
      const [facilityResponse, reviewsResponse] = await Promise.all([
        healthcareApiService.facilities.getWithProviders(facilityId),
        healthcareApiService.reviews.getFacilityReviews(facilityId, 1, 10)
      ])

      if (facilityResponse.success) {
        setFacility(facilityResponse.data)
      } else {
        toast.error('Không tìm thấy cơ sở y tế')
      }

      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin cơ sở y tế...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!facility) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Không tìm thấy cơ sở y tế</p>
          <Link href="/healthcare">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Back Button */}
      <Link href="/healthcare">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{facility.name}</h1>
              {facility.isVerified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã xác thực
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-3">
                  {facility.typeDisplay}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {facility.address}
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {facility.phone}
              </div>
              
              {facility.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {facility.email}
                </div>
              )}
              
              {facility.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={facility.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {facility.website}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6">
            <Card className="w-full md:w-64">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(facility.averageRating)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {facility.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {facility.reviewCount} đánh giá
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="providers">Bác sĩ</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Giờ hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {facility.operatingHours.map((hours, index) => (
                      <div key={index} className="text-sm">
                        {hours}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facility.providers?.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/healthcare/providers/${provider.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={provider.profileImage} />
                        <AvatarFallback>
                          {provider.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{provider.fullName}</CardTitle>
                        <CardDescription>{provider.specializationDisplay}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {renderStars(provider.averageRating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {provider.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {provider.yearsOfExperience} năm KN
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dịch vụ y tế</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {facility.services.map((service, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback>
                        {review.userName?.split(' ').map(n => n[0]).join('') || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.userName || 'Ẩn danh'}</h4>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Đã xác thực
                          </Badge>
                        )}
                      </div>
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}
