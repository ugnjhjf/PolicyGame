import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* 左侧大图片 */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
              <Image
                src="/Introduction.png"
                alt="Predictive Policing Simulation - Office with city view"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

           {/* 右侧文字介绍 */}
           <div className="w-full lg:w-1/2 space-y-8">
             <div className="space-y-6">
               <div>
                 <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-2">
                   AI Police Strategist
                 </h1>
                 <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
               </div>
               
               <div className="space-y-4">
                 <p className="text-xl text-foreground font-medium">
                   Train AI models, shape policing strategies
                 </p>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   Navigate the intersection of technology and policy. Train intelligent systems, make critical decisions, and balance effective policing with community trust.
                 </p>
                 
                 <div className="flex flex-wrap gap-3">
                   <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">🤖 AI Training</span>
                   <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">📊 Data Analysis</span>
                   <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">🤝 Community Trust</span>
                 </div>
               </div>
             </div>

             {/* Start Button */}
             <div className="flex justify-end">
               <Link href="/game">
                 <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                   <span className="text-lg font-semibold">Start Challenge</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
