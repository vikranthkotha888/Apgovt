import React, { useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowRight, BarChart3, Bell, Building2, CalendarDays,
  ChevronDown, ChevronRight, CircleDollarSign, ClipboardList, FileText, FolderKanban,
  Gauge, Globe2, Home, Landmark, LayoutDashboard, ListChecks, Map, Menu, MessageSquare,
  Network, PieChart, Search, Settings, ShieldCheck, UserRound, Users, X, Zap, CheckCircle2,
  Phone, Mail, ArrowUpRight, Award, LogOut, KeyRound, Lock
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, Cell, PieChart as RPieChart, Pie, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useGovernanceStore } from "./context/GovernanceContext";
import { AP_DISTRICTS, AP_DEPARTMENTS } from "./data/governanceData";
import { AuthModal } from "./components/AuthModal";
import { DepartmentPortal } from "./components/DepartmentPortal";
import { GrievanceModule } from "./components/GrievanceModule";
import { ProjectsManager } from "./components/ProjectsManager";
import { GOOrdersManager } from "./components/GOOrdersManager";
import { MeetingsManager } from "./components/MeetingsManager";
import { RepresentativesProfile } from "./components/RepresentativesProfile";
import { BudgetTransparency } from "./components/BudgetTransparency";
import { LocalBodiesManager } from "./components/LocalBodiesManager";
import { PanchayatHealthIndexWidget } from "./components/PanchayatHealthIndexWidget";
import { AccurateAPMap } from "./components/AccurateAPMap";

