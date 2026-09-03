import FoodMapper from '@/mapping/food-mapping';
import { FoodRepository } from '@/repositories/food-repository';
import { AddFoodDto, addFoodSchema, UpdateFoodDto, updateFoodSchema } from '@/schemas/food-schemas';
import { ErrorResponse, ApiResponse, SuccessResponse, FoodDeleteResponse } from '@/types/api-types';
import { CreateFoodResponse, FoodResponse, FoodViewModel, UpdateFoodResponse } from '@/types/food-type';
import { errorResponse } from '@/utils/api-error';

const foodRepository = new FoodRepository();

export class FoodService {
  async getAll(userId: number): Promise<ApiResponse<FoodResponse>> {
    try {
      const foods = await foodRepository.getAll(userId);

      if (!foods) {
        return {
          success: false,
          message: 'Failed to fetch foods',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        data: foods.map((item) => FoodMapper.foodModelToViewModel(item)),
      } satisfies SuccessResponse<FoodResponse>;
    } catch (error) {
      console.error('Foods failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async search(searchTerm: string) {
    if (!searchTerm.trim()) {
      return [];
    }

    return foodRepository.search(searchTerm);
  }

  async getById(id: number, userId: number): Promise<ApiResponse<FoodViewModel>> {
    try {
      const foodItem = await foodRepository.getById(id, userId);

      if (!foodItem) {
        return errorResponse('Could not find food.');
      }

      return {
        success: true,
        message: 'Food fetched successfully.',
        data: FoodMapper.foodModelToViewModel(foodItem),
      } satisfies SuccessResponse<FoodViewModel>;
    } catch (error) {
      console.error('Fetch food by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async create(dto: AddFoodDto, userId: number) {
    const validation = addFoodSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const food = await foodRepository.create(validation.data, userId);

      return {
        success: true,
        message: 'Exercise created successfully.',
        data: FoodMapper.foodModelToViewModel(food),
      } satisfies SuccessResponse<CreateFoodResponse>;
    } catch (error) {
      console.error('Create exercise failed, server error:', error);

      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ApiResponse<FoodDeleteResponse>> {
    try {
      await foodRepository.remove(id, userId);
      return {
        success: true,
        message: 'Exericse deleted successfully',
      } satisfies SuccessResponse<FoodResponse>;
    } catch (error) {
      console.error('Delete exericse failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(dto: UpdateFoodDto, foodId: number, userId: number): Promise<ApiResponse<UpdateFoodResponse>> {
    const validation = updateFoodSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      return errorResponse('Validation failed', errors);
    }

    try {
      const updateFood = await foodRepository.update(validation.data, foodId, userId);
      if (!updateFood) {
        return errorResponse('Could not find weight log');
      }

      const viewModel = FoodMapper.foodModelToViewModel(updateFood);

      return {
        success: true,
        message: 'Exercise updated successfully.',
        data: viewModel,
      } satisfies SuccessResponse<UpdateFoodResponse>;
    } catch (error) {
      console.error('Update exercise failed, server error:', error);

      return errorResponse('An error occurred on the server.');
    }
  }
}
