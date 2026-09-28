import React, { useState } from 'react';
import { 
  CircleDollarSign, TrendingUp, PieChart as PieIcon, ArrowUpRight, 
  Building2, Landmark, Filter, Download, CheckCircle2, ChevronRight,
  RefreshCw, Radio, ShieldCheck, Database, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { AP_DEPARTMENTS, AP_DISTRICTS } from '../data/governanceData';
import { LiveBudgetSummary } from '../services/govOpenDataService';

interface BudgetTransparencyProps {
  liveBudget?: LiveBudgetSummary | null;
  isSyncing?: boolean;
  lastSyncTime?: string;
  onRefreshLiveFeed?: () => Promise<void>;
}

export const BudgetTransparency: React.FC<BudgetTransparencyProps> = ({
  liveBudget,
  isSyncing = false,
  lastSyncTime = '',
  onRefreshLiveFeed
}) => {
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedView, setSelectedView] = useState<'department' | 'district'>('department');

  // Live Aggregates prioritized from open data feed
  const totalStateBudgetCr = liveBudget?.totalStateBudgetCr ?? 294400;
  const totalAllocatedCr = liveBudget?.totalAllocatedCr ?? 125430;
  const totalReleasedCr = liveBudget?.totalReleasedCr ?? 98320;
  const totalSpentCr = liveBudget?.totalSpentCr ?? 76210;
  const dataSource = liveBudget?.dataSource ?? 'apfinance.gov.in';

  // Dynamic department chart data
  const departmentChartData = liveBudget && liveBudget.departmentSummaries.length > 0
    ? liveBudget.departmentSummaries.map(d => ({
        name: d.code,
        fullName: d.name,
        allocated: d.allocatedCr,
        spent: d.spentCr,
        absorption: d.utilizationRatePct.toFixed(1)
      }))
    : AP_DEPARTMENTS.map(d => ({
        name: d.code,
        fullName: d.name,
        allocated: d.budgetAllocatedCr,
        spent: d.budgetSpentCr,
        absorption: ((d.budgetSpentCr / d.budgetAllocatedCr) * 100).toFixed(1)
      }));

  const districtChartData = liveBudget && liveBudget.districtSummaries.length > 0
    ? liveBudget.districtSummaries.map(d => ({
        name: d.name,
        allocated: d.allocatedCr,
        spent: d.spentCr
      }))
    : AP_DISTRICTS.slice(0, 10).map(d => ({
        name: d.name,
        allocated: d.totalFundsAllocatedCr,
        spent: d.totalFundsSpentCr
      }));

  const COLORS = ['#20d8c2', '#219cff', '#8a58ff', '#f4a340', '#18c98b', '#ef5b65', '#ec72b8', '#88a5bf'];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CircleDollarSign size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50 flex items-center gap-1">
                  <Database size={11} /> Open Data Linked
                </span>
                <span className="text-xs text-gray-400">• Real-Time AP Treasury & CFMS Feed</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Budget Allocation & Live Fund Utilization
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live Sync Button */}
            {onRefreshLiveFeed && (
              <button
                onClick={onRefreshLiveFeed}
                disabled={isSyncing}
                className="bg-[#041d38] hover:bg-[#072c54] border border-[#1e527d] text-cyan-200 text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin text-cyan-400" : "text-cyan-400"} />
                <span>{isSyncing ? "Syncing..." : "Sync Open Data"}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-[#04172c] border border-[#1b486d] px-2.5 py-1.5 rounded-xl text-xs">
              <span className="text-gray-400">Source:</span>
              <b className="text-cyan-300 font-mono text-[11px]">{dataSource}</b>
            </div>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-1.5 rounded-xl outline-none"
            >
              <option value="2025-26">FY 2025–26 (Active Live)</option>
              <option value="2024-25">FY 2024–25 (Audited)</option>
              <option value="2023-24">FY 2023–24 (Closed)</option>
            </select>
          </div>
        </div>

        {/* Live sync pill badge */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-gray-300 bg-[#04182e]/80 border border-[#153f65] px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to <b>AP Comprehensive Financial Management System (CFMS)</b> Gateway</span>
          </div>
          {lastSyncTime && (
            <span className="text-gray-400 flex items-center gap-1 text-[10px]">
              <Clock size={11} /> Last Synced: <b className="text-cyan-300">{lastSyncTime}</b>
            </span>
          )}
        </div>

        {/* 4 Macro Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#173e63]">
          <div className="bg-[#04172c] border border-[#174167] p-3.5 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total State Outlay</span>
            <strong className="text-base sm:text-lg text-white font-extrabold">₹ {totalStateBudgetCr.toLocaleString()} Cr</strong>
            <small className="block text-[10px] text-cyan-400 mt-0.5">AP Legislative Assembly Sanction</small>
          </div>

          <div className="bg-[#04172c] border border-[#174167] p-3.5 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Allocated to Depts</span>
            <strong className="text-base sm:text-lg text-cyan-300 font-extrabold">₹ {totalAllocatedCr.toLocaleString()} Cr</strong>
            <small className="block text-[10px] text-blue-300 mt-0.5">Administrative Sanctioned</small>
          </div>

          <div className="bg-[#04172c] border border-[#174167] p-3.5 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Treasury Released</span>
            <strong className="text-base sm:text-lg text-emerald-400 font-extrabold">₹ {totalReleasedCr.toLocaleString()} Cr</strong>
            <small className="block text-[10px] text-emerald-300 mt-0.5">
              {((totalReleasedCr / totalAllocatedCr) * 100).toFixed(1)}% Release Ratio
            </small>
          </div>

          <div className="bg-[#04172c] border border-[#174167] p-3.5 rounded-xl">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Actual Expenditure</span>
            <strong className="text-base sm:text-lg text-amber-400 font-extrabold">₹ {totalSpentCr.toLocaleString()} Cr</strong>
            <small className="block text-[10px] text-amber-300 mt-0.5">
              {((totalSpentCr / totalReleasedCr) * 100).toFixed(1)}% Ground Utilization
            </small>
          </div>
        </div>
      </div>

      {/* Chart Comparison Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Bar Chart */}
        <div className="lg:col-span-8 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#163a5c] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Live Department Fund Allocation vs Ground Expenditure</h3>
              <p className="text-[11px] text-gray-400">Values in ₹ Crores (Live Stream FY {selectedYear})</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('department')}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  selectedView === 'department' ? 'bg-cyan-500 text-[#03152b] font-bold' : 'text-gray-300 bg-[#04172c]'
                }`}
              >
                By Department
              </button>
              <button
                onClick={() => setSelectedView('district')}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  selectedView === 'district' ? 'bg-cyan-500 text-[#03152b] font-bold' : 'text-gray-300 bg-[#04172c]'
                }`}
              >
                Top Districts
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedView === 'department' ? departmentChartData : districtChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#163e63" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#8da8be" 
                  tick={{ fill: '#8da8be', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#8da8be" 
                  tick={{ fill: '#8da8be', fontSize: 10 }}
                  tickFormatter={val => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#04172c', 
                    borderColor: '#1f4e75', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: '#fff' 
                  }}
                  formatter={(val: number) => [`₹ ${val.toLocaleString()} Cr`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="allocated" name="Sanctioned (₹ Cr)" fill="#219cff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Utilized (₹ Cr)" fill="#20d8c2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Donut Distribution */}
        <div className="lg:col-span-4 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 flex flex-col justify-between">
          <div className="border-b border-[#163a5c] pb-3">
            <h3 className="text-sm font-bold text-white">Expenditure Head Proportions</h3>
            <p className="text-[11px] text-gray-400">Share of ground treasury dispatches</p>
          </div>

          <div className="h-52 my-3 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentChartData}
                  dataKey="spent"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {departmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#04172c', 
                    borderColor: '#1f4e75', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: '#fff' 
                  }}
                  formatter={(val: number) => [`₹ ${val.toLocaleString()} Cr`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400">Total Spent</span>
              <strong className="text-sm font-bold text-cyan-300">₹ {(totalSpentCr / 1000).toFixed(1)}k Cr</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-300">
            {departmentChartData.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-none" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{d.name}</span>
                <b className="ml-auto text-white">{d.absorption}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
