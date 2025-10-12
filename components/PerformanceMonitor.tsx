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
          console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms')
        }
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}:`, entry.startTime, 'ms')
        }
      }
    })

    observer.observe({ entryTypes: ['navigation', 'paint'] })

    // 监控长任务
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long Task detected:', entry.duration, 'ms')
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
