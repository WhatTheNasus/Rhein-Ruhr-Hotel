import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from './firebase';
import firebase from 'firebase/compat/app';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPrivilege, setUserPrivilege] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      const fetchUserData = async () => {
        if (user) {
          console.log(user.uid);
          const userDocRef = doc(db, 'users', user.uid);
          const unsubscribeUserData = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setUserPrivilege(userData.privilege);
            } else {
              console.error('User data not found in Firestore.');
            }
          });
          
          return () => unsubscribeUserData();
        } else {
          // Clear user privilege if user is not logged in
          setUserPrivilege(null);
        }
      };
      
      fetchUserData();
    });
  
    return unsubscribe;
  }, []);  
  
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, userPrivilege, setUserPrivilege }}>
      {children}
    </AuthContext.Provider>
  );
};