export interface ProjectKPIs {
  projectId: string;
  completionPercentage: number;
  openTasksCount: number;
  completedTasksCount: number;
  burnDownVelocity: number;
  budgetUtilizationPercentage: number;
  healthStatus: 'on_track' | 'at_risk' | 'delayed';
}
