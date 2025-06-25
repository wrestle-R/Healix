import React, { createContext, useContext, useState, useEffect } from 'react';

// Create UserContext
const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      firebaseId: userData.firebaseId,
      profilePicture: userData.profilePicture
    });
    setToken(authToken);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      firebaseId: userData.firebaseId,
      profilePicture: userData.profilePicture
    }));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
