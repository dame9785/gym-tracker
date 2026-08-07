'use client';

//React hooks & Context
import { createContext, useContext, useEffect, useState } from 'react';

//Services
import AuthService from '@/services/auth-service';

//Routing
import { useRouter } from 'next/navigation';

//
import { User } from '@/types/user-types';

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
      // router.push('account/login');
      return;
    }

    try {
      const response = await AuthService.me(token);
      if (response.ok) {
        const user = await response.json();
        setUser(user);
        return;
      } else {
        setUser(null);
        // router.push('account/login');
      }

      setLoading(false);
    } catch (error) {}
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
