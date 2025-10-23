// Auth utility functions for cookie-based authentication
// Note: The actual auth token is stored in an HttpOnly cookie by the backend
// We only store non-sensitive user data in sessionStorage for UI purposes

export const setUserData = (userData) => {
  if (userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
  }
};

export const getUserData = () => {
  try {
    const userString = sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    sessionStorage.removeItem('user');
    return null;
  }
};

export const clearUserData = () => {
  sessionStorage.removeItem('user');
  localStorage.removeItem('user'); // Clear old localStorage data if any
  localStorage.removeItem('token'); // Clear old localStorage token if any
};

export const isAuthenticated = () => {
  // Check if user data exists in sessionStorage
  // The actual authentication is validated by the backend using the HttpOnly cookie
  return getUserData() !== null;
};
