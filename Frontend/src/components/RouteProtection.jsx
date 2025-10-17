import { Navigate } from 'react-router-dom';

const getUserData = () => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token) {
    return { token: null, user: null };
  }

  try {
    const user = userString ? JSON.parse(userString) : null;
    return { token, user };
  } catch (error) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { token: null, user: null };
  }
};

// Role-based access control for routes
export const ProtectedRoute = ({ children, allowedRole, allowPublic = false }) => {
  const { token, user } = getUserData();

  if (!token) {
    return allowPublic ? children : <Navigate to="/login" replace />;
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role;

  if (allowedRole === 'user') {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === 'user') {
      return children;
    }
  }

  if (allowedRole === 'admin') {
    if (userRole === 'admin') {
      return children;
    }
    if (userRole === 'user') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

// Redirects /admin to appropriate dashboard
export const AdminRedirect = () => {
  const { token, user } = getUserData();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

// Prevents authenticated users from accessing login/signup
export const AuthRoute = ({ children }) => {
  const { token, user } = getUserData();

  if (!token) {
    return children;
  }

  if (user && user.role) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};