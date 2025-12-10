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

export interface MapEvent {
  id: string
  x: number
  y: number
  label: string
  isCompleted: boolean
  requirements?: string[] // flags or items required
}

export interface RPGState {
  player: {
    inventory: Item[]
    journal: Clue[]
    encyclopedia: Concept[]
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
    encyclopedia: []
  },
  map: {
    activeEvents: [
      { id: 'police-hq', x: 20, y: 70, label: 'Police HQ', isCompleted: false },
      { id: 'gov-complex', x: 50, y: 50, label: 'Government Complex', isCompleted: false },
      { id: 'data-center', x: 80, y: 30, label: 'Data Center', isCompleted: false },
    ]
  },
  flags: {}
}
