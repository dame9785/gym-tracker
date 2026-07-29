import { LogViewModel } from '@/view-models/log-weight-view-moodel';
export interface LogWeightResponse {
  message: string;
  success: boolean;
  statusCode?: number;
  log: LogViewModel | null;
}
