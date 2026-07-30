import { WeightLogRepository } from '@/repositories/weight-log-repository';
import type { LogWeightDto } from '@/dto/log-weight-dto';
import type { LogWeightResponse } from '@/responses/weight-log-response';
import { LogWeightMapper } from '@/mapping/log-weight-mapping';

export class WeightLogService {
  private weightLogRepository = new WeightLogRepository();

  async getAll(): Promise<LogWeightResponse> {
    try {
      // const [lastLog, firstLog, allLogs] = await Promise.all([
      //   this.weightLogRepository.lastLog(1),
      //   this.weightLogRepository.firstLog(1),
      //   this.weightLogRepository.getAll(1),
      // ]);

      const lastLog = await this.weightLogRepository.lastLog(1);
      const firstLog = await this.weightLogRepository.firstLog(1);
      const allLogs = await this.weightLogRepository.getAll(1);

      const viewModel = LogWeightMapper.mapLogViewModel(allLogs, firstLog, lastLog);
      return {
        message: 'Hämtning lyckades',
        log: viewModel,
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      console.log('Log-Weight Error', error);
      return {
        message: 'Server error',
        success: false,
        statusCode: 500,
        log: null,
      };
    }
  }

  async delete(id: number): Promise<LogWeightResponse> {
    if (!id) {
      return {
        success: false,
        message: 'Request body saknas.',
        statusCode: 400,
        log: null,
      };
    }

    try {
      await this.weightLogRepository.delete(id);
      return {
        success: true,
        message: 'Vikt borttagen',
        statusCode: 200,
        log: null,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel',
        statusCode: 500,
        log: null,
      };
    }
  }

  async create(dto: LogWeightDto): Promise<LogWeightResponse> {
    if (dto === null || dto === undefined) {
      return {
        success: false,
        message: 'Request body saknas.',
        statusCode: 400,
        log: null,
      };
    }
    console.log(dto);
    try {
      await this.weightLogRepository.create(1, dto);
      return {
        success: true,
        message: 'Vikt loggad',
        statusCode: 202,
        log: null,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel',
        statusCode: 500,
        log: null,
      };
    }
  }
}
