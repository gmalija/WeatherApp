import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SessionContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * SessionContext manages user authentication state
 * This is a placeholder for future authentication implementation
 */
export function SessionProvider({children}: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((newUser: User) => {
    setUser(newUser);
    // TODO: Persist session to AsyncStorage
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // TODO: Clear session from AsyncStorage
  }, []);

  const value: SessionContextValue = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
