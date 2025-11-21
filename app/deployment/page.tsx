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
    description: '城市中心商业和行政区域，人口密集，犯罪率相对较低，是AI部署的理想选择',
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
      '人口密度高，数据收集效率高',
      '基础设施完善，部署成本相对较低',
      '犯罪率较低，风险可控',
      '政府支持度高，政策环境良好'
    ],
    cons: [
      '人口密集，隐私保护要求高',
      '商业活动频繁，可能影响部署',
      '监管要求严格',
      '竞争激烈，资源分配复杂'
    ],
    features: ['商业中心', '政府机构', '交通枢纽', '金融区']
  },
  {
    id: 'surveillance',
    name: 'Surveillance Zone',
    description: '监控重点区域，犯罪率较高但监控设施完善，适合AI系统进行犯罪预测和预防',
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
      '犯罪预测需求高，AI价值明显',
      '现有监控设施完善',
      '部署成本相对较低',
      '效果立竿见影'
    ],
    cons: [
      '犯罪率较高，安全风险大',
      '社会接受度可能较低',
      '需要更多维护成本',
      '可能引发隐私争议'
    ],
    features: ['监控重点', '犯罪热点', '社区监控', '预警系统']
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
    if (effectiveness >= 90) return '优秀'
    if (effectiveness >= 80) return '良好'
    return '一般'
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 进度条 */}
      <ProgressBar steps={getStepsForPage('deployment')} />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
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
                返回训练方式选择
              </Link>
            </div>
            
            {/* 选择按钮 */}
            {selectedArea && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                选择此部署区域
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">部署区域列表</h2>
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
                      <span className="text-gray-600">人口</span>
                      <span className="font-semibold text-blue-600">{area.population.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">犯罪率</span>
                      <span className="font-semibold text-red-600">{area.crimeRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">部署成本</span>
                      <span className="font-semibold text-green-600">¥{area.deploymentCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">效果</span>
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
                      <div className="text-sm text-gray-600">人口数量</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{selectedArea.crimeRate}%</div>
                      <div className="text-sm text-gray-600">犯罪率</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{selectedArea.policePresence}%</div>
                      <div className="text-sm text-gray-600">警力覆盖</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{selectedArea.effectiveness}%</div>
                      <div className="text-sm text-gray-600">部署效果</div>
                    </div>
                  </div>

                  {/* 优缺点对比 */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        优势
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
                        劣势
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">区域特征</h3>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">部署信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">部署成本:</span>
                        <span className="font-medium text-lg text-green-600">¥{selectedArea.deploymentCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">预期效果:</span>
                        <span className="font-medium text-lg text-blue-600">{selectedArea.effectiveness}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">监控覆盖:</span>
                        <span className="font-medium text-lg text-purple-600">{selectedArea.surveillance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">警力支持:</span>
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
                <p className="text-lg">请从左侧选择一个部署区域</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
