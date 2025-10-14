'use client'

import { MapPin, X, AlertTriangle, Shield, Camera, Building, Users, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../../styles/animations.module.css'
import { CentralDistrictPanelProps } from './types'

// 模拟历史数据
const historicalData = [
  { month: 'Jan', crimeRate: 12, policePresence: 65, surveillance: 45 },
  { month: 'Feb', crimeRate: 15, policePresence: 68, surveillance: 48 },
  { month: 'Mar', crimeRate: 18, policePresence: 72, surveillance: 52 },
  { month: 'Apr', crimeRate: 14, policePresence: 75, surveillance: 58 },
  { month: 'May', crimeRate: 11, policePresence: 78, surveillance: 62 },
  { month: 'Jun', crimeRate: 9, policePresence: 80, surveillance: 65 },
  { month: 'Jul', crimeRate: 8, policePresence: 82, surveillance: 68 },
  { month: 'Aug', crimeRate: 7, policePresence: 85, surveillance: 72 },
  { month: 'Sep', crimeRate: 6, policePresence: 88, surveillance: 75 },
  { month: 'Oct', crimeRate: 5, policePresence: 90, surveillance: 78 },
  { month: 'Nov', crimeRate: 4, policePresence: 92, surveillance: 80 },
  { month: 'Dec', crimeRate: 3, policePresence: 95, surveillance: 85 }
]

export default function CentralDistrictPanel({ isOpen, onClose, districtData }: CentralDistrictPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto ${styles.glassEffect} rounded-2xl shadow-2xl ${styles.gpuAccelerated}`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{districtData.name}</h2>
              <p className="text-gray-600">Central business and administrative district</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6">
          {/* Background 部分 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Background</h3>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="mb-3">The Central District serves as the heart of our city, housing the majority of commercial activities and government institutions.</p>
                <p className="mb-3">With a population of over 150,000 residents, this area faces unique challenges in maintaining public safety and security.</p>
                <p className="mb-3">Recent initiatives have focused on implementing smart surveillance systems and enhancing police presence to combat rising crime rates.</p>
                <p className="mb-0">The district's strategic importance requires continuous monitoring and adaptive policy implementation to ensure sustainable urban development.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：按优先级展示的指标 */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h3>
              <div className="space-y-4">
                {/* 高优先级：犯罪率 */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Crime Rate</h4>
                        <p className="text-sm text-gray-600">Critical Security Metric</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{districtData.crimeRate}%</p>
                      <p className="text-xs text-gray-500">Per 1000 residents</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-xs text-red-600 font-medium">High Priority</span>
                    </div>
                  </div>
                </div>

                {/* 中优先级：警力部署 */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Police Presence</h4>
                        <p className="text-sm text-gray-600">Security Coverage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{districtData.policePresence}%</p>
                      <p className="text-xs text-gray-500">Coverage</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-green-600 font-medium">Medium Priority</span>
                    </div>
                  </div>
                </div>

                {/* 中优先级：监控覆盖 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Surveillance</h4>
                        <p className="text-sm text-gray-600">Camera Coverage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{districtData.surveillance}%</p>
                      <p className="text-xs text-gray-500">Camera coverage</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-xs text-purple-600 font-medium">Medium Priority</span>
                    </div>
                  </div>
                </div>

                {/* 低优先级：人口数据 */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Population</h4>
                        <p className="text-sm text-gray-600">Demographic Data</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{districtData.population.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Residents</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-xs text-blue-600 font-medium">Low Priority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：趋势图表 */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trend Analysis</h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="crimeRate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Crime Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="policePresence" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      name="Police Presence (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="surveillance" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      name="Surveillance (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Current Policy 部分 */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Policy</h3>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 当前政策1 */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Enhanced Patrol</h4>
                  <p className="text-sm text-gray-600">Increased police presence in high-crime areas</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                </div>

                {/* 当前政策2 */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Smart Surveillance</h4>
                  <p className="text-sm text-gray-600">AI-powered camera monitoring system</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                </div>

                {/* 当前政策3 */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Community Watch</h4>
                  <p className="text-sm text-gray-600">Citizen engagement program</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Planning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg">
              Deploy Resources
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg">
              Update Surveillance
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
