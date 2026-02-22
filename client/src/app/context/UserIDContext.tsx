import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: number; // Changed from 5 to number
  setGlobalUser: (id: number) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number>(() => {
    const saved = localStorage.getItem('user_id');
    return saved ? parseInt(saved, 10) : 5;
  });

  const setGlobalUser = (id: number) => {
    localStorage.setItem('user_id', id.toString());
    setUserId(id);
  };

  // Attach to window for your console testing
  useEffect(() => {
    (window as any).changeUser = setGlobalUser;
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('user_id');
      if (saved) setUserId(parseInt(saved, 10));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    // Corrected the key name to match setGlobalUser
    <UserContext.Provider value={{ userId, setGlobalUser }}>
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