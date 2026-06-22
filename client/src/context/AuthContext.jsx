import React, { createContext, useContext, useState } from 'react';

// Shared auth state across the whole app
// Usage anywhere: const { token, user, login, logout } = useAuth();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('cg_token') || null);
  const [user,  setUser]  = useState(null);

  const login = (newToken, userData) => {
    localStorage.setItem('cg_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cg_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
