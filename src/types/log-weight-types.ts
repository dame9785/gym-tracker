import type { PaginationViewModel } from '@/types/pagination-types';

export interface UserLogWeightResponse {
  logList: LogItemViewModel[];
  currentWeight: number | null;
  startWeight: number | null;
  pagination: PaginationViewModel;
}

export interface LogItemViewModel {
  id: number;
  logDate: string;
  note: string;
  weight: number;
  userId: number;
}

export interface LogViewModel {
  currentWeight: number | null;
  startWeight: number | null;
  userId: number;
  logList: LogItemViewModel[];
}
