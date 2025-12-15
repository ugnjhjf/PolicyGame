export interface Item {
  id: string
  name: string
  description: string
  icon?: string
}

export interface Clue {
  id: string
  title: string
  content: string
  regionId: string
  timestamp: string
  isRead: boolean
}

export interface Concept {
  id: string
  title: string
  category: string
  description: string
  unlockedAt: string
  isRead: boolean
}

export type MapEventStatus = 'available' | 'investigating' | 'completed'

export interface MapEvent {
  id: string
  x: number
  y: number
  label: string
  status: MapEventStatus
  progress?: number // 0-100 for investigation
  requirements?: string[] // flags or items required
}

export interface InvestigationReportData {
  id?: string // Added ID for listing
  question: string
  region: string
  date: string
  fileId: string
  content: string
  suggestion: string
  chart?: {
    title: string
    labels: string[]
    datasets: {
      label: string
      values: number[]
      style: 'solid' | 'striped'
    }[]
  }
}

export interface RPGState {
  player: {
    inventory: Item[]
    journal: Clue[]
    encyclopedia: Concept[]
    reports: InvestigationReportData[]
  }
  map: {
    activeEvents: MapEvent[]
  }
  flags: Record<string, boolean>
}

export const INITIAL_RPG_STATE: RPGState = {
  player: {
    inventory: [],
    journal: [],
    encyclopedia: [],
    reports: []
  },
  map: {
    activeEvents: [
      { id: 'police-hq', x: 20, y: 70, label: 'Police HQ', status: 'available' },
      { id: 'gov-complex', x: 50, y: 50, label: 'Government Complex', status: 'available' },
      { id: 'data-center', x: 80, y: 30, label: 'Data Center', status: 'available' },
    ]
  },
  flags: {}
}
