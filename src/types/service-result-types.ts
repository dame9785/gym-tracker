import type { UserSettingsViewModel } from '@/types/user-types';

export interface UpdateUserSuccess {
  success: true;
  data: UserSettingsViewModel;
}

export interface UpdateUserError {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<'email' | 'username', string>>;
}

export type UpdateUserResult = UpdateUserSuccess | UpdateUserError;
