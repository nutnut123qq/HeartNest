'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamic import để tránh SSR issues với Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface HealthcareFacility {
  id: string
  name: string
  type: string
  address: string
  phone?: string
  rating: number
  reviewCount: number
  latitude: number
  longitude: number
  isOpen?: boolean
}

interface MapViewProps {
  facilities: HealthcareFacility[]
  center: [number, number]
  zoom?: number
  onFacilitySelect?: (facility: HealthcareFacility) => void
  selectedFacility?: HealthcareFacility | null
  userLocation?: [number, number] | null
}

export const MapView: React.FC<MapViewProps> = ({
  facilities,
  center,
  zoom = 13,
  onFacilitySelect,
  selectedFacility,
  userLocation
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
          <p className="text-secondary-600">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Tile Layer - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <div className="font-medium text-primary-600">Vị trí của bạn</div>
                <div className="text-sm text-secondary-600 mt-1">
                  Bạn đang ở đây
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Facility Markers */}
        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            eventHandlers={{
              click: () => onFacilitySelect?.(facility)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-medium text-secondary-900 mb-2">
                  {facility.name}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="text-secondary-600">
                    📍 {facility.address}
                  </div>
                  
                  {facility.phone && (
                    <div className="text-secondary-600">
                      📞 {facility.phone}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-secondary-700">
                      {facility.rating} ({facility.reviewCount} đánh giá)
                    </span>
                  </div>
                  
                  {facility.isOpen !== undefined && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      facility.isOpen 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {facility.isOpen ? '🟢 Đang mở' : '🔴 Đã đóng'}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-secondary-200">
                  <button
                    onClick={() => onFacilitySelect?.(facility)}
                    className="w-full bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
