import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

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
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('admin_token_expiry');
    
    if (token && expiry) {
      const now = new Date().getTime();
      if (now < parseInt(expiry)) {
        setIsAuthenticated(true);
      } else {
        // Token expired
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (password) => {
    // Get password from environment variable
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // Debug log (remove after testing)
    console.log('Checking password...');
    console.log('Env var exists:', !!correctPassword);
    console.log('Password length:', password?.length, 'Expected length:', correctPassword?.length);
    
    // Trim both passwords to avoid whitespace issues
    const trimmedInput = password?.trim();
    const trimmedCorrect = correctPassword?.trim();
    
    if (trimmedInput && trimmedCorrect && trimmedInput === trimmedCorrect) {
      const token = btoa(`admin:${Date.now()}`); // Simple token
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_token_expiry', expiry.toString());
      setIsAuthenticated(true);
      return true;
    }
    
    console.log('Password mismatch');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
