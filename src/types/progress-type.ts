export interface ProgressApiResponse {
  weightProgress: WeightProgress | null;
}

export interface WeightProgress {
  currentWeight: number;
  startWeight: number;
  goalWeight: number;
}
