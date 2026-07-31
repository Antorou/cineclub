/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(() => localStorage.getItem('cineclubUser') || null);
  // NEW: We now manage the JWT cryptographic token securely provided by our Node.js server!
  const [token, setToken] = useState(() => localStorage.getItem('cineclubToken') || null);

  const login = async (username, password) => {
    try {
      // Physically query our robust internal backend to verify!
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json(); // Safely unpack the resulting JSON
        
        setActiveUser(data.username);
        setToken(data.token);
        
        // Save the magical VIP wristband so we don't log out immediately on a page refresh!
        localStorage.setItem('cineclubUser', data.username); 
        localStorage.setItem('cineclubToken', data.token); 
        return true; 
      }
      return false; // Express specifically rejected our password!
    } catch (error) {
       console.error("Login Server Error: ", error);
       return false;
    }
  };

  const logout = () => {
    setActiveUser(null);
    setToken(null);
    localStorage.removeItem('cineclubUser'); 
    localStorage.removeItem('cineclubToken'); // Rip off the VIP wristband!
  };

  // We explicitly make the 'token' available globally so other pages can attach it to requests!
  return (
    <UserContext.Provider value={{ activeUser, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
