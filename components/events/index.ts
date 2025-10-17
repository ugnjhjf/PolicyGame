// 事件组件统一导出

export { default as EventModal } from './EventModal'
export { default as EventManager } from './EventManager'
export { default as EventPanel } from './EventPanel'
export { default as EmergencyEventSelector } from './EmergencyEventSelector'
export * from './types'

// 犯罪激增事件
export { default as CrimeSurgeEvent } from './crime-surge/CrimeSurgeEvent'
export { default as crimeSurgeEventData } from './crime-surge/crime-surge-event.json'

// 社区抗议事件
export { default as CommunityProtestEvent } from './community-protest/CommunityProtestEvent'
export { default as communityProtestEventData } from './community-protest/community-protest-event.json'
