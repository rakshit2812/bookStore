import React from 'react'
import Navbar from '../Navbar'
import Banner from "../Banner"
import FreebookCards from "../FreebookCards"
import Footer from "../Footer"


export default function Home() {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <FreebookCards/>
      <Footer/>
    </div>
  )
}
