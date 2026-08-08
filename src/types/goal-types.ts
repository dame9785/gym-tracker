export interface GoalTypeViewModel {
  id: number;
  title: string;
}

export interface GoalTypeApiResponse {
  goalTypes: GoalTypeViewModel[];
  message: string;
  success: boolean;
}
