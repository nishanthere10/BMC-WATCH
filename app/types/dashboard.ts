export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TrendDataPoint {
  date: string;
  complaints: number;
  resolved: number;
}

export interface WardRanking {
  ward: string;
  totalProjects: number;
  delayedProjects: number;
  totalReports: number;
  responseScore: number;
  status: 'Critical' | 'Improving' | 'Stable';
}

export interface DelayedProject {
  id: string;
  title: string;
  ward: string;
  delayDays: number;
  completionPercent: number;
}

export interface DashboardReport {
  id: string;
  issueType: string;
  projectName: string;
  ward: string;
  timestamp: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  comment: string;
}

export interface WardPerformance {
  ward: string;
  zone: string;
  total_projects: number;
  delayed_projects: number;
  avg_progress: number;
  total_budget: number;
  total_spent: number;
  citizen_reports: number;
}

export interface TypeDistribution {
  name: string;
  value: number;
}

export interface WardSummary {
  ward: string;
  total_projects: number;
  delayed_count: number;
  avg_progress: number;
  total_budget_cr: number;
}

export interface KPIStats {
  totalActiveProjects: number;
  totalDelayed: number;
  totalBudget: number;
}