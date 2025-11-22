'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, TrendingUp, Target, Heart, BarChart3, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from '../../styles/animations.module.css'
import GameStatusBar from '../../components/GameStatusBar'
import { GAME_CONFIG } from '../../config/data/gameConfig'

interface RoundData {
  round: number
  label?: string
  crimeRate: number
  arrestAccuracy: number
  communityTrust: number
  resources: number
}

export default function GameResultPage() {
  const [roundData, setRoundData] = useState<RoundData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const loadRoundData = async () => {
      if (typeof window !== 'undefined') {
        const data: RoundData[] = []
        
        // 加载初始状态
        const initialDataKey = 'roundData_initial'
        const initialSaved = localStorage.getItem(initialDataKey)
        if (initialSaved) {
          try {
            const parsed = JSON.parse(initialSaved)
            data.push({ ...parsed, label: 'Initial' })
          } catch (error) {
            console.error('Failed to parse initial data:', error)
          }
        } else {
          // 如果没有保存的初始数据，使用默认初始值
          data.push({
            round: 0,
            label: 'Initial',
            crimeRate: 10,
            arrestAccuracy: 10,
            communityTrust: 80,
            resources: 10
          })
        }
        
        // 加载所有回合的数据
        let lastValidData = data[0] // 初始数据作为后备
        for (let round = 1; round <= GAME_CONFIG.maxRounds; round++) {
          const roundDataKey = `roundData_round${round}`
          const saved = localStorage.getItem(roundDataKey)
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              // 确保 label 存在
              if (!parsed.label) {
                parsed.label = `After Round ${round}`
              }
              data.push(parsed)
              lastValidData = parsed // 更新最后有效数据
            } catch (error) {
              console.error(`Failed to parse round ${round} data:`, error)
              // 如果解析失败，使用前一个有效数据
              if (lastValidData) {
                data.push({
                  ...lastValidData,
                  round: round,
                  label: `After Round ${round}`
                })
              }
            }
          } else {
            // 如果数据不存在，使用前一个有效数据作为占位符
            console.warn(`Round ${round} data not found in localStorage, using previous round data`)
            if (lastValidData) {
              data.push({
                ...lastValidData,
                round: round,
                label: `After Round ${round}`
              })
            }
          }
        }
        
        // 按回合排序
        data.sort((a, b) => a.round - b.round)
        
        // 调试：输出加载的数据
        console.log('Loaded round data:', data)
        console.log('Data points count:', data.length)
        
        setRoundData(data)
      }
      
      // 增加1秒加载时间，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
    }

    loadRoundData()
  }, [])

  // 计算目标完成情况（使用第三回合后的数据）
  const calculateObjectives = () => {
    if (roundData.length === 0) return { crimeRate: false, accuracy: false, trust: false }
    
    // 找到第三回合后的数据（round === 3）
    const finalRound = roundData.find(data => data.round === 3) || roundData[roundData.length - 1]
    return {
      crimeRate: finalRound.crimeRate < 30,
      accuracy: finalRound.arrestAccuracy > 60,
      trust: finalRound.communityTrust > 40
    }
  }

  const objectives = calculateObjectives()
  const allObjectivesMet = objectives.crimeRate && objectives.accuracy && objectives.trust

  // 准备图表数据
  const chartData = roundData.map(data => ({
    round: data.label || (data.round === 0 ? 'Initial' : `After Round ${data.round}`),
    'Crime Rate': data.crimeRate,
    'Accuracy': data.arrestAccuracy,
    'Trust': data.communityTrust,
    'Resources': data.resources
  }))

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      {/* 游戏状态栏 */}
      <GameStatusBar />
      
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/game" 
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  setIsAnimating(true)
                  setTimeout(() => {
                    window.location.href = '/game'
                  }, 300)
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Game
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game results...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-6xl">
            {/* 标题 */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Game Results</h1>
              </div>
              <p className="text-gray-600">Complete summary of your game performance</p>
            </div>

            {/* 目标完成情况 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Objectives Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`bg-white rounded-lg p-4 ${objectives.crimeRate ? 'border-2 border-green-500' : 'border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Crime Rate</span>
                    {objectives.crimeRate ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {roundData.length > 0 ? (roundData.find(data => data.round === 3) || roundData[roundData.length - 1]).crimeRate.toFixed(1) : 'N/A'}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: &lt; 30%</div>
                </div>
                <div className={`bg-white rounded-lg p-4 ${objectives.accuracy ? 'border-2 border-green-500' : 'border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Accuracy</span>
                    {objectives.accuracy ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {roundData.length > 0 ? (roundData.find(data => data.round === 3) || roundData[roundData.length - 1]).arrestAccuracy.toFixed(1) : 'N/A'}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: &gt; 60%</div>
                </div>
                <div className={`bg-white rounded-lg p-4 ${objectives.trust ? 'border-2 border-green-500' : 'border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Trust</span>
                    {objectives.trust ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {roundData.length > 0 ? (roundData.find(data => data.round === 3) || roundData[roundData.length - 1]).communityTrust.toFixed(1) : 'N/A'}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: &gt; 40%</div>
                </div>
              </div>
              {allObjectivesMet && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-green-600" />
                    <span className="text-lg font-semibold text-green-800">Congratulations! All objectives achieved!</span>
                  </div>
                </div>
              )}
            </div>

            {/* 折线图 */}
            {roundData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Performance Trends
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Crime Rate" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="Accuracy" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Trust" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="Resources" stroke="#eab308" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 回合数据表格 */}
            {roundData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Round-by-Round Summary
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Period</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Crime Rate</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Trust</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Resources</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roundData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {data.label || (data.round === 0 ? 'Initial' : `After Round ${data.round}`)}
                          </td>
                          <td className="py-3 px-4 text-red-600">{data.crimeRate.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-blue-600">{data.arrestAccuracy.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-pink-600">{data.communityTrust.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-yellow-600">{data.resources}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {roundData.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800">No game data available. Please complete at least one round to see results.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

