import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';

export const getCurrentUser = async (): Promise<{ userId: number } | null> => {
  const token = await getTokenFromCookieStore();

  if (!token) {
    return null;
  }

  const payLoad = await getUserFromToken(token);
  if (!payLoad) {
    return null;
  }

  const userId = payLoad.userId;
  return {
    userId,
  };
};
