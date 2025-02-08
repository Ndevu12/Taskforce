import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '../interfaces/User';
import { DecodedUser } from '../interfaces/DecodedUser';
import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
} from '../actions/authActions';
import {
  getToken,
  setToken,
  clearToken,
  isTokenExpired,
} from '../utils/tokenUtils';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    navigate: ReturnType<typeof useNavigate>,
  ) => void;
  logout: (navigate: ReturnType<typeof useNavigate>) => void;
  register: (
    userData: {
      name: string;
      email: string;
      password: string;
    },
    navigate: ReturnType<typeof useNavigate>,
  ) => void;
  getCurrentUser: () => User | null;
  isAuthorized: (role: UserRole) => boolean;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Only check JWT expiration
      if (!isTokenExpired(token)) {
        const user = decodeToken(token);
        setUser(user);
        setIsAuthenticated(true);
      } else {
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const decodeToken = (token: string): User => {
    const decoded: DecodedUser = jwtDecode(token);
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  };

  const login = async (
    email: string,
    password: string,
    navigate: ReturnType<typeof useNavigate>,
  ) => {
    const data = await loginUser(email, password);
    if (data && data.token) {
      const user = decodeToken(data.token);
      setUser(user);
      setToken(data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      throw new Error('Authentication failed');
    }
  };

  const logout = async (navigate: ReturnType<typeof useNavigate>) => {
    try {
      const token = getToken();
      if (token) {
        await logoutUser(token);
        navigate('/');
      }
      setUser(null);
      clearToken();
      setIsAuthenticated(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const register = async (
    userData: {
      name: string;
      email: string;
      password: string;
    },
    navigate: ReturnType<typeof useNavigate>,
  ) => {
    const response = await registerUser(
      userData.name,
      userData.email,
      userData.password,
    );
    if (response && response.message) {
      alert(response.message);
      navigate('/login');
    } else {
      throw new Error('Registration failed');
    }
  };

  const getCurrentUser = () => {
    return user;
  };

  const isAuthorized = (role: UserRole) => {
    return user?.role === role;
  };

  const contextValue: AuthContextProps = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    getCurrentUser,
    isAuthorized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
