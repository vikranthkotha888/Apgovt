import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, TrendingUp, CheckCircle2, Clock, 
  AlertCircle, ArrowUpRight, Award, ChevronRight, Filter, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export interface PanchayatHealthMetrics {
  id: string;
  name: string;
  mandal: string;
  district: string;
  sarpanch: string;
  // Core Indicators
  budgetUtilizationPct: number;    // % of allocated 15th FC / State grant utilized
  allocatedFundsLakhs: number;
  spentFundsLakhs: number;
  grievanceResolutionSpeedHrs: number; // Avg hours to resolve (SLA is 72 hrs)
  totalGrievances: number;
  resolvedGrievances: number;
  projectCompletionRatePct: number; // % of sanctioned projects completed on time
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  // Composite Score (0 - 100)
  overallHealthScore: number;
  grade: 'A+' | 'A' | 'B' | 'C';
}

export const PANCHAYAT_HEALTH_DATA: PanchayatHealthMetrics[] = [
  {
    id: 'pan-01',
    name: 'Pedaparimi Gram Panchayat',
    mandal: 'Thullur',
    district: 'Guntur',
    sarpanch: 'K. Venkat Rao',
    budgetUtilizationPct: 88,
    allocatedFundsLakhs: 85,
    spentFundsLakhs: 74.8,
    grievanceResolutionSpeedHrs: 32, // Outstanding speed (well under 72h)
    totalGrievances: 42,
    resolvedGrievances: 39,
    projectCompletionRatePct: 83.3, // 10/12 completed
    totalProjects: 12,
    completedProjects: 10,
    ongoingProjects: 2,
    overallHealthScore: 89,
    grade: 'A+'
  },
  {
    id: 'pan-02',
    name: 'Velagapudi Gram Panchayat',
    mandal: 'Thullur',
    district: 'Guntur',
    sarpanch: 'P. Rajeshwari',
    budgetUtilizationPct: 92,
    allocatedFundsLakhs: 110,
    spentFundsLakhs: 101.2,
    grievanceResolutionSpeedHrs: 28,
    totalGrievances: 55,
    resolvedGrievances: 52,
    projectCompletionRatePct: 86.6, // 13/15 completed
    totalProjects: 15,
    completedProjects: 13,
    ongoingProjects: 2,
    overallHealthScore: 93,
    grade: 'A+'
  },
  {
    id: 'pan-03',
    name: 'Mandadam Gram Panchayat',
    mandal: 'Thullur',
    district: 'Guntur',
    sarpanch: 'M. Padmavathi',
    budgetUtilizationPct: 76,
    allocatedFundsLakhs: 72,
    spentFundsLakhs: 54.7,
    grievanceResolutionSpeedHrs: 46,
    totalGrievances: 31,
    resolvedGrievances: 26,
    projectCompletionRatePct: 77.7, // 7/9 completed
    totalProjects: 9,
    completedProjects: 7,
    ongoingProjects: 2,
    overallHealthScore: 78,
    grade: 'A'
  },
  {
    id: 'pan-04',
    name: 'Undavalli Gram Panchayat',
    mandal: 'Tadepalli',
    district: 'Guntur',
    sarpanch: 'T. Subba Rao',
    budgetUtilizationPct: 81,
    allocatedFundsLakhs: 125,
    spentFundsLakhs: 101.25,
    grievanceResolutionSpeedHrs: 41,
    totalGrievances: 64,
    resolvedGrievances: 56,
    projectCompletionRatePct: 78.5, // 11/14 completed
    totalProjects: 14,
    completedProjects: 11,
    ongoingProjects: 3,
    overallHealthScore: 82,
    grade: 'A'
  },
  {
    id: 'pan-05',
    name: 'Inavolu Gram Panchayat',
    mandal: 'Thullur',
    district: 'Guntur',
    sarpanch: 'B. Srinivas',
    budgetUtilizationPct: 69,
    allocatedFundsLakhs: 64,
    spentFundsLakhs: 44.1,
    grievanceResolutionSpeedHrs: 58,
    totalGrievances: 24,
    resolvedGrievances: 18,
    projectCompletionRatePct: 62.5, // 5/8 completed
    totalProjects: 8,
    completedProjects: 5,
    ongoingProjects: 3,
    overallHealthScore: 68,
    grade: 'B'
  },
  {
    id: 'pan-06',
    name: 'Kollipara Gram Panchayat',
    mandal: 'Kollipara',
    district: 'Guntur',
    sarpanch: 'V. Sambasiva',
    budgetUtilizationPct: 74,
    allocatedFundsLakhs: 95,
    spentFundsLakhs: 70.3,
    grievanceResolutionSpeedHrs: 52,
    totalGrievances: 38,
    resolvedGrievances: 30,
    projectCompletionRatePct: 72.7, // 8/11 completed
    totalProjects: 11,
    completedProjects: 8,
    ongoingProjects: 3,
    overallHealthScore: 74,
    grade: 'B'
  }
];

