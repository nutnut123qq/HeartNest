'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, Mail, Star, CheckCircle, Users, Calendar, Award, Languages } from 'lucide-react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HealthcareProvider, ProviderReview } from '@/types'
import { healthcareApiService } from '@/services/healthcareApi'
import { StartConsultationButton } from '@/components/chat/StartConsultationButton'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProviderDetailPage() {
  const params = useParams()
  const providerId = params?.id as string
  
  const [provider, setProvider] = useState<HealthcareProvider | null>(null)
  const [reviews, setReviews] = useState<ProviderReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (providerId) {
      loadProviderData()
    }
  }, [providerId])

  const loadProviderData = async () => {
    setLoading(true)
    try {
      const [providerResponse, reviewsResponse] = await Promise.all([
        healthcareApiService.providers.getWithFacilities(providerId),
        healthcareApiService.reviews.getProviderReviews(providerId, 1, 10)
      ])

      if (providerResponse.success) {
        setProvider(providerResponse.data)
      } else {
        toast.error('Không tìm thấy bác sĩ')
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin bác sĩ...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Không tìm thấy bác sĩ</p>
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
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={provider.profileImage} />
              <AvatarFallback className="text-2xl">
                {provider.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{provider.fullName}</h1>
                {provider.isVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium">{provider.title}</span>
                  <Badge variant="outline" className="ml-3">
                    {provider.specializationDisplay}
                  </Badge>
                </div>
                
                {provider.subSpecialty && (
                  <div className="text-sm">
                    Chuyên sâu: {provider.subSpecialty}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {provider.yearsOfExperience} năm kinh nghiệm
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {provider.phone}
                  </div>
                  
                  {provider.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {provider.email}
                    </div>
                  )}
                </div>
                
                {provider.acceptsNewPatients && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Users className="w-3 h-3 mr-1" />
                    Nhận bệnh nhân mới
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 space-y-4">
            <Card className="w-full md:w-64">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(provider.averageRating)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {provider.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {provider.reviewCount} đánh giá
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Button */}
            {provider.acceptsNewPatients && (
              <div className="w-full md:w-64">
                <StartConsultationButton
                  providerId={provider.id}
                  providerName={provider.fullName}
                  consultationFee={provider.consultationFees?.['Tư vấn trực tuyến'] || provider.consultationFees?.['Khám tổng quát']}
                  className="w-full"
                  size="lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="qualifications">Bằng cấp</TabsTrigger>
          <TabsTrigger value="facilities">Cơ sở</TabsTrigger>
          <TabsTrigger value="fees">Phí khám</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tiểu sử</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {provider.biography}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Languages className="w-5 h-5 mr-2" />
                    Ngôn ngữ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Lịch khám
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(provider.availability).map(([day, times]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium">{day}:</span>
                        <span className="text-gray-600">
                          {Array.isArray(times) ? times.join(', ') : times}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qualifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bằng cấp & Chứng chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {provider.qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mr-3" />
                    <span>{qualification}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provider.facilities?.map((facility) => (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/healthcare/facilities/${facility.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {facility.name}
                      {facility.isVerified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Đã xác thực
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{facility.typeDisplay}</CardDescription>
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
                          <span className="text-sm text-gray-600 ml-1">
                            {facility.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {facility.reviewCount} đánh giá
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Phí khám bệnh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(provider.consultationFees).map(([service, fee]) => (
                  <div key={service} className="p-4 border rounded-lg">
                    <div className="font-medium text-gray-900 mb-1">{service}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(fee)}
                    </div>
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
                        <div className="text-right">
                          {review.isVerified && (
                            <Badge variant="outline" className="text-green-600 border-green-600 mb-1">
                              Đã xác thực
                            </Badge>
                          )}
                          {review.wouldRecommend && (
                            <div className="text-sm text-green-600">
                              ✓ Sẽ giới thiệu
                            </div>
                          )}
                        </div>
                      </div>
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      {review.treatmentType && (
                        <div className="text-sm text-gray-600">
                          Loại điều trị: {review.treatmentType}
                        </div>
                      )}
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
