import { useState, useEffect } from 'react'
import { Book, FileText, X } from 'lucide-react'

// Types (Move to global types later)
export interface Concept {
  id: string
  title: string
  description: string
  category: string
  unlockedAt: string
}

export interface Clue {
  id: string
  title: string
  content: string
  regionId: string
  timestamp: string
}

import { InvestigationReportData } from '../../types/rpg'

interface PDAOverlayProps {
  isOpen: boolean
  onClose: () => void
  activeTab?: 'journal' | 'encyclopedia' | 'reports'
  concepts: Concept[]
  clues: Clue[]
  reports: InvestigationReportData[]
  onReportSelect?: (report: InvestigationReportData) => void
}

export function PDAOverlay({
  isOpen,
  onClose,
  activeTab = 'journal',
  concepts,
  clues,
  reports = [],
  onReportSelect
}: PDAOverlayProps) {
  const [currentTab, setCurrentTab] = useState<'journal' | 'encyclopedia' | 'reports'>(activeTab)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Sync tab state when overlay opens
  useEffect(() => {
     if (isOpen) {
         setCurrentTab(activeTab)
         setSelectedItem(null)
     }
  }, [isOpen, activeTab])

  if (!isOpen) return null

  const renderJournal = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="border-r border-white/10 pr-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-blue-400 mb-4 sticky top-0 bg-gray-900 py-2">Collected Clues</h3>
        <div className="space-y-2">
          {clues.length === 0 ? (
            <p className="text-gray-500 italic">No clues collected yet.</p>
          ) : (
            clues.map(clue => (
              <button
                key={clue.id}
                onClick={() => setSelectedItem(clue.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedItem === clue.id 
                    ? 'bg-blue-900/30 border-blue-500/50' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-gray-200">{clue.title}</div>
                <div className="text-xs text-gray-500 mt-1">{clue.regionId} • {clue.timestamp}</div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="pl-4 h-full overflow-y-auto">
        {selectedItem && clues.find(c => c.id === selectedItem) ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{clues.find(c => c.id === selectedItem)?.title}</h2>
            <div className="w-full h-px bg-white/10 mb-4" />
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {clues.find(c => c.id === selectedItem)?.content}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Select a clue to view details
          </div>
        )}
      </div>
    </div>
  )

  const renderEncyclopedia = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="border-r border-white/10 pr-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-purple-400 mb-4 sticky top-0 bg-gray-900 py-2">Data Related Concepts</h3>
        <div className="space-y-2">
          {concepts.length === 0 ? (
            <p className="text-gray-500 italic">No concept collected yet.</p>
          ) : (
            concepts.map(concept => (
              <button
                key={concept.id}
                onClick={() => setSelectedItem(concept.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedItem === concept.id 
                    ? 'bg-purple-900/30 border-purple-500/50' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-gray-200">{concept.title}</div>
                <div className="text-xs text-purple-400/60 mt-1">{concept.category}</div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="pl-4 h-full overflow-y-auto">
        {selectedItem && concepts.find(c => c.id === selectedItem) ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{concepts.find(c => c.id === selectedItem)?.title}</h2>
            <span className="inline-block px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded mb-4">
              {concepts.find(c => c.id === selectedItem)?.category}
            </span>
            <div className="w-full h-px bg-white/10 mb-4" />
            <p className="text-gray-300 leading-relaxed">
              {concepts.find(c => c.id === selectedItem)?.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Select a concept to learn more
          </div>
        )}
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="border-r border-white/10 pr-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-green-400 mb-4 sticky top-0 bg-gray-900 py-2">Investigation Reports</h3>
        <div className="space-y-2">
          {reports.length === 0 ? (
            <p className="text-gray-500 italic">No reports filed yet.</p>
          ) : (
            reports.map(report => (
              <button
                key={report.fileId}
                onClick={() => onReportSelect?.(report)}
                className="w-full text-left p-3 rounded-lg transition-colors border bg-white/5 border-transparent hover:bg-white/10 group"
              >
                <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-200">{report.fileId}</div>
                    <span className="text-xs text-green-400 font-mono">COMPLETED</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{report.region} • {report.date}</div>
                <div className="text-sm text-gray-400 mt-2 truncate w-full opacity-60 group-hover:opacity-100 transition-opacity">
                    {report.question}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="pl-4 h-full flex items-center justify-center text-gray-600">
         Select a report to open full view
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[80vh] bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181a20] border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-white tracking-widest">PDA <span className="text-blue-500">SYSTEM</span></div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#131519] border-b border-white/5">
          <button
            onClick={() => { setCurrentTab('journal'); setSelectedItem(null) }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-colors ${
              currentTab === 'journal' 
                ? 'bg-[#0f1115] text-blue-400 border-t-2 border-blue-400' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            JOURNAL
          </button>
          <button
            onClick={() => { setCurrentTab('encyclopedia'); setSelectedItem(null) }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-colors ${
              currentTab === 'encyclopedia' 
                ? 'bg-[#0f1115] text-purple-400 border-t-2 border-purple-400' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <Book className="w-4 h-4" />
            ENCYCLOPEDIA
          </button>
          <button
            onClick={() => { setCurrentTab('reports'); setSelectedItem(null) }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-colors ${
              currentTab === 'reports' 
                ? 'bg-[#0f1115] text-green-400 border-t-2 border-green-400' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            REPORTS
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {currentTab === 'journal' && renderJournal()}
          {currentTab === 'encyclopedia' && renderEncyclopedia()}
          {currentTab === 'reports' && renderReports()}
        </div>
      </div>
    </div>
  )
}
