import React, { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken as setAPIToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from sessionStorage on mount (for page refresh)
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setAuthTokenState(token);
        setAPIToken(token); // Sync with api.js
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (token, userData) => {
    setAuthTokenState(token);
    setAPIToken(token); // Sync with api.js
    setUser(userData);
    setIsAuthenticated(true);
    // Store in sessionStorage for page refresh persistence
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend to blacklist token
      const { authAPI } = await import('../utils/api');
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear frontend state regardless of API call result
      setAuthTokenState(null);
      setAPIToken(null); // Clear from api.js
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
    }
  };

  const getUserId = () => {
    return user?.id || null;
  };

  const getUserEmail = () => {
    return user?.email || null;
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  return (
    <AuthContext.Provider value={{
      authToken,
      user,
      isAuthenticated,
      login,
      logout,
      getUserId,
      getUserEmail,
      getUserRole
    }}>
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

