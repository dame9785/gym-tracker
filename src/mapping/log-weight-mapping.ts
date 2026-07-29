import { LogViewModel } from '@/view-models/log-weight-view-moodel';
import { WeightLog } from '@prisma/client';

export class LogWeightMapper {
  static mapLogViewModel(
    logs: WeightLog[],
    firstLog: WeightLog | null,
    lastLog: WeightLog | null,
  ): LogViewModel {
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
}
