import type { WeightLog } from '@prisma/client';

import type { LogViewModel, LogItemViewModel } from '@/types/log-weight-types';

export class LogWeightMapper {
  static mapLogViewModel(logs: WeightLog[], firstLog: WeightLog | null, lastLog: WeightLog | null): LogViewModel {
    return {
      currentWeight: lastLog ? Number(lastLog.weight) : null,
      startWeight: firstLog ? Number(firstLog.weight) : null,
      userId: firstLog?.userId ?? 0,
      logList: logs.map((log) => this.mapLogItemToViewModel(log)),
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
