import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../lib/base-url';
import { clearUserData, getUserData } from '../utils/auth';

const InactivityContext = createContext();

const INACTIVITY_TIMEOUT = 45 * 60 * 1000; // 45 minutes in milliseconds

export const InactivityProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(async () => {
    try {
      // Call backend logout to clear the HttpOnly cookie
      // withCredentials is now set globally, cookies sent automatically
      await axios.post(`${BASE_URL}/user/logout`, {});
      
      // Clear user data from sessionStorage
      clearUserData();
      
      toast.error('Session expired due to inactivity. Please login again.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend call fails, clear local data and redirect
      clearUserData();
      navigate('/login');
    }
  }, [navigate]);

  const resetTimer = useCallback(() => {
    // Only reset timer if user is authenticated
    const user = getUserData();
    if (!user) return;

    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  // Check authentication state on mount
  useEffect(() => {
    const user = getUserData();
    setIsAuthenticated(!!user);
  }, []);

  // Set up inactivity tracking when authenticated
  useEffect(() => {
    // Only set up inactivity tracking if user is authenticated
    if (!isAuthenticated) {
      // Clear any existing timer if user logs out
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    console.log('Setting up inactivity tracking...');

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up inactivity tracking...');
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, resetTimer]);

  return (
    <InactivityContext.Provider value={{ resetTimer }}>
      {children}
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error('useInactivity must be used within InactivityProvider');
  }
  return context;
};
