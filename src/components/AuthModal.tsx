import React, { useState } from 'react';
import { 
  ShieldCheck, Landmark, Users, Globe2, X, ArrowRight, UserCheck, 
  MapPin, CheckCircle2, AlertCircle, Building2, UserRound, KeyRound,
  Lock, Check, LogOut, Info
} from 'lucide-react';
import { UserProfile, UserRole, AdministrativeLevel } from '../types/governance';
import { AuthSession, UserCategory, getUserCategoryFromRole } from '../types/auth';
import { DEMO_USERS, AP_DEPARTMENTS, AP_DISTRICTS } from '../data/governanceData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  onSelectUser: (user: UserProfile, explicitCategory?: UserCategory) => void;
  onLoginWithCredentials: (identifier: string, pass: string, category: UserCategory) => Promise<AuthSession>;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  session,
  onSelectUser,
  onLoginWithCredentials,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'quick_switch' | 'credential_login' | 'session_info'>('quick_switch');
  const [targetCategory, setTargetCategory] = useState<UserCategory>('Official');
  const [loginIdentifier, setLoginIdentifier] = useState('officer@ap.gov.in');
  const [loginPassword, setLoginPassword] = useState('GovtPass@2025');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentCategory = session.category;
  const currentUser = session.user;

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await onLoginWithCredentials(loginIdentifier, loginPassword, targetCategory);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const getRolePresetForCategory = (cat: UserCategory) => {
    if (cat === 'Administrator') return DEMO_USERS.filter(u => u.role === 'chief_minister' || u.role === 'deputy_cm');
    if (cat === 'Official') return DEMO_USERS.filter(u => u.role !== 'chief_minister' && u.role !== 'deputy_cm' && u.role !== 'citizen');
    return DEMO_USERS.filter(u => u.role === 'citizen');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a2947] to-[#04162a] border border-[#2a668d] rounded-2xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {/* Header Emblem */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-full border-2 border-[#65d6c5] flex items-center justify-center bg-radial from-[#0b6c66] to-[#06263b] shadow-[0_0_20px_rgba(23,198,164,0.3)] mb-2.5">
            <span className="font-extrabold text-xl text-[#a6ffe8]">AP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Single Sign-On & RBAC Gateway
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/70 mt-0.5 max-w-md">
            Simulated secure session management with distinct clearance for Citizens, Officials, and Administrators
          </p>

          {/* Current Session Pill */}
          <div className="mt-3 inline-flex items-center gap-2 bg-[#04182e] border border-[#1b4e78] px-3.5 py-1.5 rounded-full text-xs">
            <span className="text-gray-400">Current Session:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
              currentCategory === 'Administrator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              currentCategory === 'Official' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {currentCategory}
            </span>
            <span className="text-white font-medium">• {currentUser.name}</span>
          </div>
        </div>

        {/* 3-Category Selector Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            {
              id: 'Citizen',
              label: 'Citizen',
              desc: 'Public view, submit & track grievances, transparent ledgers',
              icon: Globe2,
              tone: 'emerald'
            },
            {
              id: 'Official',
              label: 'Official',
              desc: 'MLAs, Ministers, Collectors, Sarpanch: publish works & resolve petitions',
              icon: Landmark,
              tone: 'blue'
            },
            {
              id: 'Administrator',
              label: 'Administrator',
              desc: 'State Cabinet / CM: Full governance control, issue GOs & treasury audits',
              icon: ShieldCheck,
              tone: 'amber'
            }
          ].map(cat => {
            const Icon = cat.icon;
            const isSelected = targetCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setTargetCategory(cat.id as UserCategory);
                  if (cat.id === 'Administrator') {
                    setLoginIdentifier('cm@ap.gov.in');
                  } else if (cat.id === 'Official') {
                    setLoginIdentifier('collector.guntur@ap.gov.in');
                  } else {
                    setLoginIdentifier('citizen@ap.gov.in');
                  }
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? cat.tone === 'amber'
                      ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : cat.tone === 'blue'
                      ? 'bg-blue-950/40 border-blue-400 shadow-md ring-1 ring-blue-400'
                      : 'bg-emerald-950/40 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                    : 'bg-[#071f3a] border-[#184268] hover:bg-[#0b2c4e]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon size={18} className={
                      cat.tone === 'amber' ? 'text-amber-400' :
                      cat.tone === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                    } />
                    {currentCategory === cat.id && (
                      <span className="text-[9px] bg-cyan-900 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{cat.label}</h4>
                  <p className="text-[10px] text-gray-300 mt-1 line-clamp-2 leading-tight">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center text-[10px] font-semibold text-cyan-300">
                  Select Role &rarr;
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#071d36] p-1 rounded-xl border border-[#1b4b6c] mb-5 text-xs">
          <button
            onClick={() => setActiveTab('quick_switch')}
            className={`flex-1 py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quick_switch' 
                ? 'bg-gradient-to-r from-[#0d91e8] to-[#0969ad] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserCheck size={14} /> Quick Switch ({targetCategory})
          </button>
          <button
            onClick={() => setActiveTab('credential_login')}
            className={`flex-1 py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credential_login' 
                ? 'bg-gradient-to-r from-[#0d91e8] to-[#0969ad] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound size={14} /> Mock Password Auth
          </button>
          <button
            onClick={() => setActiveTab('session_info')}
            className={`flex-1 py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'session_info' 
                ? 'bg-gradient-to-r from-[#0d91e8] to-[#0969ad] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info size={14} /> Session Token
          </button>
        </div>

        {/* TAB 1: QUICK SWITCH */}
        {activeTab === 'quick_switch' && (
          <div className="space-y-2.5">
            <div className="text-xs text-cyan-200/90 mb-1 flex items-center justify-between">
              <span>Switch directly into an authorized <b>{targetCategory}</b> profile:</span>
              <span className="text-[11px] text-gray-400">Instant RBAC reload</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {getRolePresetForCategory(targetCategory).map(user => {
                const isCurrentActive = currentUser.id === user.id && currentCategory === targetCategory;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user, targetCategory);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                      isCurrentActive
                        ? 'bg-[#0f4b73] border-cyan-400 shadow-md ring-1 ring-cyan-400'
                        : 'bg-[#072442]/70 border-[#1a4b70] hover:bg-[#0c375e] hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-900/60 border border-cyan-400/40 flex items-center justify-center font-bold text-xs text-cyan-200 flex-none">
                        {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-gray-100 group-hover:text-cyan-300 transition-colors">
                            {user.name}
                          </h4>
                          {isCurrentActive && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                              <CheckCircle2 size={10} /> Active Session
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-cyan-200/80">{user.designation}</p>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {user.jurisdiction}
                        </span>
                      </div>
                    </div>

                    <button className="text-xs bg-cyan-600/80 group-hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      Activate <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIAL LOGIN */}
        {activeTab === 'credential_login' && (
          <form onSubmit={handleCredentialSubmit} className="space-y-4 text-xs">
            <div className="bg-[#031526] p-3 rounded-xl border border-[#143d63] text-[11px] text-cyan-200">
              Simulating enterprise login for <b>{targetCategory}</b> role clearance.
            </div>

            <div>
              <label className="text-gray-300 font-medium block mb-1">Official Email or Registered Mobile</label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium block mb-1">Secure Password / OTP Token</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#041a2d] border border-[#244e6e] rounded-lg p-2.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300 text-xs flex items-center gap-1.5">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Validating Session Token...</span>
              ) : (
                <>
                  <Lock size={15} /> Authenticate as {targetCategory}
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: SESSION INFO & AUDIT */}
        {activeTab === 'session_info' && (
          <div className="space-y-3 text-xs">
            <div className="bg-[#04172c] border border-[#163f64] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#143654]">
                <span className="text-gray-400">Session Bearer Token:</span>
                <span className="font-mono text-[11px] text-cyan-300">{session.token}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Authenticated At:</span>
                <span className="text-white">{new Date(session.loginTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Valid Until:</span>
                <span className="text-emerald-400">{new Date(session.expiresAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Assigned Category:</span>
                <b className="text-cyan-300">{session.category}</b>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-2">Effective RBAC Permissions:</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {Object.entries(session.permissions).map(([perm, allowed]) => (
                  <div key={perm} className="flex items-center gap-2 p-2 rounded bg-[#031526] border border-[#143a5c]">
                    <span className={`w-2 h-2 rounded-full ${allowed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-gray-300 capitalize">
                      {perm.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} /> Clear Secure Session (Revert to Public Citizen)
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-[#183d5f] flex items-center justify-between text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-cyan-400" />
            Andhra Pradesh e-Governance Security Standard
          </span>
          <span>Role-Based Access Control (RBAC)</span>
        </div>
      </div>
    </div>
  );
};
