import React from 'react'
import Home from './components/home/Home'
import Course from './components/course/Course'
import {Routes , Route} from "react-router-dom"
import Signup from './components/Signup'
import Contact from './components/Contact'
import About from './components/About'

export default function App() {
  return (
    <div className="dark:bg-slate-950 dark:text-white">
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/course" element = {<Course/>}/>
        <Route path = "/signup" element = {<Signup/>}/>
        <Route path = "/contact" element = {<Contact/>}/>
        <Route path = "/about" element = {<About/>}/>
      </Routes>
    </div>
  )
}


