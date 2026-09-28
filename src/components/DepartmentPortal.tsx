import React, { useState } from 'react';
import { 
  Building2, Users, CircleDollarSign, FolderKanban, FileText, 
  MessageSquare, ShieldCheck, ChevronRight, ExternalLink,
  CheckCircle2, Clock, AlertTriangle, Download, ArrowUpRight,
  TrendingUp, Award, Layers
} from 'lucide-react';
import { Department, DevelopmentProject, GovernmentOrder, SchemeSubsidy, UserProfile } from '../types/governance';
import { AP_DEPARTMENTS, AP_DISTRICTS } from '../data/governanceData';

interface DepartmentPortalProps {
  currentUser: UserProfile;
  projects: DevelopmentProject[];
  gos: GovernmentOrder[];
  schemes: SchemeSubsidy[];
  onOpenNewProjectModal?: () => void;
  onOpenNewGOModal?: () => void;
}

export const DepartmentPortal: React.FC<DepartmentPortalProps> = ({
  currentUser,
  projects,
  gos,
  schemes,
  onOpenNewProjectModal,
  onOpenNewGOModal
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    currentUser.department || 'rd_pr'
  );
  const [subTab, setSubTab] = useState<'overview' | 'projects' | 'gos' | 'schemes' | 'officials'>('overview');

  const currentDept = AP_DEPARTMENTS.find(d => d.id === selectedDeptId) || AP_DEPARTMENTS[0];
  const deptProjects = projects.filter(p => p.departmentId === currentDept.id);
  const deptGOs = gos.filter(g => g.departmentId === currentDept.id);
  const deptSchemes = schemes.filter(s => s.departmentId === currentDept.id);

  // Can publish? (Ministers, CM, Deputy CM, Dept Officers)
  const canPublish = currentUser.role === 'chief_minister' || 
                     currentUser.role === 'deputy_cm' || 
                     (currentUser.role === 'minister' && (!currentUser.department || currentUser.department === currentDept.id)) ||
                     currentUser.role === 'department_officer';

  return (
    <div className="space-y-6">
      {/* Top Department Switcher Header */}
      <div className="bg-gradient-to-r from-[#092b4a] via-[#0b345a] to-[#08233d] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  {currentDept.code}
                </span>
                <span className="text-xs text-gray-400">• State Department Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {currentDept.name}
              </h2>
            </div>
          </div>

          {/* Department dropdown selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-300 hidden sm:block">Switch Department:</label>
            <select
              value={selectedDeptId}
              onChange={e => setSelectedDeptId(e.target.value)}
              className="bg-[#051c33] border border-[#215783] text-cyan-100 text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
            >
              {AP_DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#184266]">
          {[
            { id: 'overview', label: 'Department Overview', icon: Layers },
            { id: 'projects', label: `Projects (${deptProjects.length})`, icon: FolderKanban },
            { id: 'gos', label: `Orders & GOs (${deptGOs.length})`, icon: FileText },
            { id: 'schemes', label: `Schemes & Subsidies (${deptSchemes.length})`, icon: Award },
            { id: 'officials', label: 'Leadership & Officials', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-[#021324] font-bold shadow-[0_0_15px_rgba(32,216,194,0.3)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#1d4d73]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <CircleDollarSign size={24} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Annual Allocation</span>
                <strong className="text-lg text-white">₹ {currentDept.budgetAllocatedCr.toLocaleString()} Cr</strong>
                <span className="text-[10px] text-cyan-300 block">FY 2025–26 Sanctioned</span>
              </div>
            </div>

            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp size={24} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Expenditure Incurred</span>
                <strong className="text-lg text-white">₹ {currentDept.budgetSpentCr.toLocaleString()} Cr</strong>
                <span className="text-[10px] text-emerald-400 block">
                  {((currentDept.budgetSpentCr / currentDept.budgetAllocatedCr) * 100).toFixed(1)}% Budget Absorption
                </span>
              </div>
            </div>

            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <FolderKanban size={24} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Development Works</span>
                <strong className="text-lg text-white">{currentDept.activeProjectsCount.toLocaleString()}</strong>
                <span className="text-[10px] text-amber-300 block">Ongoing across 26 Districts</span>
              </div>
            </div>

            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Public Grievances</span>
                <strong className="text-lg text-white">
                  {((currentDept.resolvedGrievances / currentDept.totalGrievances) * 100).toFixed(0)}% Resolved
                </strong>
                <span className="text-[10px] text-purple-300 block">
                  {currentDept.resolvedGrievances} / {currentDept.totalGrievances} Disposed
                </span>
              </div>
            </div>
          </div>

          {/* Department Description & Minister Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Building2 size={16} className="text-cyan-400" /> Mandate & Governance Mission
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {currentDept.description}
              </p>

              <div className="mt-6 pt-5 border-t border-[#163a5c]">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  District-Wise Budget Allocation Distribution
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AP_DISTRICTS.slice(0, 4).map(dist => (
                    <div key={dist.id} className="bg-[#04172c] border border-[#173e63] p-2.5 rounded-xl">
                      <span className="text-[10px] text-gray-400 block truncate">{dist.name}</span>
                      <b className="text-xs text-cyan-300">₹ {(dist.totalFundsAllocatedCr * 0.18).toFixed(0)} Cr</b>
                      <small className="block text-[9px] text-emerald-400 mt-0.5">82% Utilized</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Minister & Secretary Profile Card */}
            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#163a5c] pb-2 flex items-center justify-between">
                <span>Department Leadership</span>
                <span className="text-[9px] bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded">Govt of AP</span>
              </h3>

              <div className="bg-[#04182e] border border-[#183d61] p-3.5 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan-400/50 flex-none bg-slate-800">
                  <img src={currentDept.ministerPhoto} alt={currentDept.ministerName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{currentDept.ministerName}</h4>
                  <p className="text-[10px] text-cyan-300 leading-tight mt-0.5">{currentDept.ministerDesignation}</p>
                  <span className="text-[9px] text-gray-400 block mt-1">Cabinet Member, Govt of AP</span>
                </div>
              </div>

              <div className="bg-[#04182e] border border-[#183d61] p-3.5 rounded-xl">
                <span className="text-[9px] text-gray-400 block uppercase">Principal Secretary / HoD</span>
                <h4 className="text-xs font-semibold text-gray-200 mt-0.5">{currentDept.secretaryName}</h4>
                <p className="text-[10px] text-gray-400">Indian Administrative Service (IAS)</p>
              </div>

              {canPublish && (
                <div className="pt-2">
                  <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl text-center">
                    <p className="text-[11px] text-cyan-200 font-medium">Authorized Administrative Access Active</p>
                    <div className="flex gap-2 mt-2">
                      {onOpenNewProjectModal && (
                        <button 
                          onClick={onOpenNewProjectModal}
                          className="flex-1 text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 rounded-lg transition-colors"
                        >
                          + Sanction Work
                        </button>
                      )}
                      {onOpenNewGOModal && (
                        <button 
                          onClick={onOpenNewGOModal}
                          className="flex-1 text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 rounded-lg transition-colors"
                        >
                          + Issue GO
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects List Tab */}
      {subTab === 'projects' && (
        <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#163a5c] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Active Development Projects & Works</h3>
              <p className="text-[11px] text-gray-400">Total works registered under {currentDept.name}</p>
            </div>
            {canPublish && onOpenNewProjectModal && (
              <button
                onClick={onOpenNewProjectModal}
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 w-fit"
              >
                + Publish New Development Work
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptProjects.length === 0 ? (
              <p className="text-xs text-gray-400 col-span-2 py-8 text-center">No projects listed yet under this department.</p>
            ) : (
              deptProjects.map(prj => (
                <div key={prj.id} className="bg-[#041a2f] border border-[#163f64] rounded-xl p-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded">
                        {prj.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        prj.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        prj.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {prj.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white">{prj.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{prj.description}</p>

                    <div className="grid grid-cols-2 gap-2 my-3 text-[10px] bg-[#021324] p-2 rounded-lg border border-[#133452]">
                      <div>
                        <span className="text-gray-400 block">Sanctioned</span>
                        <b className="text-white">₹ {(prj.sanctionedAmountLakhs / 100).toFixed(2)} Cr</b>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Utilized</span>
                        <b className="text-emerald-400">₹ {(prj.utilizedAmountLakhs / 100).toFixed(2)} Cr</b>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Location</span>
                        <span className="text-cyan-200 truncate block">{prj.villageOrWard}, {prj.district}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Beneficiaries</span>
                        <span className="text-cyan-200">{prj.beneficiariesCount.toLocaleString()} Citizens</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Physical Progress</span>
                      <span className="text-cyan-300 font-bold">{prj.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#122c46] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${prj.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* GOs Tab */}
      {subTab === 'gos' && (
        <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#163a5c] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Official Government Orders (GOs)</h3>
              <p className="text-[11px] text-gray-400">Verified digital orders and notifications published by {currentDept.name}</p>
            </div>
            {canPublish && onOpenNewGOModal && (
              <button
                onClick={onOpenNewGOModal}
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 w-fit"
              >
                + Issue New Government Order
              </button>
            )}
          </div>

          <div className="space-y-3">
            {deptGOs.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No Government Orders available for this department.</p>
            ) : (
              deptGOs.map(go => (
                <div key={go.id} className="bg-[#041a2f] border border-[#163f64] rounded-xl p-4 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {go.goNumber}
                      </span>
                      <span className="text-[10px] text-gray-400">• Date: {go.date}</span>
                      <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                        {go.documentType}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">{go.subject}</h4>
                    <p className="text-[11px] text-gray-400">{go.summary}</p>
                    <p className="text-[10px] text-cyan-200/80">Authorized Signatory: {go.signatory}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-none">
                    {go.sanctionAmountCr && (
                      <span className="text-xs font-bold text-emerald-400">
                        Sanction: ₹ {go.sanctionAmountCr} Cr
                      </span>
                    )}
                    <button 
                      onClick={() => alert(`Downloading verified copy of ${go.goNumber}... File size: ${go.fileSize}`)}
                      className="text-[11px] bg-[#093557] hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg border border-[#235882] transition-colors flex items-center gap-1.5"
                    >
                      <Download size={13} /> PDF ({go.fileSize})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Schemes & Subsidies Tab */}
      {subTab === 'schemes' && (
        <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#163a5c] pb-3">
            <h3 className="text-sm font-bold text-white">Public Welfare Schemes & Direct Subsidies</h3>
            <p className="text-[11px] text-gray-400">Citizen welfare programs, eligibility, and direct bank transfers (DBT)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptSchemes.length === 0 ? (
              <p className="text-xs text-gray-400 col-span-2 py-6 text-center">No active schemes directly registered under this category.</p>
            ) : (
              deptSchemes.map(sch => (
                <div key={sch.id} className="bg-[#041a2f] border border-[#163f64] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                        Active Scheme
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        Outlay: ₹ {sch.annualOutlayCr} Cr/yr
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{sch.name}</h4>
                    <p className="text-xs text-cyan-200 mt-1 font-medium">{sch.financialAssistance}</p>
                    
                    <div className="mt-3 bg-[#021324] p-3 rounded-lg border border-[#133452]">
                      <span className="text-[10px] text-gray-400 block font-semibold mb-1">Key Eligibility:</span>
                      <ul className="text-[10px] text-gray-300 space-y-1 list-disc pl-4">
                        {sch.eligibilityCriteria.map((crit, idx) => (
                          <li key={idx}>{crit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#143a5e] flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">
                      Enrolled: <b className="text-white">{(sch.beneficiariesEnrolled / 100000).toFixed(2)} Lakh Beneficiaries</b>
                    </span>
                    <button 
                      onClick={() => alert(`Citizen DBT verification link: Apply for ${sch.name} through Gram/Ward Secretariat.`)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      Apply via MeeSeva <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Leadership & Officials Tab */}
      {subTab === 'officials' && (
        <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 space-y-4">
          <div className="border-b border-[#163a5c] pb-3">
            <h3 className="text-sm font-bold text-white">Department Hierarchy & Administrative Directory</h3>
            <p className="text-[11px] text-gray-400">State Secretariat, District Nodal Officers, and Executive Engineers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#041a2f] border border-[#184268] p-4 rounded-xl">
              <span className="text-[10px] text-cyan-400 uppercase font-semibold">Cabinet In-Charge</span>
              <h4 className="text-sm font-bold text-white mt-1">{currentDept.ministerName}</h4>
              <p className="text-xs text-gray-300">{currentDept.ministerDesignation}</p>
              <div className="mt-3 pt-2 border-t border-[#163857] text-[10px] text-gray-400">
                <span>Room 104, Block 2, AP Secretariat, Velagapudi</span>
              </div>
            </div>

            <div className="bg-[#041a2f] border border-[#184268] p-4 rounded-xl">
              <span className="text-[10px] text-cyan-400 uppercase font-semibold">Head of the Department</span>
              <h4 className="text-sm font-bold text-white mt-1">{currentDept.secretaryName}</h4>
              <p className="text-xs text-gray-300">Principal Secretary to Government</p>
              <div className="mt-3 pt-2 border-t border-[#163857] text-[10px] text-gray-400">
                <span>Direct Contact: pr.sec.{currentDept.code.toLowerCase()}@ap.gov.in</span>
              </div>
            </div>

            <div className="bg-[#041a2f] border border-[#184268] p-4 rounded-xl">
              <span className="text-[10px] text-cyan-400 uppercase font-semibold">District Executive Wing</span>
              <h4 className="text-sm font-bold text-white mt-1">26 District Collectors & Nodal Chiefs</h4>
              <p className="text-xs text-gray-300">Superintending & Executive Engineers</p>
              <div className="mt-3 pt-2 border-t border-[#163857] text-[10px] text-gray-400">
                <span>Spandana Resolution Window: 72 Hours SLA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