interface PanchayatHealthIndexWidgetProps {
  initialPanchayatId?: string;
  onSelectPanchayat?: (p: PanchayatHealthMetrics) => void;
}

export const PanchayatHealthIndexWidget: React.FC<PanchayatHealthIndexWidgetProps> = ({
  initialPanchayatId,
  onSelectPanchayat
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialPanchayatId || PANCHAYAT_HEALTH_DATA[0].id
  );

  const selected = PANCHAYAT_HEALTH_DATA.find(p => p.id === selectedId) || PANCHAYAT_HEALTH_DATA[0];

  // Radar / Radial Bar representation for the 3 key KPIs
  const radialData = [
    {
      name: 'Project Completion Rate',
      value: selected.projectCompletionRatePct,
      fill: '#20d8c2' // Cyan
    },
    {
      name: 'Budget Utilization',
      value: selected.budgetUtilizationPct,
      fill: '#219cff' // Blue
    },
    {
      name: 'Grievance Speed Index',
      // Convert hours to a 0-100 efficiency score: 72h SLA -> 72-hours scale (e.g. 24h = 100%, 72h = 50%, >100h = 10%)
      value: Math.min(100, Math.max(10, Math.round(100 - (selected.grievanceResolutionSpeedHrs / 72) * 45))),
      fill: '#18c98b' // Green
    }
  ];

  // Grievance resolution percentage
  const grievanceResolvedPct = Math.round((selected.resolvedGrievances / selected.totalGrievances) * 100);

  return (
    <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163c5e] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c8d78] to-[#075d66] flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(32,216,194,0.25)] flex-none">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                Panchayat Health Index (PHI)
              </span>
              <span className="text-[11px] text-gray-400">KPI Performance Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Gram Panchayat Governance Benchmark
            </h3>
          </div>
        </div>

        {/* Panchayat Dropdown Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-300 hidden sm:inline">Select Panchayat:</span>
          <select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value);
              const found = PANCHAYAT_HEALTH_DATA.find(p => p.id === e.target.value);
              if (found && onSelectPanchayat) onSelectPanchayat(found);
            }}
            className="bg-[#04172c] border border-[#215783] text-xs text-cyan-100 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
          >
            {PANCHAYAT_HEALTH_DATA.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.mandal} Mdl) — {p.grade} ({p.overallHealthScore}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Visualizer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Score Gauge & Grade */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#0a2745] to-[#04172c] border border-[#184268] rounded-2xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              selected.grade === 'A+' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
              selected.grade === 'A' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
              'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              Grade {selected.grade}
            </span>
          </div>

          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">
            Overall Health Index Score
          </span>
          <div className="my-3 flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 font-mono">
              {selected.overallHealthScore}
            </span>
            <span className="text-gray-400 text-sm font-semibold">/100</span>
          </div>

          <p className="text-xs text-gray-300 font-medium">
            {selected.name}
          </p>
          <span className="text-[10px] text-cyan-300/80">
            Sarpanch: {selected.sarpanch} • {selected.mandal} Mandal
          </span>

          <div className="mt-4 pt-3 border-t border-[#163a5c] w-full flex justify-around text-[10px] text-gray-300">
            <div>
              <span className="text-gray-400 block text-[9px]">SLA Compliance</span>
              <b className="text-emerald-400">96.4%</b>
            </div>
            <div className="border-l border-[#193d61] pl-4">
              <span className="text-gray-400 block text-[9px]">Audit Grade</span>
              <b className="text-cyan-300">Excellent</b>
            </div>
          </div>
        </div>

        {/* Center / Right: 3 Key Pillars Detailed Metrics */}
        <div className="lg:col-span-8 space-y-4">
          {/* Pillar 1: Budget Utilization */}
          <div className="bg-[#04172c] border border-[#163e63] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#219cff]" />
                <span className="font-bold text-white">1. Budget & 15th FC Grants Utilization</span>
              </div>
              <b className="text-blue-400 text-sm font-mono">{selected.budgetUtilizationPct}%</b>
            </div>

            <div className="w-full bg-[#0d2a45] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${selected.budgetUtilizationPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
              <span>Sanctioned: <b className="text-white">₹ {selected.allocatedFundsLakhs} Lakhs</b></span>
              <span>Utilized: <b className="text-emerald-400">₹ {selected.spentFundsLakhs} Lakhs</b></span>
              <span>Unspent Balance: <b className="text-amber-400">₹ {(selected.allocatedFundsLakhs - selected.spentFundsLakhs).toFixed(1)} Lakhs</b></span>
            </div>
          </div>

          {/* Pillar 2: Grievance Resolution Speed */}
          <div className="bg-[#04172c] border border-[#163e63] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#18c98b]" />
                <span className="font-bold text-white">2. Spandana Grievance Resolution Speed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <b className="text-emerald-400 text-sm font-mono">{selected.grievanceResolutionSpeedHrs} Hours</b>
                <span className="text-[10px] text-gray-400">(Avg SLA: 72h)</span>
              </div>
            </div>

            <div className="w-full bg-[#0d2a45] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((1 - (selected.grievanceResolutionSpeedHrs / 72)) * 100 + 40))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
              <span>Disposal Rate: <b className="text-emerald-300">{grievanceResolvedPct}% ({selected.resolvedGrievances}/{selected.totalGrievances})</b></span>
              <span>Pending In Progress: <b className="text-amber-300">{selected.totalGrievances - selected.resolvedGrievances} Petitions</b></span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Faster than Mandate
              </span>
            </div>
          </div>

          {/* Pillar 3: Project Completion Rate */}
          <div className="bg-[#04172c] border border-[#163e63] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20d8c2]" />
                <span className="font-bold text-white">3. Development Projects On-Time Completion Rate</span>
              </div>
              <b className="text-cyan-300 text-sm font-mono">{selected.projectCompletionRatePct.toFixed(1)}%</b>
            </div>

            <div className="w-full bg-[#0d2a45] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${selected.projectCompletionRatePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
              <span>Completed Works: <b className="text-white">{selected.completedProjects} Projects</b></span>
              <span>Active in Progress: <b className="text-cyan-300">{selected.ongoingProjects} Projects</b></span>
              <span>Total Sanctioned: <b className="text-white">{selected.totalProjects} Works</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Ranking Grid among Neighboring Panchayats */}
      <div className="pt-2 border-t border-[#163c5e]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Award size={15} className="text-amber-400" />
            Mandal Benchmark & Inter-Panchayat Leaderboard
          </span>
          <span className="text-cyan-300 text-[11px]">Ranked by Overall Health Score</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PANCHAYAT_HEALTH_DATA.slice(0, 3).map((pan, idx) => (
            <div 
              key={pan.id}
              onClick={() => setSelectedId(pan.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedId === pan.id 
                  ? 'bg-[#0f4b73] border-cyan-400 ring-1 ring-cyan-400' 
                  : 'bg-[#04182c] border-[#163c5e] hover:bg-[#072442]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  idx === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  idx === 1 ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40' :
                  'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                }`}>
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{pan.name}</h4>
                  <span className="text-[10px] text-gray-400">{pan.mandal} Mandal</span>
                </div>
              </div>

              <div className="text-right">
                <b className="text-sm font-mono text-cyan-300">{pan.overallHealthScore}</b>
                <span className="block text-[9px] text-emerald-400 font-semibold">{pan.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
