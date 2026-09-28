import { UserProfile, UserRole, AdministrativeLevel } from '../types/governance';

export type UserCategory = 'Citizen' | 'Official' | 'Administrator';

export interface AuthSession {
  user: UserProfile;
  category: UserCategory;
  token: string;
  loginTime: string;
  expiresAt: string;
  permissions: {
    canPublishProjects: boolean;
    canIssueGOs: boolean;
    canManageMeetings: boolean;
    canResolveGrievances: boolean;
    canViewFinancialLedgers: boolean;
    canAccessAdminSettings: boolean;
    canExportAuditLogs: boolean;
  };
}

export function getUserCategoryFromRole(role: UserRole): UserCategory {
  if (role === 'chief_minister' || role === 'deputy_cm') {
    return 'Administrator';
  }
  if (role === 'citizen') {
    return 'Citizen';
  }
  // Minister, MP, MLA, District Collector, Department Officer, Sarpanch, Mayor, etc.
  return 'Official';
}

export function getPermissionsForCategory(category: UserCategory) {
  switch (category) {
    case 'Administrator':
      return {
        canPublishProjects: true,
        canIssueGOs: true,
        canManageMeetings: true,
        canResolveGrievances: true,
        canViewFinancialLedgers: true,
        canAccessAdminSettings: true,
        canExportAuditLogs: true,
      };
    case 'Official':
      return {
        canPublishProjects: true,
        canIssueGOs: true,
        canManageMeetings: true,
        canResolveGrievances: true,
        canViewFinancialLedgers: true,
        canAccessAdminSettings: false,
        canExportAuditLogs: false,
      };
    case 'Citizen':
    default:
      return {
        canPublishProjects: false,
        canIssueGOs: false,
        canManageMeetings: false,
        canResolveGrievances: false, // Citizens submit & track, only Officials resolve
        canViewFinancialLedgers: true, // Transparent open data for citizens
        canAccessAdminSettings: false,
        canExportAuditLogs: false,
      };
  }
}
