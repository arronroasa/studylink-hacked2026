import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext({ userId: 5 });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state directly from localStorage so it survives refreshes
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('user_id');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Optional: Listen for storage changes in case you change it in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('user_id');
      if (saved) setUserId(parseInt(saved, 10));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};