export default function App() {
  const {
    session,
    currentUser,
    userCategory,
    permissions,
    loginUser,
    loginWithCredentials,
    logoutUser,
    projects,
    addProject,
    updateProject,
    gos,
    addGovernmentOrder,
    meetings,
    addMeeting,
    grievances,
    submitGrievance,
    updateGrievanceStatus,
    schemes,
    language,
    setLanguage,
    liveBudget,
    isSyncingOpenData,
    lastOpenDataSync,
    refreshGovOpenData
  } = useGovernanceStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentNav, setCurrentNav] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("All Districts");

  // Notifications popup state
  const [notifOpen, setNotifOpen] = useState(false);

  // Filtered projects for home preview
  const filteredHomeProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDist = selectedDistrictName === "All Districts" || p.district === selectedDistrictName;
      return matchSearch && matchDist;
    });
  }, [projects, searchQuery, selectedDistrictName]);

  // Chart data for home funds
  const fundData = [
    { name: "Released", value: 98320, color: "#19c78b" },
    { name: "Sanctioned", value: 76210, color: "#22a7ff" },
    { name: "Expenditure", value: 58760, color: "#f39a42" },
    { name: "Balance", value: 41670, color: "#8b5cf6" }
  ];

  const trendData = [
    { month: "Jan", projects: 2400, expenditure: 4200 },
    { month: "Feb", projects: 3100, expenditure: 5100 },
    { month: "Mar", projects: 3550, expenditure: 6100 },
    { month: "Apr", projects: 4200, expenditure: 7200 },
    { month: "May", projects: 4650, expenditure: 8300 },
    { month: "Jun", projects: 5120, expenditure: 9100 }
  ];

  const expenditureDeptData = [
    { name: "Rural Development", value: 18.2 },
    { name: "Education", value: 14.7 },
    { name: "Health", value: 12.6 },
    { name: "Irrigation", value: 11.3 },
    { name: "Roads & Buildings", value: 9.8 },
    { name: "Women & Child", value: 7.5 },
    { name: "Others", value: 25.9 }
  ];

  // Navigation structure
  const navGroups = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "state_overview", label: "State Overview", icon: Activity },
    { id: "districts", label: "26 Districts", icon: Map },
    { id: "local_bodies", label: "Local Bodies & Panchayats", icon: Building2 },
    { id: "representatives", label: "Elected Representatives", icon: Users },
    { id: "departments", label: "Government Departments", icon: Landmark },
    { id: "projects", label: "Projects & Works", icon: FolderKanban },
    { id: "budget", label: "Funds & Budget", icon: CircleDollarSign },
    { id: "gos", label: "Government Orders (GOs)", icon: FileText },
    { id: "meetings", label: "Meetings & MOMs", icon: MessageSquare },
    { id: "grievances", label: "Public Grievances (Spandana)", icon: ShieldCheck }
  ];

  return (
    <div className="app">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand-mobile">
          <div className="emblem">AP</div>
          <div>
            <b>Government of Andhra Pradesh</b>
            <small>Governance Intelligence</small>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 p-1">
            <X size={20} />
          </button>
        </div>

        <nav>
          {navGroups.map(item => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentNav(item.id);
                  setSidebarOpen(false);
                }}
                className={isActive ? "active" : ""}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "grievances" && grievances.length > 0 && (
                  <span className="ml-auto text-[9px] bg-red-500/80 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session Status Card in Sidebar */}
        <div className="mt-auto pt-3 border-t border-[#164265]">
          <div 
            onClick={() => setAuthModalOpen(true)}
            className="p-2.5 rounded-xl bg-[#092745] border border-[#1b4b6c] hover:border-cyan-400 cursor-pointer transition-all flex items-center gap-2.5"
          >
            <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border flex-none ${
              userCategory === 'Administrator' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              userCategory === 'Official' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white block truncate">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${
                  userCategory === 'Administrator' ? 'bg-amber-950 text-amber-300 border border-amber-700/50' :
                  userCategory === 'Official' ? 'bg-blue-950 text-blue-300 border border-blue-700/50' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                }`}>
                  {userCategory}
                </span>
                <span className="text-[9px] text-gray-400 truncate">{currentUser.designation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="quote">
          “<br />
          <span>Development is not a destination.<br />It is a journey we build together.</span>
          <small>— Government of Andhra Pradesh</small>
        </div>

        <div className="side-footer">
          ◉ Govt of AP Portal • RBAC Active
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="header-brand">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="emblem">AP</div>
            <div>
              <h1>Government of Andhra Pradesh</h1>
              <p>Governance Intelligence & Public Transparency Portal</p>
              <div className="tagline">
                Transparent Governance &nbsp; | &nbsp; Sustainable Development &nbsp; | &nbsp; Citizen Empowerment
              </div>
            </div>
          </div>

          <div className="header-visual">
            Andhra Pradesh<span>Builds a Better Tomorrow</span>
          </div>

          <div className="header-actions">
            <div className="global-search">
              <Search size={16} />
              <input
                placeholder="Search districts, projects, GOs, schemes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={19} />
                <i>3</i>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#071f3a] border border-[#1b4b6c] rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="font-bold text-white border-b border-[#163c5e] pb-2 mb-2 flex items-center justify-between">
                    <span>Recent Administrative Alerts</span>
                    <span className="text-[10px] text-cyan-300">Live</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-gray-300">
                    <p className="p-1.5 rounded bg-[#04172c]">
                      • <b>New GO Released:</b> G.O.Ms. No.45 (Rural Roads)
                    </p>
                    <p className="p-1.5 rounded bg-[#04172c]">
                      • <b>DDRC Meeting:</b> Minutes published for Guntur District
                    </p>
                    <p className="p-1.5 rounded bg-[#04172c]">
                      • <b>Spandana:</b> 12 New Grievances assigned to PRRD
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RBAC Session Indicator & User Profile Button */}
            <button 
              className="user-btn hover:border-cyan-400 transition-colors" 
              onClick={() => setAuthModalOpen(true)}
            >
              <span className={`avatar ${
                userCategory === 'Administrator' ? 'bg-amber-600' :
                userCategory === 'Official' ? 'bg-blue-600' :
                'bg-emerald-600'
              }`}>
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
              <span>
                <div className="flex items-center gap-1.5">
                  <b>{currentUser.name}</b>
                  <span className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded ${
                    userCategory === 'Administrator' ? 'bg-amber-950 text-amber-300' :
                    userCategory === 'Official' ? 'bg-blue-950 text-blue-300' :
                    'bg-emerald-950 text-emerald-300'
                  }`}>
                    {userCategory}
                  </span>
                </div>
                <small>{currentUser.designation}</small>
              </span>
              <ChevronDown size={15} />
            </button>
          </div>

          <div className="language">
            <button 
              onClick={() => setLanguage('en')}
              className={language === 'en' ? "font-bold text-cyan-300" : "text-gray-400"}
            >
              English
            </button>
            &nbsp; | &nbsp;
            <button 
              onClick={() => setLanguage('te')}
              className={language === 'te' ? "font-bold text-cyan-300" : "text-gray-400"}
            >
              తెలుగు
            </button>
          </div>
        </header>

        {/* Global Banner for Active Role */}
        <div className="bg-[#051c33] border-b border-[#133c5e] px-4 py-1.5 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              userCategory === 'Administrator' ? 'bg-amber-400' :
              userCategory === 'Official' ? 'bg-blue-400' :
              'bg-emerald-400'
            }`} />
            <span>
              Secure RBAC Session: <b className="text-white">{userCategory} Mode</b> ({currentUser.name} - {currentUser.jurisdiction})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Permissions: {permissions.canPublishProjects ? '✓ Publish Works' : 'View Only'} • {permissions.canIssueGOs ? '✓ Issue Orders' : 'Public Access'}
            </span>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-[11px] bg-[#0c375c] hover:bg-cyan-600 text-cyan-200 hover:text-white px-2.5 py-0.5 rounded-lg border border-[#215783] transition-colors flex items-center gap-1"
            >
              <KeyRound size={11} /> Switch Role
            </button>
          </div>
        </div>

        {/* View Switcher based on currentNav */}
        <main>
          {currentNav === "home" && (
            <>
              {/* Welcome Hero */}
              <section className="welcome">
                <div className="welcome-copy">
                  <span>Welcome to</span>
                  <h2>Andhra Pradesh Governance Intelligence</h2>
                  <p>
                    One Platform &nbsp; | &nbsp; Village to State Development &nbsp; | &nbsp; Real-Time Fund Transparency
                  </p>
                </div>
                <div className="welcome-search">
                  <Search size={18} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for schemes, projects, GOs, departments, locations..."
                  />
                  {searchQuery && <X size={15} onClick={() => setSearchQuery("")} className="cursor-pointer" />}
                </div>
              </section>

              {/* Statistics Grid */}
              <section className="stats-grid">
                <div 
                  className="stat-card cyan cursor-pointer"
                  onClick={() => setCurrentNav("districts")}
                >
                  <div className="stat-icon"><Map size={21} /></div>
                  <div>
                    <div className="muted">Total Districts</div>
                    <strong>26</strong>
                  </div>
                  <ArrowRight className="stat-arrow" size={16} />
                  <span className="view-all">View All</span>
                </div>

                <div 
                  className="stat-card blue cursor-pointer"
                  onClick={() => setCurrentNav("local_bodies")}
                >
                  <div className="stat-icon"><Globe2 size={21} /></div>
                  <div>
                    <div className="muted">Total Mandals</div>
                    <strong>685</strong>
                  </div>
                  <ArrowRight className="stat-arrow" size={16} />
                  <span className="view-all">Explore</span>
                </div>

                <div 
                  className="stat-card green cursor-pointer"
                  onClick={() => setCurrentNav("local_bodies")}
                >
                  <div className="stat-icon"><Home size={21} /></div>
                  <div>
                    <div className="muted">Gram Panchayats</div>
                    <strong>12,769</strong>
                  </div>
                  <ArrowRight className="stat-arrow" size={16} />
                  <span className="view-all">Panchayats</span>
                </div>

                <div 
                  className="stat-card purple cursor-pointer"
                  onClick={() => setCurrentNav("local_bodies")}
                >
                  <div className="stat-icon"><Building2 size={21} /></div>
                  <div>
                    <div className="muted">Urban Municipalities</div>
                    <strong>119</strong>
                  </div>
                  <ArrowRight className="stat-arrow" size={16} />
                  <span className="view-all">Municipalities</span>
                </div>
              </section>

              {/* Top Dashboard Grid (Map, Funds, Quick Actions, Projects, Updates) */}
              <section className="dashboard-grid top-grid">
                {/* AP Interactive Map Panel */}
                <div className="map-panel">
                  <div className="map-top">
                    <h3>Andhra Pradesh — District View</h3>
                    <select
                      value={selectedDistrictName}
                      onChange={e => setSelectedDistrictName(e.target.value)}
                    >
                      <option>All Districts</option>
                      {AP_DISTRICTS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="map-body">
                    <div className="district-list">
                      {AP_DISTRICTS.map((d, i) => (
                        <div 
                          key={d.id}
                          className="cursor-pointer"
                          onClick={() => setSelectedDistrictName(d.name)}
                        >
                          <span className={`dot d${i % 7}`} />
                          <span>{d.name}</span>
                          <b>{d.panchayatsCount.toLocaleString()}</b>
                          <small>({(d.panchayatsCount / 127.69).toFixed(1)}%)</small>
                        </div>
                      ))}
                    </div>

                    <AccurateAPMap
                      selectedDistrict={selectedDistrictName}
                      onSelectDistrict={setSelectedDistrictName}
                    />
                  </div>

                  <div className="map-tabs">
                    <button className="selected">
                      Map
                    </button>
                    <button onClick={() => setCurrentNav("districts")}>
                      List
                    </button>
                  </div>
                </div>

                {/* Funds Donut */}
                <div className="panel funds">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><CircleDollarSign size={16} /></span>
                      <h3>Funds & Budget (FY 2025–26)</h3>
                    </div>
                    <button onClick={() => setCurrentNav("budget")}>
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="fund-content">
                    <div className="donut">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie 
                            data={fundData} 
                            dataKey="value" 
                            innerRadius="64%" 
                            outerRadius="90%" 
                            paddingAngle={2}
                          >
                            {fundData.map(x => (
                              <Cell key={x.name} fill={x.color} />
                            ))}
                          </Pie>
                        </RPieChart>
                      </ResponsiveContainer>
                      <div className="donut-center">
                        <b>₹ 1,25,430 Cr</b>
                        <span>Total Allocation</span>
                      </div>
                    </div>

                    <div className="fund-legend">
                      {fundData.map((x, i) => (
                        <div key={x.name}>
                          <span className="legend-dot" style={{ background: x.color }} />
                          <span>{x.name}</span>
                          <b>₹ {x.value.toLocaleString()} Cr</b>
                          <small>{[78.3, 60.7, 46.8, 33.2][i]}%</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="panel quick">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><Zap size={16} /></span>
                      <h3>Quick Services</h3>
                    </div>
                  </div>

                  <div className="quick-grid">
                    <button className="q0" onClick={() => setCurrentNav("gos")}>
                      <Search size={21} />
                      <span>Search GO</span>
                    </button>
                    <button className="q1" onClick={() => setCurrentNav("projects")}>
                      <Gauge size={21} />
                      <span>Track Project</span>
                    </button>
                    <button className="q2" onClick={() => setCurrentNav("local_bodies")}>
                      <Users size={21} />
                      <span>Panchayats</span>
                    </button>
                    <button className="q3" onClick={() => setCurrentNav("budget")}>
                      <CircleDollarSign size={21} />
                      <span>Treasury Funds</span>
                    </button>
                    <button className="q4" onClick={() => setCurrentNav("meetings")}>
                      <CalendarDays size={21} />
                      <span>Cabinet MoMs</span>
                    </button>
                    <button className="q5" onClick={() => setCurrentNav("grievances")}>
                      <ShieldCheck size={21} />
                      <span>Lodge Grievance</span>
                    </button>
                  </div>
                </div>

                {/* Projects Stats Panel */}
                <div className="panel projects">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><FolderKanban size={16} /></span>
                      <h3>Development Works Tracker</h3>
                    </div>
                    <button onClick={() => setCurrentNav("projects")}>
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="project-stats">
                    <div className="pstat cursor-pointer" onClick={() => setCurrentNav("projects")}>
                      <span className="cyan"><FolderKanban size={20} /></span>
                      <small>Total Projects</small>
                      <b>{projects.length + 24500}</b>
                    </div>
                    <div className="pstat cursor-pointer" onClick={() => setCurrentNav("projects")}>
                      <span className="green"><ListChecks size={20} /></span>
                      <small>Completed</small>
                      <b>16,842</b>
                    </div>
                    <div className="pstat cursor-pointer" onClick={() => setCurrentNav("projects")}>
                      <span className="orange"><CalendarDays size={20} /></span>
                      <small>Ongoing</small>
                      <b>5,213</b>
                    </div>
                    <div className="pstat cursor-pointer" onClick={() => setCurrentNav("projects")}>
                      <span className="red"><AlertCircle size={20} /></span>
                      <small>Pending</small>
                      <b>2,477</b>
                    </div>
                  </div>
                </div>

                {/* Latest Updates */}
                <div className="panel updates">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><Bell size={16} /></span>
                      <h3>Gazette & Administrative Bulletins</h3>
                    </div>
                    <button onClick={() => setCurrentNav("gos")}>
                      All Bulletins <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {gos.slice(0, 4).map(go => (
                      <div 
                        key={go.id} 
                        className="update cursor-pointer hover:bg-white/5 rounded p-1 transition-colors"
                        onClick={() => setCurrentNav("gos")}
                      >
                        <div className="update-icon"><FileText size={15} /></div>
                        <div>
                          <b>{go.goNumber}</b>
                          <p>{go.subject}</p>
                          <small>{go.date} • {go.departmentName}</small>
                        </div>
                        <span className="badge go">{go.documentType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4 Feature Cards */}
              <section className="feature-grid">
                <div className="feature f0 cursor-pointer" onClick={() => setCurrentNav("representatives")}>
                  <div className="feature-image"><Users size={24} /></div>
                  <h3>Public Leadership</h3>
                  <p>Chief Minister | Deputy CM | Ministers | MPs | MLAs | Sarpanches</p>
                  <button>Directory & Profiles <ArrowRight size={13} /></button>
                </div>

                <div className="feature f1 cursor-pointer" onClick={() => setCurrentNav("gos")}>
                  <div className="feature-image"><FileText size={24} /></div>
                  <h3>Government Orders (GOs)</h3>
                  <p>Digital e-Gazette, financial sanctions, circulars, and departmental memos</p>
                  <button>Search & Download <ArrowRight size={13} /></button>
                </div>

                <div className="feature f2 cursor-pointer" onClick={() => setCurrentNav("departments")}>
                  <div className="feature-image"><Building2 size={24} /></div>
                  <h3>Departmental Portals</h3>
                  <p>PRRD, MAUD, Roads & Buildings, Water Resources, Health, Education</p>
                  <button>Explore Portals <ArrowRight size={13} /></button>
                </div>

                <div className="feature f3 cursor-pointer" onClick={() => setCurrentNav("meetings")}>
                  <div className="feature-image"><MessageSquare size={24} /></div>
                  <h3>Meetings & MOMs</h3>
                  <p>Cabinet decisions, Zilla Parishad reviews, DDRC action items</p>
                  <button>Track Proceedings <ArrowRight size={13} /></button>
                </div>
              </section>

              {/* Panchayat Health Index (PHI) Performance Engine */}
              <section className="mt-4">
                <PanchayatHealthIndexWidget />
              </section>

              {/* Bottom Dashboard Grid: Recent Projects, Snapshot, Expenditure */}
              <section className="dashboard-grid bottom-grid">
                {/* Recent Projects Table */}
                <div className="panel recent">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><FolderKanban size={16} /></span>
                      <h3>Live Development Works In Progress</h3>
                    </div>
                    <button onClick={() => setCurrentNav("projects")}>
                      View All Works <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Project Name</th>
                          <th>Location / Level</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Sanction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHomeProjects.slice(0, 5).map(p => (
                          <tr 
                            key={p.id}
                            className="cursor-pointer hover:bg-white/5"
                            onClick={() => setCurrentNav("projects")}
                          >
                            <td>
                              <span className="table-icon"><FolderKanban size={13} /></span>
                              {p.title}
                            </td>
                            <td>{p.villageOrWard}, {p.district}</td>
                            <td>{p.departmentName.split(' ')[0]}</td>
                            <td>
                              <span className={`status ${p.status.toLowerCase().replace(' ', '')}`}>
                                {p.status}
                              </span>
                            </td>
                            <td>
                              ₹ {(p.sanctionedAmountLakhs / 100).toFixed(2)} Cr
                              <ChevronRight size={13} className="inline ml-1 text-cyan-400" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* State Development Snapshot */}
                <div className="panel snapshot">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><BarChart3 size={16} /></span>
                      <h3>State Development Indicators</h3>
                    </div>
                    <button onClick={() => setCurrentNav("state_overview")}>
                      Indicators <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="snapshot-hero">
                    <div className="hero-stat">
                      <b>67.4%</b>
                      <span>Literacy Rate</span>
                    </div>
                    <div className="hero-stat">
                      <b>₹ 2,41,706</b>
                      <span>Per Capita Income</span>
                    </div>
                    <div className="hero-stat">
                      <b>52.3%</b>
                      <span>Employment Rate</span>
                    </div>
                    <div className="hero-stat">
                      <b>11.2%</b>
                      <span>GSDP Growth</span>
                    </div>
                  </div>

                  <div className="trend">
                    <ResponsiveContainer width="100%" height={95}>
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="areaTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22a7ff" stopOpacity={0.55} />
                            <stop offset="100%" stopColor="#22a7ff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#193858" vertical={false} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ background: "#071b33", border: "1px solid #234b70", borderRadius: 8 }}
                        />
                        <Area type="monotone" dataKey="expenditure" stroke="#22a7ff" fill="url(#areaTrend)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="quote-small">
                    “Progress is not just about infrastructure, it’s about improving lives.”
                  </p>
                </div>

                {/* Top Departments Expenditure */}
                <div className="panel expenditure">
                  <div className="section-title">
                    <div className="title-left">
                      <span className="title-icon"><PieChart size={16} /></span>
                      <h3>Top Expenditure Heads</h3>
                    </div>
                    <button onClick={() => setCurrentNav("budget")}>
                      Breakdown <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="exp-body">
                    <div className="exp-donut">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie data={expenditureDeptData} dataKey="value" innerRadius="61%" outerRadius="87%">
                            {expenditureDeptData.map((x, i) => (
                              <Cell 
                                key={x.name} 
                                fill={["#19c78b", "#22a7ff", "#8b5cf6", "#f39a42", "#ef5b65", "#ec72b8", "#8da1b8"][i % 7]} 
                              />
                            ))}
                          </Pie>
                        </RPieChart>
                      </ResponsiveContainer>
                      <div className="exp-center">
                        <b>₹ 58,760 Cr</b>
                        <span>Total Exp</span>
                      </div>
                    </div>

                    <div className="exp-list">
                      {expenditureDeptData.map((x, i) => (
                        <div key={x.name}>
                          <i style={{ background: ["#19c78b", "#22a7ff", "#8b5cf6", "#f39a42", "#ef5b65", "#ec72b8", "#8da1b8"][i % 7] }} />
                          {x.name}
                          <b>{x.value}%</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Dedicated Sub-Pages */}
          {currentNav === "departments" && (
            <DepartmentPortal
              currentUser={currentUser}
              projects={projects}
              gos={gos}
              schemes={schemes}
              onOpenNewProjectModal={() => setCurrentNav("projects")}
              onOpenNewGOModal={() => setCurrentNav("gos")}
            />
          )}

          {currentNav === "grievances" && (
            <GrievanceModule
              currentUser={currentUser}
              grievances={grievances}
              onSubmitGrievance={submitGrievance}
              onUpdateStatus={updateGrievanceStatus}
            />
          )}

          {currentNav === "projects" && (
            <ProjectsManager
              currentUser={currentUser}
              projects={projects}
              onAddProject={addProject}
              onUpdateProject={updateProject}
            />
          )}

          {currentNav === "gos" && (
            <GOOrdersManager
              currentUser={currentUser}
              gos={gos}
              onAddGO={addGovernmentOrder}
              isSyncing={isSyncingOpenData}
              onRefreshLiveFeed={refreshGovOpenData}
              lastSyncTime={lastOpenDataSync}
            />
          )}

          {currentNav === "meetings" && (
            <MeetingsManager
              currentUser={currentUser}
              meetings={meetings}
              onAddMeeting={addMeeting}
            />
          )}

          {currentNav === "representatives" && (
            <RepresentativesProfile
              currentUser={currentUser}
              projects={projects}
              gos={gos}
            />
          )}

          {currentNav === "budget" && (
            <BudgetTransparency
              liveBudget={liveBudget}
              isSyncing={isSyncingOpenData}
              lastSyncTime={lastOpenDataSync}
              onRefreshLiveFeed={refreshGovOpenData}
            />
          )}

          {currentNav === "local_bodies" && (
            <LocalBodiesManager />
          )}

          {currentNav === "districts" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-1">
                  Andhra Pradesh — All 26 Administrative Districts
                </h2>
                <p className="text-xs text-cyan-200">
                  Detailed profile, mandals, panchayats, allocated budgets and developmental activity
                </p>
              </div>

              {/* Geographical Interactive Map Card */}
              <div className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-4 shadow-xl">
                <AccurateAPMap
                  selectedDistrict={selectedDistrictName}
                  onSelectDistrict={setSelectedDistrictName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AP_DISTRICTS.map(dist => (
                  <div key={dist.id} className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 hover:border-cyan-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        HQ: {dist.headquarters}
                      </span>
                      <span className="text-[10px] text-gray-400">Pop: {dist.population}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">{dist.name} District</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#04172c] p-3 rounded-xl border border-[#163f64] mb-3">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Mandals</span>
                        <b className="text-white">{dist.mandalsCount} Mandals</b>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Gram Panchayats</span>
                        <b className="text-cyan-300">{dist.panchayatsCount.toLocaleString()}</b>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Fund Outlay</span>
                        <b className="text-emerald-400">₹ {dist.totalFundsAllocatedCr.toLocaleString()} Cr</b>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Utilized</span>
                        <b className="text-amber-400">₹ {dist.totalFundsSpentCr.toLocaleString()} Cr</b>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-[#143758]">
                      <span className="text-cyan-200 font-medium">
                        Active Works: <b>{dist.activeProjects}</b>
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedDistrictName(dist.name);
                          setCurrentNav("projects");
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        View District Works &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentNav === "state_overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-1">
                  Andhra Pradesh Comprehensive State Overview
                </h2>
                <p className="text-xs text-cyan-200">
                  Macro-economic indicators, state development goals, and infrastructure milestones
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "State GSDP", value: "₹ 14.4 Lakh Cr", desc: "Constant growth rate 11.2%" },
                  { title: "Ease of Doing Business", value: "Rank #1", desc: "Top achiever in India" },
                  { title: "Coastal Corridor", value: "974 Km", desc: "2nd longest coastline in India" },
                  { title: "Drinking Water Tap Grid", value: "84.2%", desc: "12,769 Panchayats target" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#071f3a] border border-[#1b4b6c] p-4 rounded-xl">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{item.title}</span>
                    <strong className="text-lg text-cyan-300 font-bold block mt-1">{item.value}</strong>
                    <small className="text-xs text-gray-400 mt-1 block">{item.desc}</small>
                  </div>
                ))}
              </div>

              <div className="bg-[#071f3a] border border-[#1b4b6c] p-6 rounded-2xl text-xs text-gray-300 space-y-3">
                <h3 className="text-sm font-bold text-white">Amaravati Capital Region & State Mission Directives</h3>
                <p className="leading-relaxed">
                  The Government of Andhra Pradesh is committed to transparent governance from the village secretariat to the state assembly. 
                  Every rupee sanctioned under central and state budgets is mapped with geo-tagged verification, online beneficiary transfers, 
                  and real-time public scrutiny through this centralized transparency portal.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Global Portal Footer */}
        <footer>
          <div className="flex flex-wrap items-center gap-4">
            <span>◉ Government of Andhra Pradesh</span>
            <span>e-Governance Intelligence & Public Transparency Platform</span>
            <span>NIC AP State Data Centre Hosted</span>
          </div>
          <div>
            <span>Verified Citizen Portal • Open Data Standard</span>
          </div>
        </footer>
      </div>

      {/* Floating Login / Role Switcher Button */}
      <button 
        className="floating-login"
        onClick={() => setAuthModalOpen(true)}
      >
        <UserRound size={17} />
        <span>
          {userCategory}: {currentUser.name}
        </span>
      </button>

      {/* RBAC Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        session={session}
        onSelectUser={loginUser}
        onLoginWithCredentials={loginWithCredentials}
        onLogout={logoutUser}
      />
    </div>
  );
}
