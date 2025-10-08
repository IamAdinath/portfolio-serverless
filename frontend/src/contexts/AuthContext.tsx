// AuthContext.tsx - Streamlined Authentication System
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signUp, signOut, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { requestUserConfirmation } from '../components/common/userAPI';

// Types
interface User {
  username: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (currentUser && session.tokens?.idToken) {
        setUser({
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
        });
        
        // Store token in localStorage for API calls
        localStorage.setItem('authToken', session.tokens.idToken.toString());
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await signIn({ username, password });
      
      // Get user info and session
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (session.tokens?.idToken) {
        setUser({
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
        });
        
        localStorage.setItem('authToken', session.tokens.idToken.toString());
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, name: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Sign up user
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
            preferred_username: username,
          },
        },
      });

      // Auto-confirm user (for development)
      await requestUserConfirmation({ username });
      
      // Auto-login after registration
      await login(username, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      if (token) {
        localStorage.setItem('authToken', token);
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};