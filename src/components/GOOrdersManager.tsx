import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Search, Filter, Plus, 
  Building2, CheckCircle2, ArrowUpRight, Share2, Printer
} from 'lucide-react';
import { GovernmentOrder, UserProfile } from '../types/governance';
import { AP_DEPARTMENTS } from '../data/governanceData';

interface GOOrdersManagerProps {
  currentUser: UserProfile;
  gos: GovernmentOrder[];
  onAddGO: (go: Omit<GovernmentOrder, 'id'>) => void;
  isSyncing?: boolean;
  onRefreshLiveFeed?: () => Promise<void>;
  lastSyncTime?: string;
}

export const GOOrdersManager: React.FC<GOOrdersManagerProps> = ({
  currentUser,
  gos,
  onAddGO,
  isSyncing = false,
  onRefreshLiveFeed,
  lastSyncTime = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterDocType, setFilterDocType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New GO form
  const [goNumber, setGoNumber] = useState('G.O.Ms. No. ');
  const [departmentId, setDepartmentId] = useState(AP_DEPARTMENTS[0].id);
  const [subject, setSubject] = useState('');
  const [financialYear, setFinancialYear] = useState('2025-26');
  const [documentType, setDocumentType] = useState<GovernmentOrder['documentType']>('GO Ms');
  const [sanctionAmountCr, setSanctionAmountCr] = useState<number | undefined>(undefined);
  const [summary, setSummary] = useState('');
  const [signatory, setSignatory] = useState('Principal Secretary to Government');

  const canPublish = currentUser.role === 'chief_minister' || 
                     currentUser.role === 'deputy_cm' || 
                     currentUser.role === 'minister' || 
                     currentUser.role === 'department_officer';

  const handleCreateGO = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = AP_DEPARTMENTS.find(d => d.id === departmentId);
    onAddGO({
      goNumber,
      departmentId,
      departmentName: deptObj ? deptObj.name : 'General Administration',
      date: new Date().toISOString().split('T')[0],
      subject,
      financialYear,
      documentType,
      sanctionAmountCr: sanctionAmountCr ? Number(sanctionAmountCr) : undefined,
      fileSize: '1.9 MB',
      summary,
      signatory
    });
    setIsModalOpen(false);
    setSubject('');
    setSummary('');
  };

  const filteredGOs = gos.filter(go => {
    if (filterDept !== 'all' && go.departmentId !== filterDept) return false;
    if (filterDocType !== 'all' && go.documentType !== filterDocType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = go.goNumber.toLowerCase().includes(q) ||
                    go.subject.toLowerCase().includes(q) ||
                    go.summary.toLowerCase().includes(q) ||
                    go.departmentName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  e-Gazette & GO Portal
                </span>
                <span className="text-xs text-gray-400">• Digitally Certified Orders</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Official Government Orders (GOs) & Notifications
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onRefreshLiveFeed && (
              <button
                onClick={onRefreshLiveFeed}
                disabled={isSyncing}
                className="bg-[#041d38] hover:bg-[#072c54] border border-[#1e527d] text-cyan-200 text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow"
              >
                <FileText size={14} className={isSyncing ? "animate-pulse text-cyan-400" : "text-cyan-400"} />
                <span>{isSyncing ? "Syncing e-Gazette..." : "Fetch Latest e-Gazette"}</span>
              </button>
            )}

            {canPublish && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Issue Government Order (GO)
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[#173e63]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search GO No., keyword, sanction..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#04172c] border border-[#1b486d] text-xs text-white pl-8 pr-3 py-2 rounded-xl outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Departments</option>
            {AP_DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>

          <select
            value={filterDocType}
            onChange={e => setFilterDocType(e.target.value)}
            className="bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Order Formats</option>
            <option value="GO Ms">GO Ms (Statutory / Major Sanction)</option>
            <option value="GO Rt">GO Rt (Routine / Administrative)</option>
            <option value="Circular">Circular / Instruction</option>
            <option value="Policy">State Policy Document</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredGOs.length === 0 ? (
          <div className="text-center py-12 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl">
            <FileText size={36} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-300 font-semibold text-sm">No Government Orders match your filter criteria</p>
          </div>
        ) : (
          filteredGOs.map(go => (
            <div 
              key={go.id}
              className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                    {go.goNumber}
                  </span>
                  <span className="text-[11px] text-gray-400">• Date: {go.date}</span>
                  <span className="text-[10px] bg-blue-900/40 text-blue-300 border border-blue-800/40 px-2 py-0.5 rounded">
                    {go.documentType}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded">
                    FY {go.financialYear}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {go.subject}
                </h3>

                <p className="text-xs text-gray-300">
                  {go.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-cyan-200/80 pt-1">
                  <span>Department: <b>{go.departmentName}</b></span>
                  <span>•</span>
                  <span>Signatory: <b>{go.signatory}</b></span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-none">
                {go.sanctionAmountCr && (
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-gray-400 block">Sanction Value</span>
                    <b className="text-sm font-bold text-emerald-400">₹ {go.sanctionAmountCr} Cr</b>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Downloading verified digital PDF copy of ${go.goNumber} (${go.fileSize}). Generated by AP State Centre for Electronic Governance.`)}
                    className="text-xs bg-[#093557] hover:bg-cyan-600 text-white px-3.5 py-2 rounded-xl border border-[#235882] transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} /> Download PDF ({go.fileSize})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-xl bg-[#071f3a] border border-[#27628b] rounded-2xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-1">Issue Official Government Order (GO)</h3>
            <p className="text-xs text-gray-400 mb-4">Official publication for e-Gazette repository and public record</p>

            <form onSubmit={handleCreateGO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">GO Number / Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. G.O.Ms. No. 88"
                    value={goNumber}
                    onChange={e => setGoNumber(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Issuing Department</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Document Category</label>
                  <select
                    value={documentType}
                    onChange={e => setDocumentType(e.target.value as any)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="GO Ms">GO Ms</option>
                    <option value="GO Rt">GO Rt</option>
                    <option value="Circular">Circular</option>
                    <option value="Policy">Policy</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Financial Year</label>
                  <input
                    type="text"
                    required
                    value={financialYear}
                    onChange={e => setFinancialYear(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Sanction Amount (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional (e.g. 150)"
                    value={sanctionAmountCr !== undefined ? sanctionAmountCr : ''}
                    onChange={e => setSanctionAmountCr(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Order Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="Official subject text of the Government Order"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Key Operational Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly state key authorizations, budget heads, and implementation instructions..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Authorized Signatory</label>
                <input
                  type="text"
                  required
                  value={signatory}
                  onChange={e => setSignatory(e.target.value)}
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
                  Publish Government Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
