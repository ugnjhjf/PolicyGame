'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Zap, DollarSign, FileText, Users, TrendingUp, Target, Heart, Play, Pause, Brain, Info, Lock } from 'lucide-react'
import { FaUserSecret, FaHandsHelping, FaUserNinja } from 'react-icons/fa'
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
    surveillance: 78
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

       {/* 顶部城市状态栏 */}
       <div className="relative z-10 shadow-lg border-b border-blue-200/30" style={{
         background: 'rgba(219, 234, 254, 0.65)',
         backdropFilter: 'blur(5px) saturate(120%)'
       }}>
        <div className="container mx-auto pl-1 pr-2 sm:pl-2 sm:pr-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* 左侧：基础信息 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
              {/* 游戏控制按钮 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePlayPause(false)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    !gameState.isPlaying 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Pause Game"
                >
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => handlePlayPause(true)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    gameState.isPlaying 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Play Game"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Play</span>
                </button>
              </div>

              {/* 日期 */}
              <div className="flex items-center gap-1">
                <div className="relative">
                  <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600/20 rounded-full"></div>
                  <Calendar className="relative w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Date:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.date}</span>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 行动点 */}
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500/20 rounded-full"></div>
                    <Zap className="relative w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 drop-shadow-sm filter brightness-110" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.actionPoints}/10</span>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">Action Points</div>
                  <div className="text-gray-300">执行政策行动所需的点数，每回合恢复</div>
                </div>
              </div>

              {/* 金钱 */}
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: '#2EBC5520' }}></div>
                    <DollarSign className="relative w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#2EBC55' }} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">${gameState.money.toLocaleString()}</span>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">Budget</div>
                  <div className="text-gray-300">可用于政策实施的资金预算</div>
                </div>
              </div>
            </div>

            {/* 右侧：城市状态指标 */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-3">
              {/* 案件数量 - 中性指标 */}
              <div className="flex items-center gap-1">
                <div className="relative">
                  <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: '#E0736720' }}></div>
                  <FileText className="relative w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E07367' }} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Cases:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{Math.floor(gameState.caseCount)}</span>
              </div>

              {/* 抓捕人数 - 中性指标 */}
              <div className="flex items-center gap-1">
                <div className="relative">
                  <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-purple-600/20 rounded-full"></div>
                  <FaHandsHelping className="relative w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Arrests:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{Math.floor(gameState.arrests)}</span>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 犯罪率 - 越低越好 */}
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 rounded-full"></div>
                    <FaUserNinja className="relative w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.crimeRate}%</span>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">Crime Rate</div>
                  <div className="text-gray-300">城市犯罪率百分比，越低越好</div>
                </div>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 抓捕正确率 - 越高越好 */}
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: '#7081FF20' }}></div>
                    <Target className="relative w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#7081FF' }} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.arrestAccuracy}%</span>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">Accuracy</div>
                  <div className="text-gray-300">抓捕行动准确率，越高越好</div>
                </div>
              </div>

              {/* 社区信任度 - 越高越好 */}
              <div className="relative group">
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: '#E9708520' }}></div>
                    <Heart className="relative w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E97085' }} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.communityTrust}%</span>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">Trust</div>
                  <div className="text-gray-300">社区对警方的信任度，越高越好</div>
                </div>
              </div>

              {/* 信息提示图标 */}
              <div className="relative group">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500/20 rounded-full"></div>
                    <Info className="relative w-4 h-4 sm:w-5 sm:h-5 text-blue-500 hover:text-blue-600 hover:scale-110 transition-all duration-200 cursor-pointer" />
                  </div>
                </div>
                {/* 悬浮提示 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="font-semibold">提示</div>
                  <div className="text-gray-300">将鼠标悬浮到指标上查看详细介绍</div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  )
}
