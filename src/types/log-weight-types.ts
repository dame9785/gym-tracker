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

  logList: {
    id: number;
    logDate: string;
    note: string;
    weight: number;
    userId: number;
  }[];
}
