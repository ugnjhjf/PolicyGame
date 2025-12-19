import { X, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import ReactECharts from 'echarts-for-react';


import { InvestigationReportData } from '../../types/rpg'

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
            <div className="relative w-full max-w-6xl mx-8 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-blue-900/50 px-8 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white tracking-wide">INVESTIGATION REPORT</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-auto p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-blue-900/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-600 transition-colors">
                    <div className={`grid gap-8 ${data.chart ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

                        {/* Left Column: Text Data */}
                        <div className="space-y-6">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
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

                        {data.chart && (
                            <div className="bg-black/40 p-6 rounded-lg border border-white/5 flex flex-col h-full min-h-[400px]">
                                <h4 className="text-sm text-blue-300 uppercase font-semibold mb-6 text-center tracking-wider">{data.chart.title}</h4>

                                {data.chart.type === 'pie' ? (
                                    <div className="flex-1 flex items-center justify-center w-full h-full min-h-[300px]">
                                        {(() => {
                                            const chartData = data.chart!.labels.map((label, index) => ({
                                                value: data.chart!.datasets[0].values[index],
                                                name: label
                                            }));

                                            const option = {
                                                ...(data.chart!.colors && { color: data.chart!.colors }), // Only apply if defined
                                                textStyle: {
                                                    fontFamily: "var(--font-inter), sans-serif"
                                                },
                                                title: {
                                                    text: "",
                                                    left: 'center',
                                                    textStyle: {
                                                        color: '#93c5fd', // blue-300
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        fontFamily: "var(--font-inter), sans-serif"
                                                    }
                                                },
                                                tooltip: {
                                                    trigger: 'item',
                                                    formatter: `{a} <br/>{b}: {c}${data.chart!.valueSuffix ?? '%'}`,
                                                    textStyle: {
                                                        fontFamily: "var(--font-inter), sans-serif",
                                                        fontSize: 18
                                                    }
                                                },
                                                legend: {
                                                    orient: 'vertical',
                                                    left: 'right',
                                                    textStyle: {
                                                        color: '#ffffff',
                                                        fontFamily: "var(--font-inter), sans-serif",
                                                        fontSize: 18
                                                    }
                                                },
                                                series: [
                                                    {
                                                        name: data.chart!.title,
                                                        type: 'pie',
                                                        radius: '50%',
                                                        data: chartData,
                                                        label: {
                                                            color: '#ffffff',
                                                            fontFamily: "var(--font-inter), sans-serif",
                                                            fontSize: 15
                                                        },
                                                        emphasis: {
                                                            itemStyle: {
                                                                shadowBlur: 10,
                                                                shadowOffsetX: 0,
                                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                            }
                                                        }
                                                    }
                                                ]
                                            };

                                            return <ReactECharts option={option} style={{ width: '100%', height: '100%', minHeight: '350px' }} />;
                                        })()}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 flex justify-around gap-6 mb-4 px-4">
                                            {data.chart.labels.map((label, i) => (
                                                <div key={label} className="flex flex-col items-center gap-3 group w-full h-full justify-end">
                                                    <div className="flex gap-2 items-end flex-1 w-full justify-center">
                                                        {data.chart!.datasets.map((dataset, dsIndex) => {
                                                            const value = dataset.values[i]
                                                            const isStriped = dataset.style === 'striped'
                                                            // 0: Actual=Gray, 1: Predicted=Red
                                                            const barColorBase = dsIndex === 0 ? 'bg-gray-400' : 'bg-red-500'

                                                            return (
                                                                <div
                                                                    key={`${label}-${dsIndex}`}
                                                                    className={`w-8 sm:w-10 transition-all relative rounded-t-sm ${isStriped ? '' : barColorBase}`}
                                                                    style={{
                                                                        height: `${value}%`,
                                                                        background: isStriped
                                                                            ? `repeating-linear-gradient(45deg, #ef4444, #ef4444 4px, #7f1d1d 4px, #7f1d1d 8px)`
                                                                            : undefined
                                                                    }}
                                                                >
                                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-bold bg-black/80 px-2 py-1 rounded whitespace-nowrap z-10">
                                                                        {value}{data.chart!.valueSuffix ?? '%'}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <span className="text-sm text-gray-400 font-mono font-medium">{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Legend */}
                                        <div className="flex justify-center gap-8 pt-6 border-t border-white/5">
                                            {data.chart.datasets.map((dataset, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div
                                                        className={`w-4 h-4 rounded-sm ${dataset.style === 'solid' ? 'bg-gray-400' : ''}`}
                                                        style={{
                                                            background: dataset.style === 'striped'
                                                                ? `repeating-linear-gradient(45deg, #ef4444, #ef4444 2px, #7f1d1d 2px, #7f1d1d 4px)`
                                                                : undefined
                                                        }}
                                                    />
                                                    <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">{dataset.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-black/60 border-t border-white/10 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold tracking-wide transition-colors"
                    >
                        CLOSE RECORD
                    </button>
                </div>

            </div>
        </div>
    )
}
