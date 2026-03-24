import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    if (!currentUser) return;
    try {
      // We need an endpoint to get user balance. 
      // I'll assume GET /api/users/profile or similar exists or I need to create it.
      // For now, let's calculate it from expenses if necessary, but backend has it stored.
      // Wait, I haven't implemented GET /api/users/profile in backend yet.
      // So I will implement that endpoint first.
      const res = await api.get('/users/profile');
      setBalance(res.data.currentBalance);
    } catch (error) {
      console.error("Error fetching balance", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBalance();
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ balance, fetchBalance, setBalance }}>
      {children}
    </UserContext.Provider>
  );
}
