'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, BookOpen, User, MapPin, Clock } from 'lucide-react'
import AnimatedButton from '../../components/AnimatedButton'
import styles from '../../styles/animations.module.css'

export default function StoryPage() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleContinue = () => {
    setIsAnimating(true)
    setTimeout(() => {
      // 跳转到下一个页面（后续会实现）
      window.location.href = '/game'
    }, 300)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              setIsAnimating(true)
              setTimeout(() => {
                window.location.href = '/'
              }, 300)
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>故事背景</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              智能警务战略家
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              在科技与政策的交汇点，做出关键决策，训练智能系统，平衡有效执法与社区信任
            </p>
          </div>

          {/* 主要内容区域 */}
          <div className="space-y-8 mb-12">
            {/* 故事背景 - 长方形 */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">故事背景</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  在2025年的未来都市，人工智能技术已经深度融入警务系统。作为城市警务部门的战略决策者，您面临着前所未有的挑战和机遇。
                </p>
                <p>
                  城市犯罪率持续波动，社区对AI辅助执法的信任度成为关键因素。您需要不断训练和优化AI模型，使其能够准确预测犯罪，同时维护社区的信任和支持。
                </p>
                <p>
                  每一次数据选择、每一次训练方法的选择、每一次部署决策，都将影响城市的治安状况和社区关系。您的目标是在有效执法与社区信任之间找到最佳平衡点。
                </p>
              </div>
            </div>

            {/* 玩家身份 - 在故事背景下面 */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">您的身份</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">职位</span>
                  </div>
                  <p className="text-gray-700 ml-5">城市警务部门AI战略总监</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">职责</span>
                  </div>
                  <p className="text-gray-700 ml-5">负责AI模型的训练、部署和优化，制定警务策略，维护社区关系</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">资源</span>
                  </div>
                  <p className="text-gray-700 ml-5">拥有有限的资源和行动点数，需要谨慎分配</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">目标</span>
                  </div>
                  <p className="text-gray-700 ml-5">降低犯罪率，提高逮捕准确率，维护社区信任度</p>
                </div>
              </div>
            </div>

            {/* 核心挑战 - 四个长方形框，一行一个 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">核心挑战</h3>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">平衡AI模型的准确性与公平性</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">维护社区对AI执法的信任</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">在资源有限的情况下做出最优决策</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">应对不断变化的犯罪模式和社区需求</span>
                </div>
              </div>
            </div>
          </div>

          {/* 继续按钮 */}
          <div className="flex justify-center">
            <AnimatedButton href="/game">
              <span className="text-lg font-semibold">开始游戏</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  )
}

