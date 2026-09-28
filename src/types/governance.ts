export interface District {
  id: string;
  name: string;
  headquarters: string;
  mandalsCount: number;
  panchayatsCount: number;
  population: string;
  revenueDivisions: number;
  totalFundsAllocatedCr: number;
  totalFundsSpentCr: number;
  activeProjects: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  ministerName: string;
  ministerDesignation: string;
  ministerPhoto: string;
  secretaryName: string;
  budgetAllocatedCr: number;
  budgetSpentCr: number;
  schemesCount: number;
  activeProjectsCount: number;
  totalGrievances: number;
  resolvedGrievances: number;
  description: string;
  iconName: string;
}

export type AdministrativeLevel = 
  | 'state'
  | 'district'
  | 'constituency'
  | 'mandal'
  | 'panchayat'
  | 'municipality';

export type UserRole = 
  | 'chief_minister'
  | 'deputy_cm'
  | 'minister'
  | 'mp'
  | 'mla'
  | 'district_collector'
  | 'zp_chairperson'
  | 'mpp'
  | 'mayor_municipal_chair'
  | 'sarpanch'
  | 'department_officer'
  | 'citizen';

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department?: string;
  jurisdiction: string;
  level: AdministrativeLevel;
  role: UserRole;
  email: string;
  phone?: string;
  photo?: string;
  termPeriod?: string;
}

export type ProjectStatus = 'Planned' | 'Sanctioned' | 'In Progress' | 'Under Review' | 'Completed' | 'Delayed';

export interface DevelopmentProject {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  district: string;
  constituency: string;
  mandalOrMunicipality: string;
  villageOrWard: string;
  level: AdministrativeLevel;
  sanctionedAmountLakhs: number;
  releasedAmountLakhs: number;
  utilizedAmountLakhs: number;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: ProjectStatus;
  progressPercent: number;
  contractorAgency: string;
  officerInCharge: string;
  description: string;
  beforePhoto?: string;
  afterPhoto?: string;
  beneficiariesCount: number;
  lastUpdated: string;
}

export interface GovernmentOrder {
  id: string;
  goNumber: string;
  departmentId: string;
  departmentName: string;
  date: string;
  subject: string;
  financialYear: string;
  documentType: 'GO Ms' | 'GO Rt' | 'Circular' | 'Gazette' | 'Policy' | 'Memo';
  sanctionAmountCr?: number;
  fileSize: string;
  summary: string;
  signatory: string;
  downloadUrl?: string;
}

export interface OfficialMeeting {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  chairperson: string;
  date: string;
  time: string;
  location: string;
  level: AdministrativeLevel;
  attendeesCount: number;
  agenda: string[];
  keyDecisions: string[];
  actionItems: {
    task: string;
    assignee: string;
    department: string;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
  momSummary: string;
}

export type GrievanceStatus = 'Submitted' | 'Assigned' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';

export interface Grievance {
  id: string;
  trackingId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  departmentId: string;
  departmentName: string;
  district: string;
  mandal: string;
  panchayatOrWard: string;
  category: string;
  subject: string;
  description: string;
  status: GrievanceStatus;
  priority: 'Normal' | 'Medium' | 'High' | 'Urgent';
  submittedAt: string;
  assignedOfficer?: string;
  resolutionRemarks?: string;
  resolvedAt?: string;
  timeline: {
    status: GrievanceStatus;
    timestamp: string;
    remarks: string;
    actor: string;
  }[];
}

export interface SchemeSubsidy {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  targetBeneficiaries: string;
  financialAssistance: string;
  eligibilityCriteria: string[];
  status: 'Active' | 'Upcoming' | 'Closed';
  annualOutlayCr: number;
  beneficiariesEnrolled: number;
}
