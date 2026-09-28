import React, { useState } from 'react';
import { 
  FolderKanban, MapPin, Building2, Calendar, CircleDollarSign, 
  CheckCircle2, Clock, AlertTriangle, User, ExternalLink, Plus, Filter, Search
} from 'lucide-react';
import { DevelopmentProject, UserProfile, ProjectStatus } from '../types/governance';
import { AP_DEPARTMENTS, AP_DISTRICTS } from '../data/governanceData';

interface ProjectsManagerProps {
  currentUser: UserProfile;
  projects: DevelopmentProject[];
  onAddProject: (project: Omit<DevelopmentProject, 'id' | 'lastUpdated'>) => void;
  onUpdateProject: (id: string, updates: Partial<DevelopmentProject>) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  currentUser,
  projects,
  onAddProject,
  onUpdateProject
}) => {
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New project form state
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState(AP_DEPARTMENTS[0].id);
  const [district, setDistrict] = useState(AP_DISTRICTS[0].name);
  const [constituency, setConstituency] = useState('Guntur West');
  const [mandalOrMunicipality, setMandalOrMunicipality] = useState('Thullur Mandal');
  const [villageOrWard, setVillageOrWard] = useState('Pedaparimi Panchayat');
  const [sanctionedLakhs, setSanctionedLakhs] = useState<number>(150);
  const [releasedLakhs, setReleasedLakhs] = useState<number>(100);
  const [utilizedLakhs, setUtilizedLakhs] = useState<number>(65);
  const [contractorAgency, setContractorAgency] = useState('AP State Civil Works Corp');
  const [officerInCharge, setOfficerInCharge] = useState('Executive Engineer');
  const [description, setDescription] = useState('');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(2500);

  const canPublish = currentUser.role !== 'citizen';

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = AP_DEPARTMENTS.find(d => d.id === departmentId);
    onAddProject({
      title,
      departmentId,
      departmentName: deptObj ? deptObj.name : 'Rural Development',
      district,
      constituency,
      mandalOrMunicipality,
      villageOrWard,
      level: 'panchayat',
      sanctionedAmountLakhs: Number(sanctionedLakhs),
      releasedAmountLakhs: Number(releasedLakhs),
      utilizedAmountLakhs: Number(utilizedLakhs),
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: '2025-12-31',
      status: 'In Progress',
      progressPercent: Math.round((Number(utilizedLakhs) / Number(sanctionedLakhs)) * 100) || 50,
      contractorAgency,
      officerInCharge,
      description,
      beneficiariesCount: Number(beneficiariesCount)
    });
    setIsModalOpen(false);
    // Reset
    setTitle('');
    setDescription('');
  };

  const filteredProjects = projects.filter(p => {
    if (filterDistrict !== 'all' && p.district !== filterDistrict) return false;
    if (filterDept !== 'all' && p.departmentId !== filterDept) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) ||
                    p.district.toLowerCase().includes(q) ||
                    p.mandalOrMunicipality.toLowerCase().includes(q) ||
                    p.villageOrWard.toLowerCase().includes(q) ||
                    p.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#072545] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderKanban size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  Transparency Monitor
                </span>
                <span className="text-xs text-gray-400">• Village to State Works Tracker</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Development Works & Infrastructure Projects
              </h2>
            </div>
          </div>

          {canPublish && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Sanction New Development Work
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-[#173e63]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search works, village, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#04172c] border border-[#1b486d] text-xs text-white pl-8 pr-3 py-2 rounded-xl outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={filterDistrict}
            onChange={e => setFilterDistrict(e.target.value)}
            className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Districts (26)</option>
            {AP_DISTRICTS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Departments</option>
            {AP_DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Work Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl">
            <FolderKanban size={36} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-300 font-semibold text-sm">No development projects found</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search terms or filters.</p>
          </div>
        ) : (
          filteredProjects.map(proj => (
            <div 
              key={proj.id}
              className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded font-bold">
                    {proj.id}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    proj.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    proj.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1.5 line-clamp-2">
                  {proj.description}
                </p>

                {/* Location badge */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-200/90 mt-3 bg-[#031526] p-2 rounded-xl border border-[#14395a]">
                  <MapPin size={13} className="text-cyan-400 flex-none" />
                  <span className="truncate">
                    {proj.villageOrWard}, {proj.mandalOrMunicipality}, {proj.district}
                  </span>
                </div>

                {/* Financial breakdown */}
                <div className="grid grid-cols-3 gap-2 my-3 text-[11px] bg-[#04182c] p-2.5 rounded-xl border border-[#163f64]">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Sanctioned</span>
                    <b className="text-white">₹ {(proj.sanctionedAmountLakhs / 100).toFixed(2)} Cr</b>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Released</span>
                    <b className="text-cyan-300">₹ {(proj.releasedAmountLakhs / 100).toFixed(2)} Cr</b>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase">Utilized</span>
                    <b className="text-emerald-400">₹ {(proj.utilizedAmountLakhs / 100).toFixed(2)} Cr</b>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Implementing Agency:</span>
                    <span className="text-gray-200 font-medium">{proj.contractorAgency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beneficiary Outreach:</span>
                    <span className="text-cyan-300 font-medium">{proj.beneficiariesCount.toLocaleString()} Citizens</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Physical Completion</span>
                  <span className="text-cyan-300 font-bold">{proj.progressPercent}%</span>
                </div>
                <div className="w-full bg-[#122c46] h-2 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>

                {canPublish && (
                  <div className="flex gap-2 pt-2 border-t border-[#133758]">
                    <button
                      onClick={() => {
                        const newPct = Math.min(100, proj.progressPercent + 10);
                        const isDone = newPct === 100;
                        onUpdateProject(proj.id, {
                          progressPercent: newPct,
                          status: isDone ? 'Completed' : 'In Progress',
                          actualCompletionDate: isDone ? new Date().toISOString().split('T')[0] : undefined
                        });
                      }}
                      className="flex-1 text-[11px] bg-[#0a3556] hover:bg-cyan-600 text-cyan-200 hover:text-white py-1.5 rounded-lg border border-[#235882] transition-colors"
                    >
                      +10% Progress Milestone
                    </button>
                    {proj.status !== 'Completed' && (
                      <button
                        onClick={() => {
                          onUpdateProject(proj.id, {
                            progressPercent: 100,
                            status: 'Completed',
                            actualCompletionDate: new Date().toISOString().split('T')[0]
                          });
                        }}
                        className="text-[11px] bg-emerald-700/80 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-[#071f3a] border border-[#27628b] rounded-2xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-1">Sanction New Development Work / Project</h3>
            <p className="text-xs text-gray-400 mb-4">Official publication to the Andhra Pradesh Public Governance Portal</p>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-medium block mb-1">Work / Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction of Community RO Drinking Water Plant"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Administrative Department</label>
                  <select
                    value={departmentId}
                    onChange={e => setDepartmentId(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    {AP_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">District</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    {AP_DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Assembly Constituency</label>
                  <input
                    type="text"
                    required
                    value={constituency}
                    onChange={e => setConstituency(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Mandal / Municipality</label>
                  <input
                    type="text"
                    required
                    value={mandalOrMunicipality}
                    onChange={e => setMandalOrMunicipality(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Gram Panchayat / Ward</label>
                  <input
                    type="text"
                    required
                    value={villageOrWard}
                    onChange={e => setVillageOrWard(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Sanctioned Cost (₹ Lakhs)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={sanctionedLakhs}
                    onChange={e => setSanctionedLakhs(Number(e.target.value))}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Funds Released (₹ Lakhs)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={releasedLakhs}
                    onChange={e => setReleasedLakhs(Number(e.target.value))}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Funds Utilized (₹ Lakhs)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={utilizedLakhs}
                    onChange={e => setUtilizedLakhs(Number(e.target.value))}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Contractor / Executing Agency</label>
                  <input
                    type="text"
                    required
                    value={contractorAgency}
                    onChange={e => setContractorAgency(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Target Beneficiary Count</label>
                  <input
                    type="number"
                    required
                    value={beneficiariesCount}
                    onChange={e => setBeneficiariesCount(Number(e.target.value))}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Work Description & Scope</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide scope, dimensions, milestone targets..."
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-gray-300 bg-[#04172c] hover:bg-[#072440] rounded-xl border border-[#1b4366] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Publish & Register Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
