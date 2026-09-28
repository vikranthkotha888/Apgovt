import React, { useState } from 'react';
import { 
  MessageSquare, Calendar, MapPin, Users, CheckCircle2, Clock, 
  Plus, FileText, ChevronRight, AlertCircle, ArrowRight
} from 'lucide-react';
import { OfficialMeeting, UserProfile } from '../types/governance';
import { AP_DEPARTMENTS } from '../data/governanceData';

interface MeetingsManagerProps {
  currentUser: UserProfile;
  meetings: OfficialMeeting[];
  onAddMeeting: (meeting: Omit<OfficialMeeting, 'id'>) => void;
}

export const MeetingsManager: React.FC<MeetingsManagerProps> = ({
  currentUser,
  meetings,
  onAddMeeting
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<OfficialMeeting | null>(meetings[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState(AP_DEPARTMENTS[0].id);
  const [chairperson, setChairperson] = useState(currentUser.name);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM - 01:30 PM');
  const [location, setLocation] = useState('Secretariat Conference Hall, Velagapudi');
  const [attendeesCount, setAttendeesCount] = useState<number>(35);
  const [agendaText, setAgendaText] = useState('');
  const [decisionsText, setDecisionsText] = useState('');
  const [momSummary, setMomSummary] = useState('');

  const canCreate = currentUser.role !== 'citizen';

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = AP_DEPARTMENTS.find(d => d.id === departmentId);
    const agendaItems = agendaText.split('\n').filter(t => t.trim().length > 0);
    const decisionItems = decisionsText.split('\n').filter(t => t.trim().length > 0);

    const created = onAddMeeting({
      title,
      departmentId,
      departmentName: deptObj ? deptObj.name : 'General Administration',
      chairperson,
      date,
      time,
      location,
      level: 'state',
      attendeesCount: Number(attendeesCount),
      agenda: agendaItems.length > 0 ? agendaItems : ['Review of ongoing development works and financial progress'],
      keyDecisions: decisionItems.length > 0 ? decisionItems : ['Strict monitoring of project timelines and contractor billing'],
      actionItems: [
        {
          task: 'Submit compliance report to Minister within 10 days',
          assignee: 'Concerned District Nodal Officer',
          department: deptObj ? deptObj.name : 'General Administration',
          deadline: '2025-05-15',
          status: 'In Progress'
        }
      ],
      momSummary: momSummary || 'Minutes of Meeting confirmed and uploaded by authorized presiding officer.'
    });

    setIsModalOpen(false);
    setSelectedMeeting(created as any);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MessageSquare size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  Democratic Record
                </span>
                <span className="text-xs text-gray-400">• Official Proceedings & Action Items</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Official Meetings & Minutes of Meetings (MoMs)
              </h2>
            </div>
          </div>

          {canCreate && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Record Official Meeting / MoM
            </button>
          )}
        </div>
      </div>

      {/* Grid: Meeting List & Detailed MoM View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Recorded Sessions ({meetings.length})
          </h3>

          {meetings.map(m => {
            const isSelected = selectedMeeting?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMeeting(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0f466e] border-cyan-400 shadow-md ring-1 ring-cyan-400'
                    : 'bg-[#071f3a] border-[#1b4b6c] hover:bg-[#0b2d50] hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono mb-1">
                  <span>{m.id}</span>
                  <span className="text-gray-400">{m.date}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {m.title}
                </h4>

                <div className="flex items-center gap-3 text-[10px] text-cyan-200/80 mt-2">
                  <span>Presided: <b>{m.chairperson}</b></span>
                  <span>•</span>
                  <span>{m.attendeesCount} Delegates</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail MoM View */}
        <div className="lg:col-span-7">
          {selectedMeeting ? (
            <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-6 space-y-5 animate-fadeIn">
              <div className="border-b border-[#163c5e] pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedMeeting.id}
                  </span>
                  <span className="text-gray-400">• {selectedMeeting.date} ({selectedMeeting.time})</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {selectedMeeting.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#04172c] p-3 rounded-xl border border-[#163e63] mt-3">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Presiding Chairperson</span>
                    <b className="text-white">{selectedMeeting.chairperson}</b>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Venue / Location</span>
                    <b className="text-white">{selectedMeeting.location}</b>
                  </div>
                </div>
              </div>

              {/* Agenda items */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-400" /> Agenda Discussed
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-200 bg-[#041a2e] p-3 rounded-xl border border-[#183e60]">
                  {selectedMeeting.agenda.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Decisions Taken */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Key Decisions & Directives
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-100 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                  {selectedMeeting.keyDecisions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items Matrix */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock size={14} className="text-amber-400" /> Action Items & Department Accountability
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.actionItems.map((act, idx) => (
                    <div key={idx} className="bg-[#031526] border border-[#14395a] p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <b className="text-white block">{act.task}</b>
                        <span className="text-[10px] text-gray-400">Assignee: {act.assignee} ({act.department})</span>
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                          Due: {act.deadline}
                        </span>
                        <span className="text-[10px] text-cyan-300 font-bold">
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official MoM Statement */}
              <div className="pt-3 border-t border-[#163c5e] text-xs text-gray-300">
                <span className="text-[10px] text-gray-400 block uppercase mb-1">Presiding Officer Confirmation:</span>
                <p className="italic bg-[#04172a] p-3 rounded-xl border border-[#173a57]">
                  "{selectedMeeting.momSummary}"
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#071f3a] border border-[#1b4b6c] rounded-2xl">
              <MessageSquare size={36} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-300 text-sm">Select a meeting from the left list to review detailed Minutes</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-xl bg-[#071f3a] border border-[#27628b] rounded-2xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-1">Record Official Meeting & MoM</h3>
            <p className="text-xs text-gray-400 mb-4">Maintain democratic accountability and action tracking</p>

            <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-medium block mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zilla Parishad General Body Review Session"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Department</label>
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
                  <label className="text-gray-300 font-medium block mb-1">Presiding Chairperson</label>
                  <input
                    type="text"
                    required
                    value={chairperson}
                    onChange={e => setChairperson(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Timing</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block mb-1">Delegates Attended</label>
                  <input
                    type="number"
                    required
                    value={attendeesCount}
                    onChange={e => setAttendeesCount(Number(e.target.value))}
                    className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Agenda Topics (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Water supply pipeline maintenance&#10;Primary school classroom repairs"
                  value={agendaText}
                  onChange={e => setAgendaText(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">Decisions Taken (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Approved ₹30 Lakhs fund release&#10;Instructed engineer to complete work in 15 days"
                  value={decisionsText}
                  onChange={e => setDecisionsText(e.target.value)}
                  className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block mb-1">MoM Summary Statement</label>
                <textarea
                  rows={2}
                  placeholder="Final remarks or closing observations..."
                  value={momSummary}
                  onChange={e => setMomSummary(e.target.value)}
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
                  Save & Publish MoM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
