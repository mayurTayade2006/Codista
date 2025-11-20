import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, AuthState } from '../types';
import { getStoredAuth, logoutUser as serviceLogout } from '../services/storageService';

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setAuth({
        user: stored.user,
        isAuthenticated: true,
        token: stored.token
      });
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    setAuth({ user, isAuthenticated: true, token });
  };

  const logout = () => {
    serviceLogout();
    setAuth({ user: null, isAuthenticated: false, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};