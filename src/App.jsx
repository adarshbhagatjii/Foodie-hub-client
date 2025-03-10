import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './component/Home'
import Body from './Body'
import Login from './component/Login'
import Signup from './component/Signup'
import ResaturantMenu from './component/RestaurantMenu'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Cart from './component/Cart'
import Navbar from './component/Navbar'
import PlaceOrder from './component/PlaceOrder'


const App = () => {

  const [user, setUser]= useState(null);

  useEffect (()=>{
    const storedUser = localStorage.getItem('user')
    if(storedUser){
      setUser(JSON.parse(storedUser))

    }

  }, [])
  return (
    <>
    <Provider store={appStore}>

      <BrowserRouter basename='/'>
     
        <Routes>
          <Route path="/" element={<Body user={user} setUser={setUser}/>} >
            <Route index  element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path= "/restaurant/:resid" element= {<ResaturantMenu />} /> 

          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
