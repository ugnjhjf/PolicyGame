'use client'

import { useEffect } from 'react'
import { Shield } from 'lucide-react'
import styles from '../styles/animations.module.css'

interface PoliceHQWelcomeProps {
  isOpen: boolean
  onComplete: () => void
}

export default function PoliceHQWelcome({ isOpen, onComplete }: PoliceHQWelcomeProps) {
  useEffect(() => {
    if (isOpen) {
      // 3秒后自动完成并跳转
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* 欢迎面板 - 从右边滑入，全屏显示 */}
      <div className={`w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 ${styles.slideInFromRight} ${styles.gpuAccelerated} shadow-2xl`}>
        <div className="h-full flex flex-col items-center justify-center p-8">
          {/* 图标 - 带脉冲圆圈动画 */}
          <div className="mb-8 relative">
            {/* 脉冲圆圈 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`absolute w-24 h-24 rounded-full border-2 border-blue-400 ${styles.pulseCircle1}`}></div>
              <div className={`absolute w-32 h-32 rounded-full border-2 border-indigo-400 ${styles.pulseCircle2}`}></div>
              <div className={`absolute w-40 h-40 rounded-full border-2 border-cyan-400 ${styles.pulseCircle3}`}></div>
            </div>
            {/* 图标容器 */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg z-10">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Welcome to Police HQ
          </h1>

          {/* 简介 */}
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-gray-700 mb-2">Brief Introduction:</p>
            <p className="text-base text-gray-600 leading-relaxed">
              The command center for police operations. Deploy police forces and manage law enforcement strategies here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

