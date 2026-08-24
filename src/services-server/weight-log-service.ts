//Repository
import { WeightLogRepository } from '@/repositories/weight-log-repository';

//Mapping
import { LogWeightMapper } from '@/mapping/log-weight-mapping';
import { AddWeightDto, addWeightSchema, UpdateWeightDto, updateWeightSchema } from '@/schemas/weight-log.schemas';
import { ApiResponse, ApiSuccessResponse, DeleteLogWeightResponse, EditLogWeightResponse, LogWeightResponse, UserLogWeightResponse } from '@/types/api-types';

import { errorResponse } from '@/utils/api-error';

export class WeightLogService {
  private weightLogRepository = new WeightLogRepository();

  async getAll(userId: number, page: number): Promise<ApiResponse<UserLogWeightResponse>> {
    try {
      const lastLog = await this.weightLogRepository.lastLog(userId);
      const firstLog = await this.weightLogRepository.firstLog(userId);

      const pageSize = 7;
      const totalLogs = await this.weightLogRepository.getTotalNumberOfLogs(userId);
      const totalPages = Math.ceil(totalLogs / pageSize);
      const allLogs = await this.weightLogRepository.getAll(userId, page, pageSize);

      const viewModel = LogWeightMapper.mapLogViewModel(allLogs, firstLog, lastLog);

      return {
        success: true,
        message: 'Weight logs fetched successfully.',
        data: {
          logList: viewModel.logList,
          currentWeight: viewModel.currentWeight,
          startWeight: viewModel.startWeight,
          pagination: {
            currentPage: page,
            totalPages,
            pageSize,
            totalItems: totalLogs,
          },
        },
      } satisfies ApiSuccessResponse<UserLogWeightResponse>;
    } catch (error) {
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ApiResponse<DeleteLogWeightResponse>> {
    if (!Number.isInteger(id) || id <= 0) {
      return errorResponse('Invalid weight log ID');
    }

    try {
      await this.weightLogRepository.delete(id, userId);
      return {
        success: true,
        message: 'Weight log deleted successfully',
        data: [],
      } satisfies ApiSuccessResponse<DeleteLogWeightResponse>;
    } catch (error) {
      return errorResponse('An error occurred on the server.');
    }
  }

  async create(dto: AddWeightDto, userId: number): Promise<ApiResponse<LogWeightResponse>> {
    const validation = addWeightSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const createdLog = await this.weightLogRepository.create(userId, validation.data);
      const viewModel = LogWeightMapper.mapLogItemToViewModel(createdLog);

      return {
        success: true,
        message: 'Weight log created successfully.',
        data: viewModel,
      } satisfies ApiSuccessResponse<LogWeightResponse>;
    } catch (error) {
      console.error('Weight-log created failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(weightId: string, dto: UpdateWeightDto, userId: number): Promise<ApiResponse<EditLogWeightResponse>> {
    const validation = updateWeightSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const updatedData = await this.weightLogRepository.update(Number(weightId), userId, validation.data);
      if (!updatedData) {
        return errorResponse('Could not find weight log');
      }

      const viewModel = LogWeightMapper.mapLogItemToViewModel(updatedData);

      return {
        success: true,
        data: viewModel,
        message: 'Weight log updated successfully.',
      } satisfies ApiSuccessResponse<EditLogWeightResponse>;
    } catch (error) {
      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const data = await this.weightLogRepository.getById(id);
      if (!data) {
        return errorResponse('Could not find weight log.');
      }

      return {
        success: true,
        data: LogWeightMapper.mapLogItemToViewModel(data),
      } satisfies ApiSuccessResponse<LogWeightResponse>;
    } catch (error) {
      console.error('getById error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
