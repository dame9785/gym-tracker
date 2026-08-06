'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '@/services/auth-service';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      router.push('account/login');
      return;
    }

    const response = await AuthService.me(token);
    if (response.ok) {
      const user = await response.json();
      setUser(user);
      return;
    } else {
      setUser(null);
      router.push('account/login');
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      await refreshUser();
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
