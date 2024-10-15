import React from 'react'
import Home from './components/home/Home'
import Course from './components/course/Course'
import {Routes , Route, Navigate} from "react-router-dom"
import Signup from './components/Signup'
import Contact from './components/Contact'
import About from './components/About'
import { Toaster } from 'react-hot-toast';

export default function App() {
  // console.log(localStorage.getItem("token"))
  return (
    <div className="dark:bg-slate-950 dark:text-white">
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/course" element = {localStorage.getItem("token")?<Course/>:<Navigate to = "/signup"/>}/>
        <Route path = "/signup" element = {<Signup/>}/>
        <Route path = "/contact" element = {<Contact/>}/>
        <Route path = "/about" element = {<About/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}


