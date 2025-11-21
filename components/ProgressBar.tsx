'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface ProgressStep {
  id: string
  name: string
  completed: boolean
  current: boolean
}

interface ProgressBarProps {
  steps: ProgressStep[]
  className?: string
}

export default function ProgressBar({ steps, className = '' }: ProgressBarProps) {
  return (
    <div className={`bg-white border-b border-gray-200 py-4 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* 步骤圆圈 */}
              <div className="flex items-center justify-center">
                {step.completed ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : step.current ? (
                  <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-white fill-current" />
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              {/* 步骤名称 */}
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  step.completed ? 'text-green-600' : 
                  step.current ? 'text-blue-600' : 
                  'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
              
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  steps[index + 1].completed ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 预定义的AI部署流程步骤
export const AI_DEPLOYMENT_STEPS = [
  { id: 'dataset', name: '数据集选择' },
  { id: 'training', name: 'AI训练方式选择' },
  { id: 'deployment', name: '部署区域' },
  { id: 'summary', name: '选择总结' },
  { id: 'status', name: '部署与目前状况' }
] as const

// 根据当前页面生成步骤状态的辅助函数
export function getStepsForPage(currentPage: string): ProgressStep[] {
  const pageIndex = AI_DEPLOYMENT_STEPS.findIndex(step => step.id === currentPage)
  
  return AI_DEPLOYMENT_STEPS.map((step, index) => ({
    id: step.id,
    name: step.name,
    completed: index < pageIndex,
    current: index === pageIndex
  }))
}
