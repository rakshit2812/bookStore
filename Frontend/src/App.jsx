import { useEffect, useState, lazy, Suspense } from 'react'
import {Routes , Route, Navigate} from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { ConfirmationProvider } from './contexts/ConfirmationContext'
import ConfirmationModal from './components/ConfirmationModal'
import { ProtectedRoute, AdminRedirect, AuthRoute } from './components/RouteProtection'
import { setUserData, getUserData } from './utils/auth'
import { BASE_URL } from './lib/base-url'
import axios from 'axios'
import LoadingFallback from './components/LoadingFallback'

// Lazy load all page components
const HomePage = lazy(() => import('./pages/HomePage'))
const BooksPage = lazy(() => import('./pages/BooksPage'))
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Signup = lazy(() => import('./components/Signup'))
const LoginPage = lazy(() => import('./components/LoginPage'))
const Contact = lazy(() => import('./components/Contact'))

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);

  // Verify authentication on app load (important for OAuth redirects)
  useEffect(() => {
    const verifyAuth = async () => {
      // Skip if user data already exists in sessionStorage
      if (getUserData()) {
        setAuthChecked(true);
        return;
      }

      try {
        // Try to get user data from backend using the auth cookie
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true
        });
        
        if (response.data) {
          // Store user data in sessionStorage
          setUserData(response.data);
        }
      } catch (error) {
        // No valid auth cookie or session expired - this is fine
        console.log('No active session');
      } finally {
        setAuthChecked(true);
      }
    };

    verifyAuth();
  }, []);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <CartProvider>
          <div className="dark:bg-slate-950 dark:text-white">
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
            {/* Auth Routes - Redirects authenticated users to their dashboard */}
            <Route 
              path = "/signup" 
              element = {
                <AuthRoute>
                  <Signup/>
                </AuthRoute>
              }
            />
            <Route 
              path = "/login" 
              element = {
                <AuthRoute>
                  <LoginPage/>
                </AuthRoute>
              }
            />
            
            {/* User Routes - All user-facing routes, admins redirected to /admin/dashboard */}
            <Route 
              path = "/" 
              element = {
                <ProtectedRoute allowedRole="user" allowPublic={true}>
                  <HomePage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/books" 
              element = {
                <ProtectedRoute allowedRole="user" allowPublic={true}>
                  <BooksPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/book/:id" 
              element = {
                <ProtectedRoute allowedRole="user" allowPublic={true}>
                  <BookDetailPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/contact" 
              element = {
                <ProtectedRoute allowedRole="user" allowPublic={true}>
                  <Contact/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/cart" 
              element = {
                <ProtectedRoute allowedRole="user">
                  <CartPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/checkout" 
              element = {
                <ProtectedRoute allowedRole="user">
                  <CheckoutPage/>
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/dashboard/*" 
              element = {
                <ProtectedRoute allowedRole="user">
                  <UserDashboard/>
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes - Only admins can access, regular users redirected to /dashboard */}
            <Route path = "/admin" element = {<AdminRedirect/>}/>
            <Route 
              path = "/admin/*" 
              element = {
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard/>
                </ProtectedRoute>
              }
            />
            </Routes>
            </Suspense>
            <Toaster />
            <ConfirmationModal />
          </div>
        </CartProvider>
      </ConfirmationProvider>
    </ThemeProvider>
  )
}


