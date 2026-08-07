export interface LogItemViewModel {
  id: number;
  logDate?: string;
  note: string;
  weight: string;
}

export interface LogViewModel {
  logList: LogItemViewModel[];
  currentWeight: string | undefined;
  startWeight: string | undefined;
}

export interface LogWeightDto {
  weight: number;
  note?: string;
}

export interface LogWeightResponse {
  message: string;
  success: boolean;
  statusCode?: number;
  log: LogViewModel | null;
}
