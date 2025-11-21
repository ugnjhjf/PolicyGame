'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, MapPin, Users, Shield, Eye, Target, AlertTriangle, Building, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import ProgressBar, { getStepsForPage } from '../../components/ProgressBar'
import GameStatusBar from '../../components/GameStatusBar'

interface DeploymentArea {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  imageUrl: string
  population: number
  crimeRate: number
  policePresence: number
  surveillance: number
  pros: string[]
  cons: string[]
  features: string[]
  deploymentCost: number
  effectiveness: number
}

const DEPLOYMENT_AREAS: DeploymentArea[] = [
  {
    id: 'central',
    name: 'Central District',
    description: 'Urban center commercial and administrative area with dense population and relatively low crime rate, ideal for AI deployment',
    icon: Building,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    imageUrl: '/city_overview.png',
    population: 125000,
    crimeRate: 8.5,
    policePresence: 45,
    surveillance: 78,
    deploymentCost: 25000,
    effectiveness: 92,
    pros: [
      'High population density, efficient data collection',
      'Well-developed infrastructure, relatively low deployment cost',
      'Low crime rate, controllable risks',
      'High government support, favorable policy environment'
    ],
    cons: [
      'Dense population, high privacy protection requirements',
      'Frequent commercial activities may affect deployment',
      'Strict regulatory requirements',
      'Intense competition, complex resource allocation'
    ],
    features: ['Business Center', 'Government Institutions', 'Transportation Hub', 'Financial District']
  },
  {
    id: 'surveillance',
    name: 'Surveillance Zone',
    description: 'Key surveillance area with high crime rate but well-developed monitoring facilities, suitable for AI systems for crime prediction and prevention',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    imageUrl: '/city_overview2 .png',
    population: 85000,
    crimeRate: 12.3,
    policePresence: 38,
    surveillance: 65,
    deploymentCost: 18000,
    effectiveness: 88,
    pros: [
      'High demand for crime prediction, clear AI value',
      'Well-developed existing monitoring facilities',
      'Relatively low deployment cost',
      'Immediate effect'
    ],
    cons: [
      'High crime rate, significant security risks',
      'May have lower social acceptance',
      'Requires more maintenance costs',
      'May trigger privacy disputes'
    ],
    features: ['Surveillance Focus', 'Crime Hotspot', 'Community Monitoring', 'Early Warning System']
  }
]

export default function DeploymentPage() {
  const [selectedArea, setSelectedArea] = useState<DeploymentArea | null>(DEPLOYMENT_AREAS[0]) // 默认选择第一个
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAreaSelect = (area: DeploymentArea) => {
    setSelectedArea(area)
  }

  const handleConfirm = () => {
    if (selectedArea) {
      // 保存选择的部署区域到localStorage
      localStorage.setItem('selectedArea', JSON.stringify(selectedArea))
      console.log(`已选择部署区域: ${selectedArea.name} (仅视觉展示)`)
      
      // 添加退出动画
      setIsAnimating(true)
      setTimeout(() => {
        // 跳转到选择总结页面
        window.location.href = '/ai-summary'
      }, 300)
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return 'text-green-600 bg-green-100'
    if (effectiveness >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEffectivenessText = (effectiveness: number) => {
    if (effectiveness >= 90) return 'Excellent'
    if (effectiveness >= 80) return 'Good'
    return 'Fair'
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('deployment')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b mt-28">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/ai-training-methods" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/ai-training-methods'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Training Method
              </Link>
            </div>
            
            {/* 选择按钮 */}
            {selectedArea && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Select Deployment Area
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 - 左右分栏布局 */}
      <div className="flex-1 flex">
        {/* 左侧部署区域列表 */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Areas</h2>
            <div className="space-y-3">
              {DEPLOYMENT_AREAS.map((area) => (
                <div
                  key={area.id}
                  onClick={() => handleAreaSelect(area)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedArea?.id === area.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${area.bgColor}`}>
                      <area.icon className={`w-5 h-5 ${area.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{area.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{area.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Population</span>
                      <span className="font-semibold text-blue-600">{area.population.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Crime Rate</span>
                      <span className="font-semibold text-red-600">{area.crimeRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Deployment Cost</span>
                      <span className="font-semibold text-green-600">¥{area.deploymentCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Effectiveness</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getEffectivenessColor(area.effectiveness)}`}>
                        {getEffectivenessText(area.effectiveness)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧详情展示 */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedArea ? (
            <div className="h-full flex flex-col">
              {/* 图片区域 */}
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50">
                <img
                  src={selectedArea.imageUrl}
                  alt={selectedArea.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getEffectivenessColor(selectedArea.effectiveness)}`}>
                    {getEffectivenessText(selectedArea.effectiveness)}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${selectedArea.bgColor}`}>
                        <selectedArea.icon className={`w-6 h-6 ${selectedArea.color}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedArea.name}</h2>
                    </div>
                    <p className="text-gray-600 text-sm">{selectedArea.description}</p>
                  </div>
                </div>
              </div>

              {/* 详细信息区域 */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl">
                  {/* 关键指标 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{selectedArea.population.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Population</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{selectedArea.crimeRate}%</div>
                      <div className="text-sm text-gray-600">Crime Rate</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{selectedArea.policePresence}%</div>
                      <div className="text-sm text-gray-600">Police Presence</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{selectedArea.effectiveness}%</div>
                      <div className="text-sm text-gray-600">Effectiveness</div>
                    </div>
                  </div>

                  {/* 优缺点对比 */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {selectedArea.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {selectedArea.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 区域特征 */}
                  <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArea.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 部署信息 */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Deployment Cost:</span>
                        <span className="font-medium text-lg text-green-600">¥{selectedArea.deploymentCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expected Effectiveness:</span>
                        <span className="font-medium text-lg text-blue-600">{selectedArea.effectiveness}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Surveillance Coverage:</span>
                        <span className="font-medium text-lg text-purple-600">{selectedArea.surveillance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Police Support:</span>
                        <span className="font-medium text-lg text-orange-600">{selectedArea.policePresence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Please select a deployment area from the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
