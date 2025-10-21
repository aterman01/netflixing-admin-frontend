import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple hash function for basic security
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

// Store the hashed password - replace this hash with your password's hash
// To get your password hash, temporarily add: console.log(simpleHash("YourPassword"))
const STORED_PASSWORD_HASH = "-1428485891"; // Hash of "At100100!?"

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = sessionStorage.getItem('admin_token');
    const expiry = sessionStorage.getItem('admin_token_expiry');
    
    if (token && expiry) {
      const now = new Date().getTime();
      if (now < parseInt(expiry)) {
        setIsAuthenticated(true);
      } else {
        // Token expired
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    // Hash the input password and compare
    const inputHash = simpleHash(password.trim());
    
    console.log('Login attempt');
    console.log('Input hash:', inputHash);
    console.log('Stored hash:', STORED_PASSWORD_HASH);
    console.log('Match:', inputHash === STORED_PASSWORD_HASH);
    
    if (inputHash === STORED_PASSWORD_HASH) {
      const token = btoa(`admin:${Date.now()}`);
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      sessionStorage.setItem('admin_token', token);
      sessionStorage.setItem('admin_token_expiry', expiry.toString());
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_token_expiry');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
