import { useState, useEffect } from 'react'
import { Book, FileText, X, Star } from 'lucide-react'

import { Concept, Clue, InvestigationReportData } from '../../types/rpg'

interface PDAOverlayProps {
  isOpen: boolean
  onClose: () => void
  activeTab?: 'journal' | 'encyclopedia' | 'reports'
  concepts: Concept[]
  clues: Clue[]
  reports: InvestigationReportData[]
  onReportSelect?: (report: InvestigationReportData) => void
  onMarkAsRead: (type: 'journal' | 'encyclopedia' | 'reports', id: string) => void
  activeItemId?: string | null
}

export function PDAOverlay({
  isOpen,
  onClose,
  activeTab = 'journal',
  concepts,
  clues,
  reports = [],
  onReportSelect,
  onMarkAsRead,
  activeItemId
}: PDAOverlayProps) {
  const [currentTab, setCurrentTab] = useState<'journal' | 'encyclopedia' | 'reports'>(activeTab)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Sync tab state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setCurrentTab(activeTab)
      setSelectedItem(activeItemId || null)
    }
  }, [isOpen, activeTab, activeItemId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="text-xl font-black text-gray-900 tracking-widest uppercase">PDA <span className="text-purple-600">Archive</span></div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-purple-600 transition-colors shadow-sm bg-white border border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 border-b border-gray-200 p-2 gap-2">
          <button
            onClick={() => { setCurrentTab('journal'); setSelectedItem(null) }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all ${currentTab === 'journal'
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border border-transparent'
              }`}
          >
            <FileText className="w-4 h-4" />
            JOURNAL
          </button>
          <button
            onClick={() => { setCurrentTab('encyclopedia'); setSelectedItem(null) }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all ${currentTab === 'encyclopedia'
              ? 'bg-white text-purple-600 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border border-transparent'
              }`}
          >
            <Book className="w-4 h-4" />
            ENCYCLOPEDIA
          </button>
          <button
            onClick={() => { setCurrentTab('reports'); setSelectedItem(null) }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all ${currentTab === 'reports'
              ? 'bg-white text-green-600 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border border-transparent'
              }`}
          >
            <FileText className="w-4 h-4" />
            REPORTS
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden bg-white">
          {currentTab === 'journal' && <JournalTab clues={clues} selectedItem={selectedItem} setSelectedItem={setSelectedItem} onMarkAsRead={onMarkAsRead} />}
          {currentTab === 'encyclopedia' && <EncyclopediaTab concepts={concepts} selectedItem={selectedItem} setSelectedItem={setSelectedItem} onMarkAsRead={onMarkAsRead} />}
          {currentTab === 'reports' && <ReportsTab reports={reports} onReportSelect={onReportSelect} onMarkAsRead={onMarkAsRead} />}
        </div>
      </div>
    </div>
  )
}

function JournalItemButton({ clue, selectedItem, setSelectedItem, onMarkAsRead }: any) {
  return (
    <button
      onClick={() => {
        setSelectedItem(clue.id)
        if (!clue.isRead) onMarkAsRead('journal', clue.id)
      }}
      className={`w-full text-left p-4 rounded-xl transition-colors border ${selectedItem === clue.id
        ? 'bg-blue-50 border-blue-200 shadow-sm'
        : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
        } relative`}
    >
      <div className="flex justify-between items-start">
        <div className={`font-bold ${selectedItem === clue.id ? 'text-blue-900' : 'text-gray-900'}`}>{clue.title}</div>
        {!clue.isRead && <Star className="w-4 h-4 text-blue-500 fill-blue-500 animate-pulse flex-shrink-0" />}
      </div>
      <div className="text-xs font-mono text-gray-500 mt-2 uppercase">{clue.regionId} • {clue.timestamp}</div>
    </button>
  )
}

function JournalTab({ clues, selectedItem, setSelectedItem, onMarkAsRead }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 h-full">
      <div className="border-r border-gray-100 pr-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 sticky top-0 bg-white py-3 pl-1 z-10 border-b border-gray-100">Collected Clues</h3>
        <div className="space-y-3 pb-4">
          {clues.length === 0 ? (
            <p className="text-gray-400 italic font-medium px-2">No clues collected yet.</p>
          ) : (
            clues.map((clue: any) => (
              <JournalItemButton key={clue.id} clue={clue} selectedItem={selectedItem} setSelectedItem={setSelectedItem} onMarkAsRead={onMarkAsRead} />
            ))
          )}
        </div>
      </div>
      <div className="pl-2 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {selectedItem && clues.find((c: any) => c.id === selectedItem) ? (
          <div className="pr-4 py-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{clues.find((c: any) => c.id === selectedItem)?.title}</h2>
            <div className="w-full h-px bg-gray-100 mb-6" />
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {clues.find((c: any) => c.id === selectedItem)?.content}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FileText className="w-12 h-12 mb-4 text-gray-200" />
            <span className="font-bold text-sm tracking-widest uppercase">Select a clue to view details</span>
          </div>
        )}
      </div>
    </div>
  )
}

function EncyclopediaItemButton({ concept, selectedItem, setSelectedItem, onMarkAsRead }: any) {
  return (
    <button
      onClick={() => {
        setSelectedItem(concept.id)
        if (!concept.isRead) onMarkAsRead('encyclopedia', concept.id)
      }}
      className={`w-full text-left p-4 rounded-xl transition-colors border ${selectedItem === concept.id
        ? 'bg-purple-50 border-purple-200 shadow-sm'
        : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
        } relative`}
    >
      <div className="flex justify-between items-start">
        <div className={`font-bold ${selectedItem === concept.id ? 'text-purple-900' : 'text-gray-900'}`}>{concept.title}</div>
        {!concept.isRead && <Star className="w-4 h-4 text-purple-500 fill-purple-500 animate-pulse flex-shrink-0" />}
      </div>
      <div className="text-xs font-bold tracking-widest uppercase text-purple-500 mt-2">{concept.category.replace('_', ' ')}</div>
    </button>
  )
}

function EncyclopediaTab({ concepts, selectedItem, setSelectedItem, onMarkAsRead }: any) {
  const gameConcepts = concepts.filter((c: any) =>
    ['concept_event', 'concept_investigate', 'concept_action'].includes(c.id)
  )
  const dataConcepts = concepts.filter((c: any) =>
    !['concept_event', 'concept_investigate', 'concept_action'].includes(c.id)
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 h-full">
      <div className="border-r border-gray-100 pr-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {gameConcepts.length > 0 && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-4 sticky top-0 bg-white py-3 pl-1 z-10 border-b border-gray-100">Game Concepts</h3>
            <div className="space-y-3 mb-8">
              {gameConcepts.map((concept: any) => (
                <EncyclopediaItemButton key={concept.id} concept={concept} selectedItem={selectedItem} setSelectedItem={setSelectedItem} onMarkAsRead={onMarkAsRead} />
              ))}
            </div>
          </>
        )}

        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-4 sticky top-0 bg-white py-3 pl-1 z-10 border-b border-gray-100">Data Related Concepts</h3>
        <div className="space-y-3 pb-4">
          {dataConcepts.length === 0 ? (
            <p className="text-gray-400 italic font-medium px-2">No concepts collected yet.</p>
          ) : (
            dataConcepts.map((concept: any) => (
              <EncyclopediaItemButton key={concept.id} concept={concept} selectedItem={selectedItem} setSelectedItem={setSelectedItem} onMarkAsRead={onMarkAsRead} />
            ))
          )}
        </div>
      </div>
      <div className="pl-2 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {selectedItem && concepts.find((c: any) => c.id === selectedItem) ? (
          <div className="pr-4 py-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{concepts.find((c: any) => c.id === selectedItem)?.title}</h2>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest rounded-md mb-6">
              {concepts.find((c: any) => c.id === selectedItem)?.category.replace('_', ' ')}
            </span>
            <div className="w-full h-px bg-gray-100 mb-6" />
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {concepts.find((c: any) => c.id === selectedItem)?.description}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Book className="w-12 h-12 mb-4 text-gray-200" />
            <span className="font-bold text-sm tracking-widest uppercase">Select a concept to learn more</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportItemButton({ report, onReportSelect, onMarkAsRead }: any) {
  return (
    <button
      onClick={() => {
        onReportSelect?.(report)
        if (!report.isRead) onMarkAsRead('reports', report.fileId)
      }}
      className="w-full text-left p-4 rounded-xl transition-all border bg-white border-gray-100 hover:bg-green-50 hover:border-green-200 shadow-sm group relative"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="font-bold text-gray-900">{report.question}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!report.isRead && <Star className="w-4 h-4 text-green-500 fill-green-500 animate-pulse" />}
          <span className="px-2 py-0.5 bg-green-100 text-[10px] text-green-700 font-bold tracking-wider rounded border border-green-200">COMPLETED</span>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 truncate w-full">
        {report.region}
        <div className="text-xs font-mono text-gray-400 mt-2 uppercase">{report.fileId} • {report.date}</div>
      </div>
    </button>
  )
}

function ReportsTab({ reports, onReportSelect, onMarkAsRead }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 h-full">
      <div className="border-r border-gray-100 pr-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4 sticky top-0 bg-white py-3 pl-1 z-10 border-b border-gray-100">Investigation Reports</h3>
        <div className="space-y-3 pb-4">
          {reports.length === 0 ? (
            <p className="text-gray-400 italic font-medium px-2">No reports filed yet.</p>
          ) : (
            reports.map((report: any) => (
              <ReportItemButton key={report.fileId} report={report} onReportSelect={onReportSelect} onMarkAsRead={onMarkAsRead} />
            ))
          )}
        </div>
      </div>
      <div className="pl-2 h-full flex flex-col items-center justify-center text-gray-400">
        <FileText className="w-12 h-12 mb-4 text-gray-200" />
        <span className="font-bold text-sm tracking-widest uppercase">Select a report to open full view</span>
      </div>
    </div>
  )
}
