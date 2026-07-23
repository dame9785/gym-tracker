import { DashboardViewModel } from '@/view-models/dashboard-view-model';

export type DashboardResponse =
  | {
      success: true;
      dashboard: DashboardViewModel;
    }
  | {
      success: false;
      message: string;
    };
