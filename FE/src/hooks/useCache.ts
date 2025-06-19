'use client'

import { useState, useEffect, useCallback } from 'react'

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  key: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>()

export function useCache<T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { key, ttl = 5 * 60 * 1000 } = options // Default 5 minutes

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      if (!forceRefresh) {
        const cached = cache.get(key)
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setData(cached.data)
          setLoading(false)
          return cached.data
        }
      }

      // Fetch fresh data
      const result = await fetchFn()
      
      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: Date.now(),
        ttl
      })

      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFn, key, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(key)
  }, [key])

  return {
    data,
    loading,
    error,
    refresh,
    clearCache
  }
}

// Clear all cache
export const clearAllCache = () => {
  cache.clear()
}

// Clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp >= entry.ttl) {
      cache.delete(key)
    }
  }
}
