'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Zap, DollarSign, FileText, Users, TrendingUp, Target, Heart, Play, Pause, Brain, Info } from 'lucide-react'
import styles from '../../styles/animations.module.css'
import { CentralDistrictPanel, DistrictData } from '../../components/panel'
import { DebugMenu } from '../../components/debug'
import { EventManager, CrimeSurgeEvent, EventPanel, EmergencyEventSelector } from '../../components/events'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'
import { initializeGameEngine } from '../../engine/core'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // 模态框状态
  const [showCentralDistrict, setShowCentralDistrict] = useState(false)
  // 紧急事件状态
  const [showCrimeSurgeEvent, setShowCrimeSurgeEvent] = useState(false)
  // AI数据集状态
  const [showAIDataset, setShowAIDataset] = useState(false)
  // 紧急事件选择器状态
  const [showEmergencySelector, setShowEmergencySelector] = useState(false)

  // 同步实时游戏状态
  useEffect(() => {
    const updateGameState = () => {
      setGameState(GameStateManager.getCurrentState())
    }
    
    // 初始同步
    updateGameState()
    
    // 初始化游戏引擎（包括日期管理器）
    initializeGameEngine()
    
    // 定期同步游戏状态（每500ms）
    const interval = setInterval(updateGameState, 500)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // 处理播放/暂停按钮点击
  const handlePlayPause = (play: boolean) => {
    console.log(`[GamePage] 播放/暂停按钮: ${play ? '播放' : '暂停'}`)
    if (play) {
      GameStateManager.startGame()
    } else {
      GameStateManager.pauseGame()
    }
    // 状态会通过定时器自动同步
  }

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
    // 记录当前游戏状态并暂停游戏
    const currentGameState = GameStateManager.getCurrentState()
    if (currentGameState.isPlaying) {
      GameStateManager.pauseGame()
    }
    
    switch (eventId) {
      case 'crime-surge':
        setShowCrimeSurgeEvent(true)
        break
      case 'community-protest':
        alert('社区抗议事件功能开发中...')
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
    surveillance: 78,
    incidents: 12,
    arrests: 8,
    efficiency: 85.2
  })

  return (
    <div className="min-h-screen relative">
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
              // 暂停游戏
              const currentGameState = GameStateManager.getCurrentState()
              if (currentGameState.isPlaying) {
                GameStateManager.pauseGame()
              }
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

        {/* AI数据集按钮 */}
        <div className="absolute top-1/4 right-1/4 z-10">
          <Link
            href="/ai-dataset"
            className="group relative flex flex-col items-center"
            title="AI Dataset Selection - Click to configure"
          >
            <div className="w-14 h-14 bg-purple-500/80 hover:bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="mt-2 px-2 py-1 bg-black/60 text-gray-400 group-hover:text-white group-hover:scale-105 group-hover:px-3 group-hover:py-1.5 text-xs font-medium rounded-md transition-all duration-200 origin-center">
              AI Dataset
            </div>
          </Link>
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


      {/* Central District 面板 */}
      <CentralDistrictPanel
        isOpen={showCentralDistrict}
        onClose={() => {
          setShowCentralDistrict(false)
          // 恢复游戏状态
          GameStateManager.startGame()
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
          // 恢复游戏状态
          GameStateManager.startGame()
        }}
        onComplete={(optionId) => {
          setShowCrimeSurgeEvent(false)
          // 恢复游戏状态
          GameStateManager.startGame()
        }}
      />

      {/* 底部城市状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-10" style={{
        height: '48px',
        backdropFilter: 'blur(4px) saturate(100%)',
        background: 'rgba(39, 39, 42, 0.75)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
      }}>
        {/* 暗色渐变带 */}
        <div className="absolute left-0 right-0 bottom-12 h-8 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(24, 24, 27, 0.4), rgba(24, 24, 27, 0))'
        }}></div>
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* 左侧：控制区 */}
            <div className="flex items-center gap-3">
              {/* 游戏控制按钮 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePlayPause(false)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !gameState.isPlaying 
                      ? 'bg-red-500/15 text-red-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white'
                  }`}
                  title="Pause Game"
                >
                  <Pause className="w-3.5 h-3.5" style={{ strokeWidth: '1.5' }} />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => handlePlayPause(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    gameState.isPlaying 
                      ? 'bg-green-500/15 text-green-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white'
                  }`}
                  title="Play Game"
                >
                  <Play className="w-3.5 h-3.5" style={{ strokeWidth: '1.5' }} />
                  <span>Play</span>
                </button>
              </div>

              {/* 日期 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-sm font-medium" style={{ 
                  color: '#E4E4E7',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.date}</span>
              </div>

            </div>

            {/* 中间：时间与资源区 */}
            <div className="flex items-center gap-6">
              {/* 行动点 */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>AP</span>
                  <span className="text-sm font-bold" style={{ 
                    color: '#FDE047',
                    fontFeatureSettings: '"tnum" 1'
                  }}>{gameState.actionPoints}/10</span>
                </div>
              </div>

              {/* 预算 */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget</span>
                  <span className="text-sm font-bold" style={{ 
                    color: '#86EFAC',
                    fontFeatureSettings: '"tnum" 1'
                  }}>${gameState.money.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 右侧：KPI区 */}
            <div className="flex items-center gap-5">
              {/* 案件数量 */}
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Cases</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#FCA5A5',
                  fontFeatureSettings: '"tnum" 1'
                }}>{Math.floor(gameState.caseCount)}</span>
              </div>

              {/* 抓捕人数 */}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Arrests</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#C4B5FD',
                  fontFeatureSettings: '"tnum" 1'
                }}>{Math.floor(gameState.arrests)}</span>
              </div>

              {/* 犯罪率 */}
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Crime</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#FDBA74',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.crimeRate}%</span>
              </div>

              {/* 准确率 */}
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Acc</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#93C5FD',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.arrestAccuracy}%</span>
              </div>

              {/* 信任度 */}
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" style={{ color: '#A1A1AA', strokeWidth: '1.5' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Trust</span>
                <span className="text-sm font-bold" style={{ 
                  color: '#F9A8D4',
                  fontFeatureSettings: '"tnum" 1'
                }}>{gameState.communityTrust}%</span>
              </div>

              {/* 信息提示 */}
              <div className="flex items-center gap-1.5 ml-2">
                <Info className="w-3.5 h-3.5" style={{ color: '#71717A', strokeWidth: '1.5' }} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
