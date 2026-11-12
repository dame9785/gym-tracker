export type SuccessResponse<T = undefined> = [T] extends [undefined]
  ? {
      success: true;
      message?: string;
      data?: undefined;
    }
  : [T] extends [void]
    ? {
        success: true;
        message?: string;
        data?: T;
      }
    : {
        success: true;
        message?: string;
        data: T;
      };

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;
