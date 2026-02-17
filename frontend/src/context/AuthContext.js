import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register User
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Login User
  const login = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(userData);
      setUser(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
      throw error;
    }
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const data = await authService.updateProfile(profileData);
      setUser(data);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  // Clear Error
  const clearError = () => setError(null);

  // Logout User
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
