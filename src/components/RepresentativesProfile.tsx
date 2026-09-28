import React, { useState } from 'react';
import { 
  Users, MapPin, Building2, Phone, Mail, Award, 
  Calendar, CheckCircle2, ChevronRight, Search, Filter
} from 'lucide-react';
import { UserProfile, DevelopmentProject, GovernmentOrder } from '../types/governance';
import { DEMO_USERS, AP_DEPARTMENTS } from '../data/governanceData';

interface RepresentativesProfileProps {
  currentUser: UserProfile;
  projects: DevelopmentProject[];
  gos: GovernmentOrder[];
}

export const RepresentativesProfile: React.FC<RepresentativesProfileProps> = ({
  currentUser,
  projects,
  gos
}) => {
  const [selectedRep, setSelectedRep] = useState<UserProfile>(DEMO_USERS[0]);
  const [filterRole, setFilterRole] = useState<'all' | 'leaders' | 'legislature' | 'local'>('all');

  const filteredReps = DEMO_USERS.filter(u => {
    if (filterRole === 'leaders') return u.role === 'chief_minister' || u.role === 'deputy_cm' || u.role === 'minister';
    if (filterRole === 'legislature') return u.role === 'mp' || u.role === 'mla';
    if (filterRole === 'local') return u.role === 'district_collector' || u.role === 'sarpanch' || u.role === 'mayor_municipal_chair';
    return true;
  });

  const repProjects = projects.filter(p => 
    p.district.toLowerCase().includes(selectedRep.jurisdiction.toLowerCase().split(' ')[0]) ||
    selectedRep.role === 'chief_minister'
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  Public Leadership
                </span>
                <span className="text-xs text-gray-400">• Elected Representatives & Administrative Heads</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Elected Representatives & Executive Directory
              </h2>
            </div>
          </div>

          <div className="flex bg-[#04172a] p-1 rounded-xl border border-[#173e63]">
            {[
              { id: 'all', label: 'All' },
              { id: 'leaders', label: 'CM & DCM' },
              { id: 'legislature', label: 'MP / MLA' },
              { id: 'local', label: 'Collector / Sarpanch' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterRole(tab.id as any)}
                className={`text-xs px-3 py-1.5 font-medium rounded-lg transition-all ${
                  filterRole === tab.id ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Representatives */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Selected Representatives ({filteredReps.length})
          </h3>

          {filteredReps.map(rep => {
            const isSelected = selectedRep.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedRep(rep)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#0f4b73] border-cyan-400 shadow-md ring-1 ring-cyan-400'
                    : 'bg-[#071f3a] border-[#1b4b6c] hover:bg-[#0b2f54]'
                }`}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-cyan-400/40 flex-none flex items-center justify-center font-bold text-cyan-300 text-sm">
                  {rep.photo ? (
                    <img src={rep.photo} alt={rep.name} className="w-full h-full object-cover" />
                  ) : (
                    rep.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                  )}
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{rep.name}</h4>
                  <p className="text-[11px] text-cyan-200 truncate">{rep.designation}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{rep.jurisdiction}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Profile View */}
        <div className="lg:col-span-8">
          <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163a5c] pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-cyan-400/60 shadow-lg flex-none flex items-center justify-center text-xl font-bold text-cyan-300">
                  {selectedRep.photo ? (
                    <img src={selectedRep.photo} alt={selectedRep.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedRep.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                      {selectedRep.level.toUpperCase()} LEVEL
                    </span>
                    {selectedRep.termPeriod && (
                      <span className="text-[11px] text-gray-400">Tenure: {selectedRep.termPeriod}</span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedRep.name}
                  </h3>
                  <p className="text-xs text-cyan-300 font-medium">{selectedRep.designation}</p>
                </div>
              </div>

              <div className="space-y-1 text-right text-xs">
                {selectedRep.phone && (
                  <div className="flex items-center sm:justify-end gap-1.5 text-gray-300">
                    <Phone size={13} className="text-cyan-400" />
                    <span>{selectedRep.phone}</span>
                  </div>
                )}
                {selectedRep.email && (
                  <div className="flex items-center sm:justify-end gap-1.5 text-gray-300">
                    <Mail size={13} className="text-cyan-400" />
                    <span>{selectedRep.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Jurisdiction Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#04172c] p-4 rounded-xl border border-[#163e63] text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">Constituency / Jurisdiction</span>
                <b className="text-white text-xs">{selectedRep.jurisdiction}</b>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Assigned Portfolios</span>
                <b className="text-cyan-300 text-xs">
                  {selectedRep.department 
                    ? AP_DEPARTMENTS.find(d => d.id === selectedRep.department)?.name 
                    : 'General Governance & Public Welfare'}
                </b>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Verified Public Status</span>
                <b className="text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active Mandate
                </b>
              </div>
            </div>

            {/* Associated Development Works in Jurisdiction */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Building2 size={15} className="text-cyan-400" /> Development Works in Jurisdiction
              </h4>

              <div className="space-y-2.5">
                {repProjects.slice(0, 3).map(proj => (
                  <div key={proj.id} className="bg-[#031526] border border-[#14395a] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <b className="text-white block">{proj.title}</b>
                      <span className="text-[10px] text-gray-400">{proj.villageOrWard}, {proj.district}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <b className="text-emerald-400">₹ {(proj.sanctionedAmountLakhs / 100).toFixed(2)} Cr</b>
                      <span className="text-[10px] bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 px-2 py-0.5 rounded">
                        {proj.status} ({proj.progressPercent}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
