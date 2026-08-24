//Types
import type { LogViewModel } from '@/types/log-weight-types';

//Prisma
import { WeightLog } from '@prisma/client';
import { useId } from 'react';

export class LogWeightMapper {
  static mapLogViewModel(logs: WeightLog[], firstLog: WeightLog | null, lastLog: WeightLog | null): LogViewModel {
    return {
      currentWeight: lastLog?.weight.toString() ?? '',
      startWeight: firstLog?.weight.toString() ?? '',
      userId: 1,
      logList: logs.map((log) => ({
        id: log.id,
        logDate: log.loggedAt.toString(),
        note: log.note ?? '',
        weight: log.weight,
      })),
    };
  }

  static mapLogItemToViewModel(item: WeightLog) {
    return {
      id: item.id,
      logDate: item.loggedAt.toString(),
      note: item.note ?? '',
      weight: item.weight,
      useId: item.userId,
    };
  }
}
