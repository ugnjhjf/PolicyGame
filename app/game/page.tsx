'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, Zap, DollarSign, FileText, Users, TrendingUp, Target, Heart, Play, Pause } from 'lucide-react'
import styles from '../../styles/animations.module.css'
import { CentralDistrictPanel, DistrictData } from '../../components/panel'
import { DebugMenu } from '../../components/debug'
import { GameStateManager, INITIAL_GAME_STATE, type GameState } from '../../config/data'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  // 游戏进程控制状态
  const [isPlaying, setIsPlaying] = useState(true)
  // 模态框状态
  const [showCentralDistrict, setShowCentralDistrict] = useState(false)

  // 同步实时游戏状态
  useEffect(() => {
    const updateGameState = () => {
      setGameState(GameStateManager.getCurrentState())
    }
    
    // 初始同步
    updateGameState()
    
    // 可以在这里添加定时器或其他状态同步逻辑
  }, [])
  
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
            onClick={() => setShowCentralDistrict(true)}
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
      <div className={`relative z-10 ${styles.glassEffect} shadow-lg border-b border-white/20 ${styles.gpuAccelerated}`}>
        <div className="container mx-auto pl-1 pr-2 sm:pl-2 sm:pr-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* 左侧：基础信息 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
              {/* 游戏控制按钮 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(false)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    !isPlaying 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Pause Game"
                >
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => setIsPlaying(true)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isPlaying 
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
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Date:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.date}</span>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 行动点 */}
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Action Points:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.actionPoints}/10</span>
              </div>

              {/* 金钱 */}
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Budget:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">${gameState.money.toLocaleString()}</span>
              </div>
            </div>

            {/* 右侧：城市状态指标 */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-3">
              {/* 案件数量 - 中性指标 */}
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Cases:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.caseCount}</span>
              </div>

              {/* 抓捕人数 - 中性指标 */}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Arrests:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.arrests}</span>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 犯罪率 - 越低越好 */}
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Crime Rate:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.crimeRate}%</span>
              </div>

              {/* 分隔符 */}
              <div className="w-px h-4 sm:h-6 bg-gray-400"></div>

              {/* 抓捕正确率 - 越高越好 */}
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Accuracy:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.arrestAccuracy}%</span>
              </div>

              {/* 社区信任度 - 越高越好 */}
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Trust:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{gameState.communityTrust}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central District 面板 */}
      <CentralDistrictPanel
        isOpen={showCentralDistrict}
        onClose={() => setShowCentralDistrict(false)}
        districtData={districtData}
      />

      {/* 调试菜单 */}
      <DebugMenu onStateChange={setGameState} />
    </div>
  )
}
