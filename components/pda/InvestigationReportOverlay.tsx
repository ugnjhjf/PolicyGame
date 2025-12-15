import { X, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export interface InvestigationReportData {
  question: string
  region: string
  date: string
  fileId: string
  content: string
  suggestion: string
}

interface InvestigationReportOverlayProps {
  isOpen: boolean
  onClose: () => void
  data: InvestigationReportData | null
}

export function InvestigationReportOverlay({
  isOpen,
  onClose,
  data
}: InvestigationReportOverlayProps) {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900/50 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <FileText className="w-6 h-6 text-blue-400" />
             <h2 className="text-xl font-bold text-white tracking-wide">INVESTIGATION REPORT</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
           {/* Metadata Grid */}
           <div className="grid grid-cols-2 gap-6 p-4 bg-black/40 rounded-lg border border-white/5">
              <div>
                <span className="text-xs text-blue-300 uppercase font-semibold">File ID</span>
                <p className="text-white font-mono">{data.fileId}</p>
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase font-semibold">Date</span>
                <p className="text-white font-mono">{data.date}</p>
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase font-semibold">Region</span>
                <p className="text-white">{data.region}</p>
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase font-semibold">Status</span>
                <p className="text-green-400 flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> COMPLETED
                </p>
              </div>
           </div>

           {/* Core Questions */}
           <div>
              <h3 className="text-sm text-gray-400 uppercase font-bold mb-2">Investigation Subject</h3>
              <p className="text-lg text-white font-medium border-l-4 border-blue-500 pl-4">
                 {data.question}
              </p>
           </div>

           {/* Findings */}
           <div>
              <h3 className="text-sm text-gray-400 uppercase font-bold mb-2">Analysis Findings</h3>
              <div className="bg-gray-800/50 p-4 rounded-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
                 {data.content}
              </div>
           </div>

           {/* Suggestion */}
           <div>
               <h3 className="text-sm text-yellow-500 uppercase font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> System Recommendation
               </h3>
               <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg text-yellow-100 font-medium">
                  {data.suggestion}
               </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/60 border-t border-white/10 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
            >
              Close Record
            </button>
        </div>

      </div>
    </div>
  )
}
