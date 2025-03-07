import React from 'react'
import Navbar from './component/Navbar'
import { Outlet } from 'react-router'
import Footer from './component/footer'


const Body = ({user, setUser}) => {
  

  return (
    <div>
      <Navbar user={user} setUser={setUser}/>
      <Outlet />
      <Footer />

    </div>
  )
}

export default Body