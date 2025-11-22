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
      name: 'Emergency Event Selector',
      description: 'Select an emergency event to trigger',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'crime-surge',
      name: 'Crime Surge',
      description: 'Crime rate rises sharply, insufficient police force',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'community-event',
      name: 'Community Event',
      description: 'Community protests or gatherings',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'police-event',
      name: 'Police Event',
      description: 'Police strike or equipment failure',
      icon: Shield,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'ai-dataset',
      name: 'AI Dataset',
      description: 'Select AI training dataset',
      icon: Brain,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'system-event',
      name: 'System Event',
      description: 'System maintenance or upgrade',
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
          title={isOpen ? "Close Event Panel" : "Open Event Panel"}
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
              Event Panel
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
                Click event type to trigger corresponding event
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
