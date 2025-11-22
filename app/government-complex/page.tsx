'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Building, FileText, TrendingUp, AlertTriangle, CheckCircle, Shield, Server, BarChart3, Target, Heart } from 'lucide-react'
import Link from 'next/link'
import styles from '../../styles/animations.module.css'
import GameStatusBar from '../../components/GameStatusBar'
import { GameStateManager, type GameState } from '../../config/data'

export default function GovernmentComplexPage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isDataCenterCompleted, setIsDataCenterCompleted] = useState(false)
  const [isPoliceHQCompleted, setIsPoliceHQCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const currentState = GameStateManager.getCurrentState()
      setGameState(currentState)

      if (typeof window !== 'undefined' && currentState) {
        // 检查 Data Center 是否完成
        const dataCenterRoundKey = `dataCenterCompleted_round${currentState.round}`
        const isDataCenterRoundCompleted = localStorage.getItem(dataCenterRoundKey) === 'true'
        const hasDataset = localStorage.getItem('selectedDataset') !== null
        const hasMethod = localStorage.getItem('selectedMethod') !== null
        setIsDataCenterCompleted(isDataCenterRoundCompleted && hasDataset && hasMethod)

        // 检查 Police HQ 是否完成
        const policeHQRoundKey = `policeHQCompleted_round${currentState.round}`
        const isPoliceHQRoundCompleted = localStorage.getItem(policeHQRoundKey) === 'true'
        const hasStrategy = localStorage.getItem('policeHQSelectedStrategy') !== null
        setIsPoliceHQCompleted(isPoliceHQRoundCompleted && hasStrategy)
      }

      // 增加1秒加载时间，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
    }

    loadData()
  }, [])

  const canViewReport = isDataCenterCompleted && isPoliceHQCompleted

  // 当可以查看报告且报告内容已加载时，标记为已查看并保存当前回合数据
  useEffect(() => {
    if (canViewReport && !isLoading && gameState && typeof window !== 'undefined') {
      const viewKey = `governmentViewed_round${gameState.round}`
      localStorage.setItem(viewKey, 'true')
      
      // 保存当前回合的数据（每次查看报告时都更新，确保使用最新状态）
      const currentState = GameStateManager.getCurrentState()
      const roundData = {
        round: currentState.round,
        label: `After Round ${currentState.round}`,
        crimeRate: currentState.crimeRate,
        arrestAccuracy: currentState.arrestAccuracy,
        communityTrust: currentState.communityTrust,
        resources: currentState.resources
      }
      const roundDataKey = `roundData_round${currentState.round}`
      localStorage.setItem(roundDataKey, JSON.stringify(roundData))
    }
  }, [canViewReport, isLoading, gameState])

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
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      ) : !canViewReport ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">Report Not Available</h2>
              <p className="text-yellow-700 mb-6">
                The current situation report is only available after completing both Data Center and Police HQ deployments.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  {isDataCenterCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-yellow-600 rounded-full"></div>
                  )}
                  <span className="text-yellow-800">Data Center Deployment</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {isPoliceHQCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-yellow-600 rounded-full"></div>
                  )}
                  <span className="text-yellow-800">Police HQ Deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-6xl">
            {/* 标题 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Current Situation Report</h1>
                  <p className="text-gray-600">Comprehensive analysis of city status and policy effectiveness</p>
                </div>
              </div>
            </div>

            {/* 游戏状态概览 */}
            {gameState && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Crime Rate</span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{gameState.crimeRate}%</div>
                  <div className="text-xs text-gray-500 mt-1">Target: &lt; 30%</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{gameState.arrestAccuracy}%</div>
                  <div className="text-xs text-gray-500 mt-1">Target: &gt; 60%</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Trust</span>
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold text-pink-600">{gameState.communityTrust}%</div>
                  <div className="text-xs text-gray-500 mt-1">Target: &gt; 40%</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Resources</span>
                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{gameState.resources}/10</div>
                  <div className="text-xs text-gray-500 mt-1">Round {gameState.round}</div>
                </div>
              </div>
            )}

            {/* 部署状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Data Center 状态 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Server className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Data Center</h2>
                    <p className="text-sm text-gray-600">AI Model Deployment</p>
                  </div>
                  {isDataCenterCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                  )}
                </div>
                {isDataCenterCompleted ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">Deployed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dataset:</span>
                      <span className="font-semibold text-gray-900">
                        {(() => {
                          const datasetStr = localStorage.getItem('selectedDataset')
                          if (datasetStr) {
                            try {
                              const dataset = JSON.parse(datasetStr)
                              return dataset.name || 'Selected'
                            } catch {
                              return 'Selected'
                            }
                          }
                          return 'N/A'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Training Method:</span>
                      <span className="font-semibold text-gray-900">
                        {(() => {
                          const methodStr = localStorage.getItem('selectedMethod')
                          if (methodStr) {
                            try {
                              const method = JSON.parse(methodStr)
                              return method.name || 'Selected'
                            } catch {
                              return 'Selected'
                            }
                          }
                          return 'N/A'
                        })()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not yet deployed</p>
                )}
              </div>

              {/* Police HQ 状态 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Police HQ</h2>
                    <p className="text-sm text-gray-600">Police Strategy Deployment</p>
                  </div>
                  {isPoliceHQCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                  )}
                </div>
                {isPoliceHQCompleted ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">Deployed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strategy:</span>
                      <span className="font-semibold text-gray-900">
                        {(() => {
                          const strategyStr = localStorage.getItem('policeHQSelectedStrategy')
                          if (strategyStr) {
                            try {
                              const strategy = JSON.parse(strategyStr)
                              return strategy.name || 'Selected'
                            } catch {
                              return 'Selected'
                            }
                          }
                          return 'N/A'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effectiveness:</span>
                      <span className="font-semibold text-blue-600">Active</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not yet deployed</p>
                )}
              </div>
            </div>

            {/* 综合分析 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Comprehensive Analysis
              </h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Based on the deployed Data Center AI model and Police HQ strategy, the city's security and governance systems are now operational. 
                    The integration of AI-powered analysis with strategic police deployment has created a comprehensive approach to urban safety management.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Metrics</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Crime rate monitoring and prediction systems are active</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Police resources are strategically allocated based on data insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Community trust and engagement metrics are being tracked</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Continue monitoring the effectiveness of deployed systems and adjust strategies as needed. 
                    Regular review of crime patterns, community feedback, and system performance will help optimize outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

