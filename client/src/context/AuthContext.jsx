import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (savedToken && savedUser) {
    const userData = JSON.parse(savedUser);
    setToken(savedToken);
    setUser({
      ...userData,
      userType: userData.userType || 'both'
    });
  }
  setLoading(false);
}, []);
const login = (userData, userToken) => {
  const userWithType = {
    ...userData,
    userType: userData.userType || 'both'
  };
  setUser(userWithType);
  setToken(userToken);
  localStorage.setItem('token', userToken);
  localStorage.setItem('user', JSON.stringify(userWithType));
};
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};