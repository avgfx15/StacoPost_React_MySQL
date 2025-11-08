import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get(`${baseUrl}/auth/profile`);
        setUser(response.data.user);
      } catch (error) {
        console.log(error.message);
        logout();
      }
    }
  }, [token, baseUrl, logout]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${baseUrl}/auth/profile`);

          setUser(response.data.user);
        } catch (error) {
          console.log(error.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, baseUrl, logout]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, {
        username,
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const getToken = () => token;

  // Social login handler
  const socialLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    // Refresh user data after social login
    refreshUser();
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    setUser,
    getToken,
    socialLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
