'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Zap, DollarSign, FileText, Users, TrendingUp, Target, Heart, Play, Pause } from 'lucide-react'
import styles from '../../styles/animations.module.css'
import { INITIAL_GAME_STATE } from '../../lib/constants/gameState'

export default function GamePage() {
  // 游戏状态数据
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE)
  // 游戏进程控制状态
  const [isPlaying, setIsPlaying] = useState(true)

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
      </div>

      {/* 顶部城市状态栏 */}
      <div className={`relative z-10 ${styles.glassEffect} shadow-lg border-b border-white/20 ${styles.gpuAccelerated}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 左侧：基础信息 */}
            <div className="flex flex-wrap items-center gap-6">
              {/* 游戏控制按钮 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(false)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    !isPlaying 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Pause Game"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => setIsPlaying(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Play Game"
                >
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
              </div>

              {/* 日期 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Date:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.date}</span>
              </div>

              {/* 行动点 */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Action Points:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.actionPoints}/10</span>
              </div>

              {/* 金钱 */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Budget:</span>
                <span className="text-sm font-semibold text-gray-900">${gameState.money.toLocaleString()}</span>
              </div>
            </div>

            {/* 右侧：城市状态指标 */}
            <div className="flex flex-wrap items-center gap-4">
              {/* 案件数量 */}
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Cases:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.caseCount}</span>
              </div>

              {/* 抓捕人数 */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Arrests:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.arrests}</span>
              </div>

              {/* 犯罪率 */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Crime Rate:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.crimeRate}%</span>
              </div>

              {/* 抓捕正确率 */}
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Accuracy:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.arrestAccuracy}%</span>
              </div>

              {/* 社区信任度 */}
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-700">Trust:</span>
                <span className="text-sm font-semibold text-gray-900">{gameState.communityTrust}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
