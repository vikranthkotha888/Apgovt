import React, { useState } from 'react';
import { 
  ShieldCheck, MessageSquare, AlertCircle, CheckCircle2, Clock, 
  Search, ArrowRight, UserCheck, Phone, Mail, MapPin, Building2,
  FileCheck, Send, RefreshCw, Filter
} from 'lucide-react';
import { Grievance, GrievanceStatus, UserProfile } from '../types/governance';
import { AP_DEPARTMENTS, AP_DISTRICTS } from '../data/governanceData';

interface GrievanceModuleProps {
  currentUser: UserProfile;
  grievances: Grievance[];
  onSubmitGrievance: (data: Omit<Grievance, 'id' | 'trackingId' | 'status' | 'submittedAt' | 'timeline'>) => Grievance;
  onUpdateStatus: (id: string, status: GrievanceStatus, remarks: string, officerName: string) => void;
}

export const GrievanceModule: React.FC<GrievanceModuleProps> = ({
  currentUser,
  grievances,
  onSubmitGrievance,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'admin_inbox'>('submit');
  
  // Track search state
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchedGrievance, setSearchedGrievance] = useState<Grievance | null>(null);
  const [searchError, setSearchError] = useState('');

  // Submit form state
  const [citizenName, setCitizenName] = useState(currentUser.role === 'citizen' ? currentUser.name : '');
  const [citizenPhone, setCitizenPhone] = useState(currentUser.phone || '');
  const [citizenEmail, setCitizenEmail] = useState(currentUser.email || '');
  const [departmentId, setDepartmentId] = useState(AP_DEPARTMENTS[0].id);
  const [district, setDistrict] = useState(AP_DISTRICTS[0].name);
  const [mandal, setMandal] = useState('Thullur Mandal');
  const [panchayatOrWard, setPanchayatOrWard] = useState('Ward 4');
  const [category, setCategory] = useState('Drinking Water Supply / Pipeline Leaks');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Grievance['priority']>('High');
  const [newTrackingId, setNewTrackingId] = useState<string | null>(null);

  // Officer status update modal/inline state
  const [selectedForUpdate, setSelectedForUpdate] = useState<Grievance | null>(null);
  const [newStatus, setNewStatus] = useState<GrievanceStatus>('In Progress');
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Filter for official inbox
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const canManageGrievances = currentUser.role !== 'citizen';

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const cleanId = searchTrackingId.trim();
    if (!cleanId) return;

    const found = grievances.find(
      g => g.trackingId.toLowerCase() === cleanId.toLowerCase() || g.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (found) {
      setSearchedGrievance(found);
    } else {
      setSearchedGrievance(null);
      setSearchError(`No grievance record found for tracking ID "${cleanId}". Please verify your reference number.`);
    }
  };

  const handleRegisterGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = AP_DEPARTMENTS.find(d => d.id === departmentId);
    const created = onSubmitGrievance({
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || '+91 90000 00000',
      citizenEmail: citizenEmail || 'citizen@ap.gov.in',
      departmentId,
      departmentName: deptObj ? deptObj.name : 'General Administration',
      district,
      mandal,
      panchayatOrWard,
      category,
      subject,
      description,
      priority
    });

    setNewTrackingId(created.trackingId);
    setSearchedGrievance(created);
    // Reset form fields
    setSubject('');
    setDescription('');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForUpdate) return;
    onUpdateStatus(
      selectedForUpdate.id,
      newStatus,
      resolutionRemarks || `Status updated to ${newStatus}`,
      `${currentUser.name} (${currentUser.designation})`
    );
    setSelectedForUpdate(null);
    setResolutionRemarks('');
  };

  const filteredGrievances = grievances.filter(g => {
    if (filterDept !== 'all' && g.departmentId !== filterDept) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#08294a] via-[#09355f] to-[#072440] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  AP Spandana
                </span>
                <span className="text-xs text-gray-400">• Citizen Grievance Redressal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Public Grievances & Redressal System
              </h2>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-[#04172a] p-1 rounded-xl border border-[#173e63]">
            <button
              onClick={() => setActiveTab('submit')}
              className={`text-xs px-3.5 py-1.5 font-medium rounded-lg transition-all ${
                activeTab === 'submit' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Submit Grievance
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`text-xs px-3.5 py-1.5 font-medium rounded-lg transition-all ${
                activeTab === 'track' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Track Status
            </button>
            {canManageGrievances && (
              <button
                onClick={() => setActiveTab('admin_inbox')}
                className={`text-xs px-3.5 py-1.5 font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin_inbox' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Department Inbox</span>
                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUBMIT GRIEVANCE TAB */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <FileCheck size={16} className="text-cyan-400" />
              Lodge a Problem / Official Complaint
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Directly routed to the concerned department, district collectorate, and Panchayat/Municipal body.
            </p>

            {newTrackingId && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-white animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={18} /> Grievance Registered Successfully!
                </div>
                <p className="text-xs text-emerald-200 mt-1">
                  Your official Tracking Reference ID is:
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-base sm:text-lg font-mono font-bold bg-[#021827] px-3 py-1 rounded-lg border border-emerald-500/40 text-emerald-300">
                    {newTrackingId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTrackingId(newTrackingId);
                      setActiveTab('track');
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Real-time Tracking &rarr;
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterGrievance} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Citizen Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={citizenName}
                    onChange={e => setCitizenName(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={citizenPhone}
                    onChange={e => setCitizenPhone(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="citizen@domain.com"
                    value={citizenEmail}
                    onChange={e => setCitizenEmail(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Concerned Department</label>
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
                  <label className="text-gray-300 font-medium block mb-1">Category of Issue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken water pipe / Streetlight repair / Ration card"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Mandal / Municipality</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mangalagiri / Thullur"
                    value={mandal}
                    onChange={e => setMandal(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Panchayat / Ward No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pedaparimi / Ward 7"
                    value={panchayatOrWard}
                    onChange={e => setPanchayatOrWard(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Grievance Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of the issue in one line"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Full Problem Description & Specific Location</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise details such as landmarks, duration of problem, affected citizens, etc."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Urgency Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Normal">Normal (SLA: 7 Days)</option>
                    <option value="Medium">Medium (SLA: 5 Days)</option>
                    <option value="High">High (SLA: 72 Hours)</option>
                    <option value="Urgent">Urgent / Emergency (SLA: 24 Hours)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={15} /> Submit to Government Portal
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Guidance Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-400" /> Resolution SLA Timelines
              </h4>
              <p className="text-[11px] text-gray-300 mb-3">
                As per Andhra Pradesh Public Service Guarantee Act:
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-[#04172c] border border-[#183e63]">
                  <span className="text-gray-400">Drinking Water Outages</span>
                  <b className="text-cyan-300">Within 24 Hours</b>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#04172c] border border-[#183e63]">
                  <span className="text-gray-400">Road Potholes & Hazards</span>
                  <b className="text-cyan-300">Within 72 Hours</b>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#04172c] border border-[#183e63]">
                  <span className="text-gray-400">Pattadar Passbook Mutation</span>
                  <b className="text-cyan-300">Within 21 Days</b>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#04172c] border border-[#183e63]">
                  <span className="text-gray-400">Electricity Transformer Failure</span>
                  <b className="text-cyan-300">Within 24 Hours</b>
                </div>
              </div>
            </div>

            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 text-xs text-gray-300">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <Phone size={14} className="text-emerald-400" /> State Toll-Free Helplines
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <p>• <b>1902</b> — AP Chief Minister Spandana Grievance Helpline</p>
                <p>• <b>112</b> — Police, Fire & Emergency Response</p>
                <p>• <b>104</b> — Free Health Consultation & Medical Advice</p>
                <p>• <b>1912</b> — Electricity Supply Complaint Desk</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK STATUS TAB */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Search size={16} className="text-cyan-400" />
              Track Grievance / Application Progress
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter your Grievance Tracking ID (e.g. AP-G-2025-94821) or Application ID
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. AP-G-2025-94821)"
                value={searchTrackingId}
                onChange={e => setSearchTrackingId(e.target.value)}
                className="flex-1 bg-[#041a2d] border border-[#244e6e] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Search size={16} /> Track Now
              </button>
            </form>

            {searchError && (
              <div className="mt-3 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={15} /> {searchError}
              </div>
            )}
          </div>

          {/* Searched Result Card */}
          {searchedGrievance && (
            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163a5c] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                      {searchedGrievance.trackingId}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Submitted on: {searchedGrievance.submittedAt}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {searchedGrievance.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    searchedGrievance.status === 'Resolved' || searchedGrievance.status === 'Closed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : searchedGrievance.status === 'In Progress'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {searchedGrievance.status}
                  </span>
                </div>
              </div>

              {/* Grievance Summary Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#04172c] p-4 rounded-xl border border-[#163e63]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Department</span>
                  <b className="text-cyan-200">{searchedGrievance.departmentName}</b>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Location</span>
                  <b className="text-white">{searchedGrievance.panchayatOrWard}, {searchedGrievance.mandal}</b>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Assigned Officer</span>
                  <b className="text-white">{searchedGrievance.assignedOfficer || 'Auto-Routing to Mandal Nodal Officer'}</b>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Petitioner Name</span>
                  <b className="text-white">{searchedGrievance.citizenName}</b>
                </div>
              </div>

              {/* Progress Milestones Timeline */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={15} className="text-cyan-400" />
                  Official Redressal Audit Trail & Status History
                </h4>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1a446a]">
                  {searchedGrievance.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#071f3a] shadow-[0_0_8px_#20d8c2]" />
                      <div className="bg-[#031528] border border-[#163c5e] p-3 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] mb-1">
                          <span className="font-bold text-cyan-300">{step.status}</span>
                          <span className="text-gray-400">{step.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-200">{step.remarks}</p>
                        <span className="text-[10px] text-gray-400 block mt-1">Updated by: {step.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {searchedGrievance.resolutionRemarks && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs">
                  <b className="text-emerald-400 block mb-1">Official Resolution Verdict:</b>
                  <p className="text-emerald-200">{searchedGrievance.resolutionRemarks}</p>
                  <small className="text-emerald-300/80 block mt-1">Closed at: {searchedGrievance.resolvedAt}</small>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DEPARTMENT INBOX / ADMIN TAB */}
      {activeTab === 'admin_inbox' && canManageGrievances && (
        <div className="space-y-4">
          <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Department Spandana Nodal Desk</h3>
                <p className="text-[11px] text-gray-400">Review petitions, assign engineers, and update citizen resolution status</p>
              </div>

              {/* Filter controls */}
              <div className="flex gap-2">
                <select
                  value={filterDept}
                  onChange={e => setFilterDept(e.target.value)}
                  className="bg-[#041a2d] border border-[#1b4b6c] text-xs text-cyan-200 rounded-lg px-2.5 py-1.5 outline-none"
                >
                  <option value="all">All Departments</option>
                  {AP_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.code}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-[#041a2d] border border-[#1b4b6c] text-xs text-cyan-200 rounded-lg px-2.5 py-1.5 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredGrievances.map(item => (
                <div 
                  key={item.id}
                  className="bg-[#041a2f] border border-[#163f64] rounded-xl p-4 hover:border-cyan-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {item.trackingId}
                      </span>
                      <span className="text-[10px] text-gray-400">• {item.submittedAt}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.priority === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                        item.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-white">{item.subject}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-cyan-200/80 pt-1">
                      <span>Petitioner: <b>{item.citizenName}</b> ({item.citizenPhone})</span>
                      <span>•</span>
                      <span>Location: <b>{item.panchayatOrWard}, {item.district}</b></span>
                      <span>•</span>
                      <span>Officer: <b>{item.assignedOfficer || 'Not Assigned'}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-none">
                    <button
                      onClick={() => {
                        setSelectedForUpdate(item);
                        setNewStatus(item.status);
                      }}
                      className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => {
                        setSearchedGrievance(item);
                        setSearchTrackingId(item.trackingId);
                        setActiveTab('track');
                      }}
                      className="text-xs bg-[#0a3556] hover:bg-[#0c446f] text-cyan-300 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Timeline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Modal */}
          {selectedForUpdate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div 
                className="w-full max-w-lg bg-[#071f3a] border border-[#27628b] rounded-2xl p-6 text-white shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm">Update Grievance Action Status</h3>
                  <span className="text-xs font-mono text-cyan-300">{selectedForUpdate.trackingId}</span>
                </div>

                <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                  <div>
                    <label className="text-gray-300 font-medium block mb-1">New Workflow Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as GrievanceStatus)}
                      className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                    >
                      <option value="Assigned">Assigned to Field Staff</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress (Work Mobilized)</option>
                      <option value="Resolved">Resolved / Completed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 font-medium block mb-1">Official Remarks & Action Taken</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="e.g. Pipe repaired by Panchayat team. Water flow restored and tested with ward members."
                      value={resolutionRemarks}
                      onChange={e => setResolutionRemarks(e.target.value)}
                      className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedForUpdate(null)}
                      className="flex-1 py-2 text-gray-300 bg-[#04172c] hover:bg-[#072440] rounded-lg border border-[#1b4366] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all"
                    >
                      Save & Notify Citizen
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
