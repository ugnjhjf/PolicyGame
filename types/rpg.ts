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
  isRead?: boolean // Track unread status
  question: string
  region: string
  date: string
  fileId: string
  content: string
  suggestion: string
  chart?: {
    type?: 'bar' | 'pie' // Distinguish chart types
    title: string
    valueSuffix?: string
    colors?: string[]
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
    activeEvents: []
  },
  flags: {}
}
