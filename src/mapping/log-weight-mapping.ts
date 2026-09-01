import type { LogViewModel, LogItemViewModel } from '@/types/log-weight-types';
import type { WeightLog } from '@prisma/client';

export class LogWeightMapper {
  static mapLogViewModel(logs: WeightLog[], firstLog: WeightLog | null, lastLog: WeightLog | null): LogViewModel {
    return {
      currentWeight: lastLog ? Number(lastLog.weight) : null,
      startWeight: firstLog ? Number(firstLog.weight) : null,
      userId: firstLog?.userId ?? 0,

      logList: logs.map((log) => ({
        id: log.id,
        logDate: log.loggedAt.toISOString(),
        note: log.note ?? '',
        weight: Number(log.weight),
        userId: log.userId,
      })),
    };
  }

  static mapLogItemToViewModel(item: WeightLog): LogItemViewModel {
    return {
      id: item.id,
      logDate: item.loggedAt.toISOString(),
      note: item.note ?? '',
      weight: Number(item.weight),
      userId: item.userId,
    };
  }
}
