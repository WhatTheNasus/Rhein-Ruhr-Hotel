import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase'; // Import your Firebase configuration

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
