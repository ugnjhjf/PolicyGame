'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // 只在开发环境启用性能监控
    if (process.env.NODE_ENV !== 'development') return

    // 监控页面加载性能
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
        }
        if (entry.entryType === 'paint') {
        }
      }
    })

    observer.observe({ entryTypes: ['navigation', 'paint'] })

    // 监控长任务
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
        }
      }
    })

    longTaskObserver.observe({ entryTypes: ['longtask'] })

    return () => {
      observer.disconnect()
      longTaskObserver.disconnect()
    }
  }, [])

  return null
}
