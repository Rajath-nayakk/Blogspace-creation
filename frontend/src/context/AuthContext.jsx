import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('blogspace_token'));
  const [loading, setLoading] = useState(true);

  // Check user on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('blogspace_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('blogspace_token');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to authenticate token:', error);
          localStorage.removeItem('blogspace_token');
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      if (res.success && res.token) {
        localStorage.setItem('blogspace_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('blogspace_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome to BLOGSPACE, ${res.user.name}!`);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('blogspace_token');
    setToken(null);
    setUser(null);
    authService.logout();
    toast.success('Signed out successfully');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

