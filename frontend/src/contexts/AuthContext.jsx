import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const saveUserToStorage = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearUserFromStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('savedProperties');
    setUser(null);
    setToken(null);
  };

  const verifyToken = async () => {
    try {
      const response = await authAPI.verifyToken();
      
      if (response.success) {
        saveUserToStorage(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        saveUserToStorage(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        saveUserToStorage(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    clearUserFromStorage();
  };

  const isAuthenticated = () => {
    const hasToken = !!token || !!localStorage.getItem('token');
    const hasUser = !!user || !!localStorage.getItem('user');
    return hasToken && hasUser;
  };

  const isAdmin = () => {
    if (user && user.role === 'admin') {
      return true;
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return userData.role === 'admin';
    }
    return false;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};