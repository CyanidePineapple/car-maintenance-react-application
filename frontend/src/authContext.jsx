import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (email, password) => {
    const response = await axios.post('/api/login', { email, password });
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  };

  const register = async (email, password) => {
    await axios.post('/api/register', { email, password });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);