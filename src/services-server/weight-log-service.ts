//Repository
import { WeightLogRepository } from '@/repositories/weight-log-repository';

//Mapping
import { LogWeightMapper } from '@/mapping/log-weight-mapping';
import { AddWeightDto, addWeightSchema } from '@/schemas/auth-schemas';
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  DeleteLogWeightResponse,
  LogWeightResponse,
  UserLogWeightResponse,
} from '@/types/api-types';

export class WeightLogService {
  private weightLogRepository = new WeightLogRepository();

  async getAll(userId: number): Promise<ApiResponse<UserLogWeightResponse>> {
    try {
      // const [lastLog, firstLog, allLogs] = await Promise.all([
      //   this.weightLogRepository.lastLog(1),
      //   this.weightLogRepository.firstLog(1),
      //   this.weightLogRepository.getAll(1),
      // ]);

      const lastLog = await this.weightLogRepository.lastLog(userId);
      const firstLog = await this.weightLogRepository.firstLog(userId);
      const allLogs = await this.weightLogRepository.getAll(userId);

      const viewModel = LogWeightMapper.mapLogViewModel(allLogs, firstLog, lastLog);

      return {
        success: true,
        message: 'Hätmning lyckades',
        data: {
          logList: viewModel.logList,
          currentWeight: viewModel.currentWeight,
          startWeight: viewModel.startWeight,
        },
      } satisfies ApiSuccessResponse<UserLogWeightResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Felaktig email eller lösenord.',
      } satisfies ApiErrorResponse;
    }
  }

  async delete(id: number): Promise<ApiResponse<DeleteLogWeightResponse>> {
    if (id === null) {
      return {
        success: false,
        message: 'Något gick fel, logg hittades inte',
      } satisfies ApiErrorResponse;
    }

    try {
      await this.weightLogRepository.delete(id);
      return {
        success: true,
        message: 'Något gick fel, kunde inte raderas',
        data: {
          data: [],
        },
      } satisfies ApiSuccessResponse<DeleteLogWeightResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Användaren kunde inte uppdateras.',
      } satisfies ApiErrorResponse;
    }
  }

  async create(dto: AddWeightDto, userId: number): Promise<ApiResponse<LogWeightResponse>> {
    const fieldErrors: Partial<Record<keyof AddWeightDto, string>> = {};
    const validation = addWeightSchema.safeParse(dto);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validerings fel',
        errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
      } satisfies ApiErrorResponse;
    }

    try {
      const createdLog = await this.weightLogRepository.create(userId, validation.data);
      const viewModel = LogWeightMapper.mapLogItemToViewModel(createdLog);
      return {
        success: true,
        message: 'Vikt lyckades loggas',
        data: {
          log: viewModel,
        },
      } satisfies ApiSuccessResponse<LogWeightResponse>;
    } catch (error) {
      console.error('AuthService.updateUser failed:', error);
      return {
        success: false,
        message: 'Användaren kunde inte uppdateras.',
      } satisfies ApiErrorResponse;
    }
  }
}
