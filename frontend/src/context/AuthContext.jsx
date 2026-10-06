import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jobconnect_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('jobconnect_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          const savedUser = JSON.parse(localStorage.getItem('jobconnect_user') || '{}');
          const merged = { ...savedUser, ...res.data };
          setUser(merged);
          localStorage.setItem('jobconnect_user', JSON.stringify(merged));
        } catch (err) {
          console.error('Session validation error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('jobconnect_token', jwtToken);
    localStorage.setItem('jobconnect_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const registerCandidate = async (formData) => {
    const res = await api.post('/auth/register/candidate', formData);
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('jobconnect_token', jwtToken);
    localStorage.setItem('jobconnect_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const registerEmployer = async (formData) => {
    const res = await api.post('/auth/register/employer', formData);
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('jobconnect_token', jwtToken);
    localStorage.setItem('jobconnect_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('jobconnect_token');
    localStorage.removeItem('jobconnect_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const getPrimaryRole = () => {
    if (!user || !user.roles || user.roles.length === 0) return null;
    return user.roles[0];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        registerCandidate,
        registerEmployer,
        logout,
        hasRole,
        primaryRole: getPrimaryRole()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
