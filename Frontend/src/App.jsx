import React from 'react'
import Home from './components/home/Home'
import HomePage from './pages/HomePage'
import Course from './components/course/Course'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import UserDashboard from './pages/UserDashboard'
import {Routes , Route, Navigate} from "react-router-dom"
import Signup from './components/Signup'
import LoginPage from './components/LoginPage'
import Contact from './components/Contact'
import About from './components/About'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="dark:bg-slate-950 dark:text-white">
          <Routes>
            <Route path = "/" element = {<HomePage/>}/>
            <Route path = "/books" element = {<BooksPage/>}/>
            <Route path = "/book/:id" element = {<BookDetailPage/>}/>
            <Route path = "/cart" element = {localStorage.getItem("token")?<CartPage/>:<Navigate to = "/login"/>}/>
            <Route path = "/checkout" element = {localStorage.getItem("token")?<CheckoutPage/>:<Navigate to = "/login"/>}/>
            <Route path = "/dashboard/*" element = {localStorage.getItem("token")?<UserDashboard/>:<Navigate to = "/login"/>}/>
            <Route path = "/course" element = {localStorage.getItem("token")?<Course/>:<Navigate to = "/signup"/>}/>
            <Route path = "/signup" element = {<Signup/>}/>
            <Route path = "/login" element = {<LoginPage/>}/>
            <Route path = "/contact" element = {<Contact/>}/>
            <Route path = "/about" element = {<About/>}/>
          </Routes>
          <Toaster />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}


