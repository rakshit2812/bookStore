import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import CourseBody from '../CourseBody'
import list from "../../../public/list.json"

export default function Course() {
  return (
    <div>
      <Navbar/>
      <div className="min-h-screen ">
        <CourseBody/>
      </div>
      <Footer/>
    </div>
  )
}
