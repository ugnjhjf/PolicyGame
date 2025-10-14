// 区域数据类型定义
export interface DistrictData {
  name: string
  population: number
  crimeRate: number
  policePresence: number
  surveillance: number
}

// 面板基础属性
export interface PanelProps {
  isOpen: boolean
  onClose: () => void
}

// Central District 面板属性
export interface CentralDistrictPanelProps extends PanelProps {
  districtData: DistrictData
}
