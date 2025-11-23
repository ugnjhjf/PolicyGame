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
        // Navigate to the next page
        window.location.href = '/game'
      }, 300)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${isAnimating ? styles.slideOutToLeft : styles.slideInFromRight}`}>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Back Button */}
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
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Story Background</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Intelligent Policing Strategist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              At the intersection of technology and policy, make critical decisions, train intelligent systems, and balance effective law enforcement with community trust
            </p>
          </div>

          {/* Main Content Section */}
          <div className="space-y-8 mb-12">
            {/* Story Background - Rectangle Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Story Background</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  In the futuristic city of 2025, artificial intelligence technology has been deeply integrated into the policing system. As a strategic decision-maker for the city's police department, you face unprecedented challenges and opportunities.
                </p>
                <p>
                  Urban crime rates continue to fluctuate, and community trust in AI-assisted law enforcement has become a critical factor. You need to continuously train and optimize AI models to accurately predict crime while maintaining community trust and support.
                </p>
                <p>
                  Every data selection, every training method choice, and every deployment decision will impact the city's public safety and community relations. Your goal is to find the optimal balance between effective law enforcement and community trust.
                </p>
              </div>
            </div>

            {/* Player Role - Below Story Background */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Role</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">Position</span>
                  </div>
                  <p className="text-gray-700 ml-5">AI Strategy Director of City Police Department</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">Responsibilities</span>
                  </div>
                  <p className="text-gray-700 ml-5">Responsible for training, deploying, and optimizing AI models, formulating policing strategies, and maintaining community relations</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">Resources</span>
                  </div>
                  <p className="text-gray-700 ml-5">Have limited resources and action points that need to be allocated carefully</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">Objectives</span>
                  </div>
                  <p className="text-gray-700 ml-5">Reduce crime rates, improve arrest accuracy, and maintain community trust</p>
                </div>
              </div>
            </div>

            {/* Core Challenges - Four rectangular boxes, one per row */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Challenges</h3>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">Balance AI model accuracy with fairness</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">Maintain community trust in AI-assisted law enforcement</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">Make optimal decisions with limited resources</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-4 lg:p-6 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-lg">Respond to constantly changing crime patterns and community needs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <AnimatedButton href="/game">
              <span className="text-lg font-semibold">Start Game</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  )
}

