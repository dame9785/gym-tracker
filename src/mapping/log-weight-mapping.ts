//Types
import type { LogViewModel } from '@/types/log-weight-types';

//Prisma
import { WeightLog } from '@prisma/client';

export class LogWeightMapper {
  static mapLogViewModel(logs: WeightLog[], firstLog: WeightLog | null, lastLog: WeightLog | null): LogViewModel {
    return {
      currentWeight: lastLog?.weight.toString() ?? '',
      startWeight: firstLog?.weight.toString() ?? '',
      logList: logs.map((log) => ({
        id: log.id,
        logDate: log.loggedAt.toString(),
        note: log.note ?? '',
        weight: log.weight?.toString() ?? '',
      })),
    };
  }

  static mapLogItemToViewModel(item: WeightLog) {
    return {
      id: item.id,
      logDate: item.loggedAt.toString(),
      note: item.note ?? '',
      weight: item.weight,
    };
  }
}
