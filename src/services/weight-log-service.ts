import { WeightLogRepository } from '@/repositories/weight-log-repository';
import { LogWeightMapper } from '@/mapping/log-weight-mapping';

import { errorResponse } from '@/helpers/service-response-helper';

import { addWeightSchema, updateWeightSchema } from '@/schemas/weight-log.schemas';

import type { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';

import type { ServiceResponse, SuccessResponse } from '@/types/service-types';

import type { LogItemViewModel, UserLogWeightResponse } from '@/types/log-weight-types';

export class WeightLogService {
  private readonly weightLogRepository = new WeightLogRepository();

  private readonly pageSize = 7;

  async getAll(page: number, userId: number): Promise<ServiceResponse<UserLogWeightResponse>> {
    try {
      const [lastLog, firstLog, totalLogs, allLogs] = await Promise.all([this.weightLogRepository.lastLog(userId), this.weightLogRepository.firstLog(userId), this.weightLogRepository.getTotalNumberOfLogs(userId), this.weightLogRepository.getAll(userId, page, this.pageSize)]);

      const totalPages = Math.ceil(totalLogs / this.pageSize);

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
            pageSize: this.pageSize,
            totalItems: totalLogs,
          },
        },
      } satisfies SuccessResponse<UserLogWeightResponse>;
    } catch (error: unknown) {
      console.error('[WeightLogService.getAll]', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ServiceResponse<void>> {
    if (!Number.isInteger(id) || id <= 0) {
      return errorResponse('Invalid weight log ID');
    }

    try {
      const deletedLog = await this.weightLogRepository.delete(id, userId);

      if (!deletedLog) {
        return errorResponse('Could not find weight log.');
      }

      return {
        success: true,
        message: 'Weight log deleted successfully',
      } satisfies SuccessResponse<void>;
    } catch (error: unknown) {
      console.error('[WeightLogService.delete]', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async create(dto: AddWeightDto, userId: number): Promise<ServiceResponse<LogItemViewModel>> {
    const validation = addWeightSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const createdLog = await this.weightLogRepository.create(validation.data, userId);

      const viewModel = LogWeightMapper.mapLogItemToViewModel(createdLog);

      return {
        success: true,
        message: 'Weight log created successfully.',
        data: viewModel,
      } satisfies SuccessResponse<LogItemViewModel>;
    } catch (error: unknown) {
      console.error('[WeightLogService.create]', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(weightId: number, dto: UpdateWeightDto, userId: number): Promise<ServiceResponse<LogItemViewModel>> {
    const validation = updateWeightSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const updatedData = await this.weightLogRepository.update(weightId, userId, validation.data);

      if (!updatedData) {
        return errorResponse('Could not find weight log');
      }

      const viewModel = LogWeightMapper.mapLogItemToViewModel(updatedData);

      return {
        success: true,
        data: viewModel,
        message: 'Weight log updated successfully.',
      } satisfies SuccessResponse<LogItemViewModel>;
    } catch (error: unknown) {
      console.error('[WeightLogService.update]', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number, userId: number): Promise<ServiceResponse<LogItemViewModel>> {
    try {
      const data = await this.weightLogRepository.getById(id, userId);

      if (!data) {
        return errorResponse('Could not find weight log.');
      }

      return {
        success: true,
        data: LogWeightMapper.mapLogItemToViewModel(data),
      } satisfies SuccessResponse<LogItemViewModel>;
    } catch (error: unknown) {
      console.error('[WeightLogService.getById]', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
