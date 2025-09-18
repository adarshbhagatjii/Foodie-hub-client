import React from 'react'
import Navbar from './component/Navbar'
import { Outlet } from 'react-router'
import Footer from './component/Footer'
import { ToastContainer } from 'react-toastify';


const Body = ({user, setUser, setSearchQuery,  searchQuery }) => {
  

  return (
    <div className=' bg-gray-50 '>
       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Navbar user={user} setUser={setUser} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Outlet />
      <Footer />

    </div>
  )
}

export default Body