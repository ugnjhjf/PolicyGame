'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from '../styles/animations.module.css'

interface AnimatedButtonProps {
  href: string
  children: React.ReactNode
}

export default function AnimatedButton({ href, children }: AnimatedButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 ${styles.shadowOptimized} ${styles.gpuAccelerated}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "tween", 
          duration: 0.15,
          ease: "easeOut"
        }}
      >
        {children}
        <ArrowRight className={`w-5 h-5 ${styles.iconAnimation}`} />
      </motion.button>
    </Link>
  )
}
