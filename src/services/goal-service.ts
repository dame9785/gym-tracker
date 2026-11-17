import { GoalRepository } from '@/repositories/goal-repository';
import { UserRepository } from '@/repositories/user-repository';
import { NutritionCalculator } from '@/utils/nutrition-calculator';

// --------------------------------------------------
// DTOs
// --------------------------------------------------

type UpdateGoalDto = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// --------------------------------------------------
// Service
// --------------------------------------------------

export class GoalService {
  constructor(
    private readonly goalRepository = new GoalRepository(),
    private readonly userRepository = new UserRepository(),
    private readonly nutritionCalculator = new NutritionCalculator(),
  ) {}

  // --------------------------------------------------
  // Get goal by user ID
  // --------------------------------------------------

  async getByUserId(userId: number) {
    return this.goalRepository.getByUserId(userId);
  }

  // --------------------------------------------------
  // Create or update goal
  // --------------------------------------------------

  async updateGoal(userId: number, dto: UpdateGoalDto) {
    return this.goalRepository.upsert(userId, dto);
  }

  // --------------------------------------------------
  // Calculate and save nutrition goals
  // --------------------------------------------------

  async calculateAndSave(userId: number) {
    const user = await this.userRepository.findNutritionProfileById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.activityLevel) {
      throw new Error('Activity level must be selected.');
    }

    const targets = this.nutritionCalculator.calculate({
      gender: user.gender,
      metabolicSex: user.metabolicSex,
      birthDate: user.birthDate,
      height: Number(user.height),
      bodyWeight: Number(user.bodyWeight),
      activityLevel: user.activityLevel,
      goalType: user.goalType,
    });

    const goal = await this.goalRepository.upsert(userId, {
      calories: targets.calories,
      protein: targets.protein,
      carbs: targets.carbs,
      fat: targets.fat,
    });

    return {
      ...targets,
      goal,
    };
  }
}
