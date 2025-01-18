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
    const token = localStorage.getItem('token');
    if (token) {
      const user = decodeToken(token);
      setUser(user);
      setIsAuthenticated(true);
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
    try {
      const data = await loginUser(email, password);
      if (data && data.token) {
        const user = decodeToken(data.token);
        setUser(user);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = async (navigate: ReturnType<typeof useNavigate>) => {
    try {
      await logoutUser(localStorage.getItem('token') || '');
      setUser(null);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
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
    try {
      const data = await registerUser(
        userData.name,
        userData.email,
        userData.password,
      );
      if (data && data.token) {
        const user = decodeToken(data.token);
        setUser(user);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/login');
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getCurrentUser = () => {
    return user;
  };

  const isAuthorized = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        getCurrentUser,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
