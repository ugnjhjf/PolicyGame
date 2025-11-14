// 事件类型定义

export interface EventData {
  id: string
  title: string
  description: string
  imageUrl?: string
  type: EventType
  priority: EventPriority
  // 事件效果
  effects?: EventEffect[]
  // 事件选项
  options?: EventOption[]
  // 事件持续时间
  duration?: number
  // 事件触发条件
  conditions?: EventCondition[]
}

export type EventType = 
  | 'crime'        // 犯罪事件
  | 'community'    // 社区事件
  | 'system'       // 系统事件
  | 'emergency'    // 紧急事件
  | 'policy'       // 政策事件
  | 'resource'     // 资源事件

export type EventPriority = 
  | 'low'          // 低优先级
  | 'medium'       // 中等优先级
  | 'high'         // 高优先级
  | 'critical'     // 紧急优先级

export interface EventEffect {
  type: 'crimeRate' | 'communityTrust' | 'resources'
  value: number
  description: string
}

export interface EventOption {
  id: string
  text: string
  effects: EventEffect[]
  requirements?: {
    resources?: number
    communityTrust?: number
  }
}

export interface EventCondition {
  type: 'date' | 'crimeRate' | 'communityTrust' | 'resources'
  operator: '>' | '<' | '>=' | '<=' | '==' | '!='
  value: number | string
}
