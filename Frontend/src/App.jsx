
import HomePage from './pages/HomePage'
// import Course from './components/course/Course'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import {Routes , Route, Navigate} from "react-router-dom"
import Signup from './components/Signup'
import LoginPage from './components/LoginPage'
import Contact from './components/Contact'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { ConfirmationProvider } from './contexts/ConfirmationContext'
import ConfirmationModal from './components/ConfirmationModal'
import { ProtectedRoute, AdminRedirect, AuthRoute } from './components/RouteProtection'

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <CartProvider>
          <div className="dark:bg-slate-950 dark:text-white">
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
            
            {/* <Route path = "/course" element = {localStorage.getItem("token")?<Course/>:<Navigate to = "/signup"/>}/> */}
            </Routes>
            <Toaster />
            <ConfirmationModal />
          </div>
        </CartProvider>
      </ConfirmationProvider>
    </ThemeProvider>
  )
}


