interface AppActionError {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

type AppActionSuccess<T = undefined> = [T] extends [undefined]
  ? {
      success: true;
      message?: string;
      data?: undefined;
    }
  : {
      success: true;
      message?: string;
      data: T;
    };

export type AppActionResult<T = undefined> = AppActionSuccess<T> | AppActionError;
