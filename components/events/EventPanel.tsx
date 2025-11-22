'use client'

import { useState } from 'react'
import { Calendar, AlertTriangle, Users, Shield, Brain, Settings } from 'lucide-react'
import styles from '../../styles/animations.module.css'

interface EventPanelProps {
  onTriggerEvent: (eventType: string) => void
}

export default function EventPanel({ onTriggerEvent }: EventPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const eventTypes = [
    {
      id: 'emergency-selector',
      name: '紧急事件选择器',
      description: '选择要触发的紧急事件',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'crime-surge',
      name: '犯罪激增',
      description: '犯罪率急剧上升，警力不足',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'community-event',
      name: '社区事件',
      description: '社区抗议或集会活动',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'police-event',
      name: '警力事件',
      description: '警察罢工或设备故障',
      icon: Shield,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'ai-dataset',
      name: 'AI数据集',
      description: '选择AI训练数据集',
      icon: Brain,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'system-event',
      name: '系统事件',
      description: '系统维护或升级',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ]

  const handleEventClick = (eventType: string) => {
    onTriggerEvent(eventType)
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-20 z-40">
      {/* 主按钮 */}
      <div className="flex flex-col items-end gap-2 mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title={isOpen ? "关闭事件面板" : "打开事件面板"}
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* 事件面板 */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl w-80 max-h-96 overflow-y-auto ${styles.gpuAccelerated}`}>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              事件面板
            </h3>
            
            <div className="space-y-2">
              {eventTypes.map((event) => {
                const IconComponent = event.icon
                return (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${event.color} ${event.hoverColor} text-white`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm opacity-90">{event.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                点击事件类型触发对应事件
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
