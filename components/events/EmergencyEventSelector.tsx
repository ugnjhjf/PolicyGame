'use client'

import { useState } from 'react'
import { AlertTriangle, Users, Shield, Brain, Settings, X, Megaphone } from 'lucide-react'
import styles from '../../styles/animations.module.css'

interface EmergencyEvent {
  id: string
  name: string
  description: string
  icon: any
  color: string
  hoverColor: string
  status: 'available' | 'locked' | 'completed'
  requirements?: {
    level?: number
    previousEvents?: string[]
    resources?: {
      resources?: number
    }
  }
}

interface EmergencyEventSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectEvent: (eventId: string) => void
}

export default function EmergencyEventSelector({ isOpen, onClose, onSelectEvent }: EmergencyEventSelectorProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  // 紧急事件列表 - 每次添加新事件时在这里添加
  const emergencyEvents: EmergencyEvent[] = [
    {
      id: 'crime-surge',
      name: 'Crime Surge',
      description: 'Crime rate rises sharply, severe police shortage, immediate action required',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      status: 'available'
    },
    {
      id: 'community-protest',
      name: 'Community Protest',
      description: 'Community residents organize large-scale protests due to policy dissatisfaction',
      icon: Megaphone,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      status: 'available'
    },
    {
      id: 'police-strike',
      name: 'Police Strike',
      description: 'Police union announces strike due to salary issues, police force completely paralyzed',
      icon: Shield,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      status: 'locked',
      requirements: {
        level: 3,
        previousEvents: ['crime-surge', 'community-protest']
      }
    },
    {
      id: 'ai-system-failure',
      name: 'AI System Failure',
      description: 'AI prediction system experiences critical failure, unable to provide accurate crime predictions',
      icon: Brain,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      status: 'locked',
      requirements: {
        level: 4,
        resources: {
          resources: 10
        }
      }
    },
    {
      id: 'cyber-attack',
      name: 'Cyber Attack',
      description: 'City management system suffers large-scale cyber attack, data security threatened',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      status: 'locked',
      requirements: {
        level: 5,
        previousEvents: ['ai-system-failure']
      }
    }
  ]

  const handleEventSelect = (eventId: string) => {
    const event = emergencyEvents.find(e => e.id === eventId)
    if (event && event.status === 'available') {
      setSelectedEvent(eventId)
    }
  }

  const handleConfirm = () => {
    if (selectedEvent) {
      onSelectEvent(selectedEvent)
      setSelectedEvent(null)
      onClose()
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available'
      case 'locked': return 'Locked'
      case 'completed': return 'Completed'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'locked': return 'text-gray-600 bg-gray-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 选择器弹窗 */}
      <div className={`relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto ${styles.gpuAccelerated}`}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 弹窗内容 */}
        <div className="p-6">
          {/* 标题 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Emergency Event Selector
            </h2>
            <p className="text-gray-600">Select an emergency event to trigger, different events have different unlock conditions and effects</p>
          </div>

          {/* 事件列表 */}
          <div className="space-y-3 mb-6">
            {emergencyEvents.map((event) => {
              const IconComponent = event.icon
              const isSelected = selectedEvent === event.id
              const isDisabled = event.status !== 'available'
              
              return (
                <div
                  key={event.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => !isDisabled && handleEventSelect(event.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* 选中状态 */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    )}

                    {/* 事件图标 */}
                    <div className={`p-2 rounded-lg ${event.color} text-white flex-shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* 事件信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        {/* 状态标签 */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      
                      {/* 解锁条件 */}
                      {event.requirements && (
                        <div className="text-xs text-gray-500 space-y-1">
                          {event.requirements.level && (
                            <div>Required Level: {event.requirements.level}</div>
                          )}
                          {event.requirements.previousEvents && event.requirements.previousEvents.length > 0 && (
                            <div>Prerequisites: {event.requirements.previousEvents.join(', ')}</div>
                          )}
                          {event.requirements.resources && (
                            <div>
                              {event.requirements.resources.resources && `Required Resources: ${event.requirements.resources.resources}`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 确认按钮 */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!selectedEvent}
              className={`px-8 py-3 font-medium rounded-lg transition-all duration-200 ${
                selectedEvent
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedEvent ? 'Trigger Selected Event' : 'Please Select an Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
