'use client'

import { MapPin, X, AlertTriangle, Shield, Camera, Building, Users, TrendingUp } from 'lucide-react'
import styles from '../../styles/animations.module.css'
import { CentralDistrictPanelProps } from './types'

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
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto ${styles.glassEffect} rounded-2xl shadow-2xl ${styles.gpuAccelerated}`}>
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

        {/* 数据网格 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 人口数据 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Population</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.population.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Residents</p>
            </div>

            {/* 犯罪率 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Crime Rate</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.crimeRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Per 1000 residents</p>
            </div>

            {/* 警力部署 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-800">Police Presence</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.policePresence}%</p>
              <p className="text-sm text-gray-600 mt-1">Coverage</p>
            </div>

            {/* 监控覆盖 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Camera className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">Surveillance</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.surveillance}%</p>
              <p className="text-sm text-gray-600 mt-1">Camera coverage</p>
            </div>

            {/* 事件数量 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Incidents</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.incidents}</p>
              <p className="text-sm text-gray-600 mt-1">This week</p>
            </div>

            {/* 逮捕数量 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">Arrests</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.arrests}</p>
              <p className="text-sm text-gray-600 mt-1">This week</p>
            </div>

            {/* 效率指标 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                <h3 className="text-lg font-semibold text-gray-800">Efficiency</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{districtData.efficiency}%</p>
              <p className="text-sm text-gray-600 mt-1">Response rate</p>
            </div>

            {/* 空位 - 为未来功能预留 */}
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">Additional<br />Metrics</p>
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
