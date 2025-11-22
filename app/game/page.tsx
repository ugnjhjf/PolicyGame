'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Server } from 'lucide-react'
import styles from '../../styles/animations.module.css'
import { CentralDistrictPanel, DistrictData } from '../../components/panel'
import { DebugMenu } from '../../components/debug'
import { EventManager, CrimeSurgeEvent, CommunityProtestEvent, EventPanel, EmergencyEventSelector } from '../../components/events'
import DataCenterWelcome from '../../components/DataCenterWelcome'
import GameStatusBar from '../../components/GameStatusBar'
import GameObjectivePanel from '../../components/GameObjectivePanel'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
// import { initializeGameEngine } from '../../engine/core' // 已移除实时模拟功能

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // 模态框状态
  const [showCentralDistrict, setShowCentralDistrict] = useState(false)
  // 紧急事件状态
  const [showCrimeSurgeEvent, setShowCrimeSurgeEvent] = useState(false)
  const [showCommunityProtestEvent, setShowCommunityProtestEvent] = useState(false)
  // AI数据集状态
  const [showAIDataset, setShowAIDataset] = useState(false)
  // Data Center 欢迎页面状态
  const [showDataCenterWelcome, setShowDataCenterWelcome] = useState(false)
  // 紧急事件选择器状态
  const [showEmergencySelector, setShowEmergencySelector] = useState(false)

  // 初始化游戏状态（移除实时同步）
  useEffect(() => {
    // 只进行一次初始状态同步
    setGameState(GameStateManager.getCurrentState())
    
    // 不再初始化游戏引擎的自动功能
    // initializeGameEngine() // 已移除实时模拟功能
  }, [])

  // 处理事件触发
  const handleEventTrigger = (eventType: string) => {
    switch (eventType) {
      case 'emergency-selector':
        setShowEmergencySelector(true)
        break
      case 'crime-surge':
        setShowCrimeSurgeEvent(true)
        break
      case 'ai-dataset':
        // 跳转到AI数据集页面
        window.location.href = '/ai-dataset'
        break
      case 'community-event':
        alert('社区事件功能开发中...')
        break
      case 'police-event':
        alert('警力事件功能开发中...')
        break
      case 'system-event':
        alert('系统事件功能开发中...')
        break
      default:
    }
  }

  // 处理紧急事件选择
  const handleEmergencyEventSelect = (eventId: string) => {
    switch (eventId) {
      case 'crime-surge':
        setShowCrimeSurgeEvent(true)
        break
      case 'community-protest':
        setShowCommunityProtestEvent(true)
        break
      case 'police-strike':
        alert('警察罢工事件功能开发中...')
        break
      case 'ai-system-failure':
        alert('AI系统故障事件功能开发中...')
        break
      case 'cyber-attack':
        alert('网络攻击事件功能开发中...')
        break
      default:
    }
  }
  
  // Central District 数据
  const [districtData] = useState<DistrictData>({
    name: 'Central District',
    population: 125000,
    crimeRate: 8.5,
    policePresence: 45,
    surveillance: 78
  })

  return (
    <div className="min-h-screen relative pt-12">
      {/* 背景图片 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/city_overview.png"
          alt="City Overview"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {/* 半透明遮罩层，确保内容可读性 */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* 可点击地标 */}
        {/* 中央地标 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => {
              setShowCentralDistrict(true)
            }}
            className="group relative flex flex-col items-center"
            title="Central District - Click to manage"
          >
            <div className="w-16 h-16 bg-blue-500/80 hover:bg-blue-600/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="mt-2 px-2 py-1 bg-black/60 text-gray-400 group-hover:text-white group-hover:scale-105 group-hover:px-3 group-hover:py-1.5 text-xs font-medium rounded-md transition-all duration-200 origin-center">
              Central District
            </div>
          </button>
        </div>

        {/* Data Center按钮 */}
        <div className="absolute top-1/4 right-1/4 z-10">
          <button
            onClick={() => {
              setShowDataCenterWelcome(true)
            }}
            className="group relative flex flex-col items-center"
            title="Data Center - Click to configure"
          >
            <div className="w-14 h-14 bg-purple-500/80 hover:bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div className="mt-2 px-2 py-1 bg-black/60 text-gray-400 group-hover:text-white group-hover:scale-105 group-hover:px-3 group-hover:py-1.5 text-xs font-medium rounded-md transition-all duration-200 origin-center">
              Data Center
            </div>
          </button>
        </div>

        {/* 左下角地标 */}
        <div className="absolute bottom-[15%] left-[15%] z-10">
          <button
            className="group relative flex flex-col items-center"
            title="Surveillance Zone - Click to monitor"
          >
            <div className="w-14 h-14 bg-green-500/80 hover:bg-green-600/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="mt-2 px-2 py-1 bg-black/60 text-gray-400 group-hover:text-white group-hover:scale-105 group-hover:px-3 group-hover:py-1.5 text-xs font-medium rounded-md transition-all duration-200 origin-center">
              Surveillance Zone
            </div>
          </button>
        </div>
      </div>

      {/* 顶部城市状态栏 */}
      <GameStatusBar />

      {/* 左侧目标面板 */}
      <GameObjectivePanel />

      {/* Central District 面板 */}
      <CentralDistrictPanel
        isOpen={showCentralDistrict}
        onClose={() => {
          setShowCentralDistrict(false)
        }}
        districtData={districtData}
      />

      {/* 事件面板 */}
      <EventPanel onTriggerEvent={handleEventTrigger} />
      
      {/* 调试菜单 */}
      <DebugMenu 
        onStateChange={setGameState} 
        onTriggerEmergencySelector={() => setShowEmergencySelector(true)}
      />
      
      {/* 事件管理器 */}
      <EventManager />
      
      {/* 紧急事件选择器 */}
      <EmergencyEventSelector
        isOpen={showEmergencySelector}
        onClose={() => setShowEmergencySelector(false)}
        onSelectEvent={handleEmergencyEventSelect}
      />
      
      {/* 犯罪激增紧急事件 */}
      <CrimeSurgeEvent
        isOpen={showCrimeSurgeEvent}
        onClose={() => {
          setShowCrimeSurgeEvent(false)
        }}
        onComplete={(optionId) => {
          setShowCrimeSurgeEvent(false)
        }}
      />
      
      {/* 社区抗议紧急事件 */}
      <CommunityProtestEvent
        isOpen={showCommunityProtestEvent}
        onClose={() => {
          setShowCommunityProtestEvent(false)
        }}
        onComplete={(optionId) => {
          setShowCommunityProtestEvent(false)
        }}
      />

      {/* Data Center 欢迎页面 */}
      <DataCenterWelcome
        isOpen={showDataCenterWelcome}
        onComplete={() => {
          setShowDataCenterWelcome(false)
          // 跳转到AI数据集页面
          window.location.href = '/ai-dataset'
        }}
      />

    </div>
  )
}
