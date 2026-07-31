import React, { createContext, useState } from 'react';

// We create a global 'Context' to hold our active User state.
// This allows ANY component in our app to know if Antoine or Léa is currently using it, 
// without having to pass data down manually through every component.
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(() => {
    // Read from localStorage to remember who was logged in even after browser refreshes!
    return localStorage.getItem('cineclubUser') || 'Antoine';
  });

  const toggleUser = () => {
    const newUser = activeUser === 'Antoine' ? 'Léa' : 'Antoine';
    setActiveUser(newUser);
    localStorage.setItem('cineclubUser', newUser);
  };

  return (
    <UserContext.Provider value={{ activeUser, toggleUser }}>
      {children}
    </UserContext.Provider>
  );
};
