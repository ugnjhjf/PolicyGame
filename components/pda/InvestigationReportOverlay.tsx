import { X, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import ReactECharts from 'echarts-for-react';

import { InvestigationReportData } from '../../types/rpg'

interface InvestigationReportOverlayProps {
    isOpen: boolean
    onClose: () => void
    data: InvestigationReportData | null
    onNext?: () => void
    onPrev?: () => void
    hasNext?: boolean
    hasPrev?: boolean
}

export function InvestigationReportOverlay({
    isOpen,
    onClose,
    data,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}: InvestigationReportOverlayProps) {
    if (!isOpen || !data) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300 p-4 lg:p-12">

            {/* Wrapper for layout: Prev - Content - Next */}
            <div className="flex items-center justify-center w-full max-w-[90rem] gap-4">

                {/* Prev Button */}
                <div className="shrink-0 w-16 flex justify-end">
                    {hasPrev && (
                        <button
                            onClick={onPrev}
                            className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 transition-all shadow-md flex items-center justify-center group hover:scale-110 hover:border-purple-300"
                            title="Previous Report"
                        >
                            <div className="border-t-2 border-l-2 border-gray-600 w-3 h-3 -rotate-45 translate-x-0.5 group-hover:border-purple-600 transition-colors" />
                        </button>
                    )}
                </div>

                <div className="relative w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <ReportHeader onClose={onClose} />

                    {/* Main Content Area - Scrollable */}
                    <div className="flex-1 overflow-auto p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-400 transition-colors bg-white">
                        <div className={`grid gap-8 ${data.chart ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

                            {/* Left Column: Text Data */}
                            <TextDataColumn data={data} />

                            {data.chart && (
                                <ChartArea chart={data.chart} />
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-full font-bold text-sm tracking-wide transition-all shadow-md active:scale-95"
                        >
                            CLOSE RECORD
                        </button>
                    </div>

                </div>

                {/* Next Button */}
                <div className="shrink-0 w-16 flex justify-start">
                    {hasNext && (
                        <button
                            onClick={onNext}
                            className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 transition-all shadow-md flex items-center justify-center group hover:scale-110 hover:border-purple-300"
                            title="Next Report"
                        >
                            <div className="border-t-2 border-r-2 border-gray-600 w-3 h-3 rotate-45 -translate-x-0.5 group-hover:border-purple-600 transition-colors" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function ReportHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-purple-50 px-8 py-5 border-b border-purple-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-950 tracking-wide uppercase">Investigation Report</h2>
            </div>
            <button onClick={onClose} className="text-purple-400 hover:text-purple-700 transition-colors">
                <X className="w-8 h-8" />
            </button>
        </div>
    )
}

function MetadataGrid({ data }: { data: InvestigationReportData }) {
    return (
        <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">File ID</span>
                <p className="text-gray-900 font-mono font-medium mt-1">{data.fileId}</p>
            </div>
            <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</span>
                <p className="text-gray-900 font-mono font-medium mt-1">{data.date}</p>
            </div>
            <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Region</span>
                <p className="text-gray-900 font-medium mt-1">{data.region}</p>
            </div>
            <div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</span>
                <div className="inline-flex mt-1 items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                    <CheckCircle className="w-3.5 h-3.5" /> COMPLETED
                </div>
            </div>
        </div>
    )
}

function TextDataColumn({ data }: { data: InvestigationReportData }) {
    return (
        <div className="space-y-8">
            <MetadataGrid data={data} />

            {/* Core Questions */}
            <div>
                <h3 className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3">Investigation Subject</h3>
                <p className="text-lg text-gray-900 font-medium border-l-4 border-purple-500 pl-4 py-1">
                    {data.question}
                </p>
            </div>

            {/* Findings */}
            <div>
                <h3 className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3">Analysis Findings</h3>
                <div className="bg-white p-6 text-base rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 shadow-sm font-medium">
                    {data.content}
                </div>
            </div>
        </div>
    )
}

function PieChartSection({ chart }: { chart: NonNullable<InvestigationReportData['chart']> }) {
    const chartData = chart.labels.map((label, index) => ({
        value: chart.datasets[0].values[index],
        name: label
    }));

    const option = {
        ...(chart.colors && { color: chart.colors }),
        textStyle: {
            fontFamily: "var(--font-inter), sans-serif"
        },
        title: {
            text: "",
            left: 'center',
            textStyle: {
                color: '#6b7280', // gray-500
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "var(--font-inter), sans-serif"
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: `{a} <br/>{b}: {c}${chart.valueSuffix ?? '%'}`,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e5e7eb', // gray-200
            borderWidth: 1,
            textStyle: {
                color: '#111827', // gray-900
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14
            }
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            textStyle: {
                color: '#4b5563', // gray-600
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 14
            }
        },
        series: [
            {
                name: chart.title,
                type: 'pie',
                radius: '60%',
                data: chartData,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    color: '#374151', // gray-700
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    fontWeight: 600
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        ]
    };

    return (
        <div className="flex-1 flex items-center justify-center w-full h-full min-h-[300px]">
            <ReactECharts option={option} style={{ width: '100%', height: '100%', minHeight: '350px' }} />
        </div>
    );
}

function BarChartSection({ chart }: { chart: NonNullable<InvestigationReportData['chart']> }) {
    return (
        <>
            <div className="flex-1 flex justify-around gap-6 mb-4 px-4 mt-4">
                {chart.labels.map((label, i) => (
                    <BarChartColumn key={label} label={label} index={i} chart={chart} />
                ))}
            </div>

            <BarChartLegend chart={chart} />
        </>
    );
}

function BarChartColumn({ label, index, chart }: { label: string, index: number, chart: NonNullable<InvestigationReportData['chart']> }) {
    return (
        <div className="flex flex-col items-center gap-3 group w-full h-full justify-end">
            <div className="flex gap-2 items-end flex-1 w-full justify-center">
                {chart.datasets.map((dataset, dsIndex) => (
                    <BarChartItem key={`${label}-${dsIndex}`} dataset={dataset} index={index} dsIndex={dsIndex} suffix={chart.valueSuffix} />
                ))}
            </div>
            <span className="text-xs text-gray-500 font-bold uppercase">{label}</span>
        </div>
    )
}

function BarChartItem({ dataset, index, dsIndex, suffix }: { dataset: { label: string, values: number[], style: 'solid' | 'striped' }, index: number, dsIndex: number, suffix: string | undefined }) {
    const value = dataset.values[index]
    const isStriped = dataset.style === 'striped'
    const barColorBase = dsIndex === 0 ? 'bg-indigo-400' : 'bg-rose-400' // vibrant colors instead of red/gray

    return (
        <div
            className={`w-8 sm:w-12 transition-all relative rounded-t-md ${isStriped ? '' : barColorBase}`}
            style={{
                height: `${value}%`,
                background: isStriped
                    ? `repeating-linear-gradient(45deg, #fb7185, #fb7185 4px, #e11d48 4px, #e11d48 8px)`
                    : undefined
            }}
        >
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-bold bg-white px-2 py-0.5 rounded-md shadow border border-gray-100 whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {value}{suffix ?? '%'}
            </span>
        </div>
    )
}

function BarChartLegend({ chart }: { chart: NonNullable<InvestigationReportData['chart']> }) {
    return (
        <div className="flex justify-center gap-8 pt-6 border-t border-gray-100">
            {chart.datasets.map((dataset, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div
                        className={`w-4 h-4 rounded-md ${dataset.style === 'solid' ? (i === 0 ? 'bg-indigo-400' : 'bg-rose-400') : ''}`}
                        style={{
                            background: dataset.style === 'striped'
                                ? `repeating-linear-gradient(45deg, #fb7185, #fb7185 2px, #e11d48 2px, #e11d48 4px)`
                                : undefined
                        }}
                    />
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{dataset.label}</span>
                </div>
            ))}
        </div>
    )
}

function ChartArea({ chart }: { chart: NonNullable<InvestigationReportData['chart']> }) {
    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col h-full min-h-[400px]">
            <h4 className="text-xs text-purple-500 uppercase font-bold tracking-widest mb-2 text-center">{chart.title}</h4>
            {chart.type === 'pie' ? <PieChartSection chart={chart} /> : <BarChartSection chart={chart} />}
        </div>
    );
}
