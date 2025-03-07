
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
 
  const [user, setUser]= useState(null);
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handelLogOut= async()=>{
    try{
      await axios.post(BASE_URL+'/logout', {}, {
        withCredentials: true
      })
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
     
       return navigate('/login');
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="navbar bg-silver shadow-sm">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to='/'>My Restro</Link>
      </div>
       <div className="flex-none">
      
       {user && (
          <div className="text-gray-700 font-semibold mr-4">
            Welcome, {user.name}
          </div>
        )}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
              <span className="badge badge-sm indicator-item">{cartItems.length}</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{cartItems.length} Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
               <Link to='/cart'> <button className="btn btn-primary btn-block" >View cart</button> </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><Link to='/login'>Login</Link></li>
            <li><button onClick={handelLogOut}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar