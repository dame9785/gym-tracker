import { Decimal } from '@prisma/client/runtime/library';

export interface LogItemViewModel {
  id: number;
  logDate: string;
  note: string;
  weight: Decimal;
}

export interface LogViewModel {
  logList: LogItemViewModel[];
  currentWeight: string | undefined;
  startWeight: string | undefined;
}
