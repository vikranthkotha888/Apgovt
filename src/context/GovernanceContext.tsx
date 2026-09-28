import { useState, useEffect, useCallback } from 'react';
import { UserProfile, DevelopmentProject, GovernmentOrder, OfficialMeeting, Grievance, SchemeSubsidy } from '../types/governance';
import { AuthSession, UserCategory } from '../types/auth';
import { DEMO_USERS, INITIAL_PROJECTS, INITIAL_GOS, INITIAL_MEETINGS, INITIAL_GRIEVANCES, SCHEMES_LIST } from '../data/governanceData';
import { MockAuthService } from '../services/mockAuthService';
import { GovOpenDataService, LiveBudgetSummary } from '../services/govOpenDataService';

const STORAGE_KEYS = {
  PROJECTS: 'ap_gov_projects',
  GOS: 'ap_gov_gos',
  MEETINGS: 'ap_gov_meetings',
  GRIEVANCES: 'ap_gov_grievances',
  SCHEMES: 'ap_gov_schemes',
  LANGUAGE: 'ap_gov_language'
};

export function useGovernanceStore() {
  // Session State (persists across reloads & navigations via localStorage)
  const [session, setSession] = useState<AuthSession>(() => {
    const existing = MockAuthService.getSession();
    if (existing) return existing;
    // Default initial session: Administrator (Chief Minister)
    return MockAuthService.createSession(DEMO_USERS[0], 'Administrator');
  });

  const currentUser = session.user;
  const userCategory: UserCategory = session.category;
  const permissions = session.permissions;

  const [projects, setProjects] = useState<DevelopmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [gos, setGos] = useState<GovernmentOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOS);
      return saved ? JSON.parse(saved) : INITIAL_GOS;
    } catch {
      return INITIAL_GOS;
    }
  });

  const [meetings, setMeetings] = useState<OfficialMeeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
    } catch {
      return INITIAL_MEETINGS;
    }
  });

  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
      return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
    } catch {
      return INITIAL_GRIEVANCES;
    }
  });

  const [schemes, setSchemes] = useState<SchemeSubsidy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEMES);
      return saved ? JSON.parse(saved) : SCHEMES_LIST;
    } catch {
      return SCHEMES_LIST;
    }
  });

  const [language, setLanguage] = useState<'en' | 'te'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (saved as 'en' | 'te') || 'en';
    } catch {
      return 'en';
    }
  });

  // Live Open Data State
  const [liveBudget, setLiveBudget] = useState<LiveBudgetSummary | null>(null);
  const [isSyncingOpenData, setIsSyncingOpenData] = useState<boolean>(false);
  const [lastOpenDataSync, setLastOpenDataSync] = useState<string>('');

  // Initial and on-demand Live Government Open Data Sync
  const refreshGovOpenData = useCallback(async () => {
    setIsSyncingOpenData(true);
    try {
      const [budgetRes, goRes] = await Promise.all([
        GovOpenDataService.fetchLiveBudgetTransparency(),
        GovOpenDataService.fetchLiveGovernmentOrders()
      ]);

      setLiveBudget(budgetRes);

      // Merge newly fetched live government orders without discarding user-issued orders
      if (goRes && goRes.orders.length > 0) {
        setGos(prev => {
          const existingIds = new Set(prev.map(g => g.id));
          const newOrders = goRes.orders.filter(g => !existingIds.has(g.id));
          return [...newOrders, ...prev];
        });
      }

      setLastOpenDataSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Failed to sync live government open data', err);
    } finally {
      setIsSyncingOpenData(false);
    }
  }, []);

  // Auto-sync on initial mount
  useEffect(() => {
    refreshGovOpenData();
  }, [refreshGovOpenData]);

  // Sync data updates to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOS, JSON.stringify(gos));
  }, [gos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Auth Operations
  const loginUser = (user: UserProfile, explicitCategory?: UserCategory) => {
    const newSession = MockAuthService.createSession(user, explicitCategory);
    setSession(newSession);
  };

  const loginWithCredentials = async (identifier: string, pass: string, category: UserCategory) => {
    const newSession = await MockAuthService.loginWithCredentials(identifier, pass, category);
    setSession(newSession);
    return newSession;
  };

  const logoutUser = () => {
    // Drop back to Citizen mode
    const citizenUser = DEMO_USERS.find(u => u.role === 'citizen') || DEMO_USERS[DEMO_USERS.length - 1];
    const newSession = MockAuthService.createSession(citizenUser, 'Citizen');
    setSession(newSession);
  };

  // Operations
  const addProject = (project: Omit<DevelopmentProject, 'id' | 'lastUpdated'>) => {
    if (!permissions.canPublishProjects) {
      throw new Error('Access Denied: Citizens cannot publish development projects. Requires Official or Administrator privilege.');
    }
    const newProject: DevelopmentProject = {
      ...project,
      id: `PRJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<DevelopmentProject>) => {
    if (!permissions.canPublishProjects) {
      throw new Error('Access Denied: Only authorized Officials or Administrators can update development projects.');
    }
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p));
  };

  const addGovernmentOrder = (go: Omit<GovernmentOrder, 'id'>) => {
    if (!permissions.canIssueGOs) {
      throw new Error('Access Denied: Requires Official or Administrator privilege to issue Government Orders.');
    }
    const newGO: GovernmentOrder = {
      ...go,
      id: `GO-${new Date().getFullYear()}-${String(gos.length + 1).padStart(3, '0')}`
    };
    setGos(prev => [newGO, ...prev]);
    return newGO;
  };

  const addMeeting = (mtg: Omit<OfficialMeeting, 'id'>) => {
    if (!permissions.canManageMeetings) {
      throw new Error('Access Denied: Requires Official or Administrator privilege to record official proceedings.');
    }
    const newMeeting: OfficialMeeting = {
      ...mtg,
      id: `MTG-${new Date().getFullYear()}-${String(meetings.length + 1).padStart(2, '0')}`
    };
    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  };

  const submitGrievance = (grievanceData: Omit<Grievance, 'id' | 'trackingId' | 'status' | 'submittedAt' | 'timeline'>) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `AP-G-${new Date().getFullYear()}-${randomSuffix}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

    const newGrievance: Grievance = {
      ...grievanceData,
      id: `GRV-${new Date().getFullYear()}-${grievances.length + 1001}`,
      trackingId,
      status: 'Submitted',
      submittedAt: nowStr,
      timeline: [
        {
          status: 'Submitted',
          timestamp: nowStr,
          remarks: 'Grievance submitted by citizen through online transparency portal',
          actor: `${grievanceData.citizenName} (Citizen)`
        },
        {
          status: 'Assigned',
          timestamp: nowStr,
          remarks: `Auto-assigned to District Nodal Officer (${grievanceData.district}) - ${grievanceData.departmentName}`,
          actor: 'AP Spandana Grievance Engine'
        }
      ]
    };

    setGrievances(prev => [newGrievance, ...prev]);
    return newGrievance;
  };

  const updateGrievanceStatus = (id: string, status: Grievance['status'], remarks: string, officerName: string) => {
    if (!permissions.canResolveGrievances) {
      throw new Error('Access Denied: Citizens can view grievances, but only verified Officials or Administrators can update redressal status.');
    }
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    setGrievances(prev => prev.map(g => {
      if (g.id !== id && g.trackingId !== id) return g;
      return {
        ...g,
        status,
        assignedOfficer: officerName || g.assignedOfficer,
        resolutionRemarks: status === 'Resolved' || status === 'Closed' ? remarks : g.resolutionRemarks,
        resolvedAt: status === 'Resolved' || status === 'Closed' ? nowStr : g.resolvedAt,
        timeline: [
          ...g.timeline,
          {
            status,
            timestamp: nowStr,
            remarks,
            actor: officerName || 'Authorized Officer'
          }
        ]
      };
    }));
  };

  return {
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
  };
}
