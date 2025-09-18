import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItem, increaseQuantity, decreaseQuantity } from '../utils/cartSlice';


const Navbar = ({ user, setUser, searchQuery, setSearchQuery }) => {

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const [showCart, setShowCart] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();


  const cartItems = useSelector((store) => store.cart.items);
  const navigate = useNavigate();
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handelProceed = () => {
    const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }else {
          navigate('/placeorder');
        }
    
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  // Calculate total price based on quantity
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);



  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + '/logout', {}, { withCredentials: true });

      // Clear user from localStorage and state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);

      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-100 drop-shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <div className="flex items-center space-x-3">
          <Link to="/" className=" ">
            <svg width="270" height="60" viewBox="0 0 270 60" xmlns="http://www.w3.org/2000/svg" fill="none">

              <rect width="270" height="60" rx="10" fill="#FED7AA" />


              <circle cx="30" cy="30" r="12" fill="#fff" />
              <circle cx="30" cy="30" r="6" fill="#FF7043" />

              <rect x="47" y="16" width="3" height="26" rx="1" fill="#FF7043" />


              <ellipse cx="54" cy="23" rx="3" ry="6" fill="#FF7043" />
              <rect x="53" y="28" width="2" height="12" rx="1" fill="#FF7043" />


              <text x="70" y="38" font-family="Verdana" font-size="24" font-weight="bold" fill="#FF7043">Foodie</text>
              <text x="160" y="38" font-family="Verdana" font-size="24" font-weight="bold" fill="#D97706">Hub</text>
            </svg>


          </Link>
        </div>

        
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-orange-800 focus:outline-none"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

       
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search for restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute right-3 top-3 text-orange-400"></i>
          </div>
        </div>

       
        <div className="hidden md:flex items-center space-x-6">
          {/* User Menu */}
          <div className="relative user-menu">
            <button
              className="flex items-center space-x-2 text-black hover:text-orange-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
            >
              <i className="fas fa-user"></i>
              <span>Account</span>
              <i
                className={`fas fa-chevron-down ml-2 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                  }`}
              ></i>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {user ? (
                  <>
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-orange-200 whitespace-nowrap"
                      onClick={() => {
                        handleLogOut();
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i> LogOut
                    </button>
                    <Link
                      className="w-full block px-4 py-2 text-black hover:bg-orange-200 whitespace-nowrap"
                      to="/orderHistory"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i class="fa-solid fa-clock-rotate-left mr-2"></i> Orders
                    </Link>

                  </>

                ) : (
                  <Link
                    className="w-full block px-4 py-2 text-black  hover:bg-orange-200 whitespace-nowrap"
                    to="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </Link>
                )}

                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-black hover:bg-orange-20 whitespace-nowrap"
                  >
                    <i className="fa-solid fa-gauge mr-2"></i> Admin Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          
            <div className="relative user-menu">
              <button
                className="flex items-center space-x-2 text-black  hover:text-orange-500 cursor-pointer relative"
                onClick={() => setShowCart(!showCart)}
              >
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-100 px-4 pb-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute right-3 top-3 text-black"></i>
          </div>

          
          <div>
            {user ? (
              <>
              <button
                className="w-full text-left px-4 py-2 text-black hover:bg-orange-200"
                onClick={() => {
                  handleLogOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <i className="fas fa-sign-in-alt mr-2"></i> LogOut
              </button>
              <Link
              className="w-full block px-4 py-2 text-black hover:bg-orange-200 whitespace-nowrap"
              to="/orderHistory"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <i class="fa-solid fa-clock-rotate-left mr-2"></i> Orders
            </Link>
            </>
            ) : (
              <Link
                className="block px-4 py-2 text-black hover:bg-orange-200"
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt mr-2"></i> Login
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 text-black hover:bg-orange-200"
              >
                <i className="fa-solid fa-gauge mr-2"></i> Admin Dashboard
              </Link>
            )}
          </div>

          
           
            <button
              className="flex items-center space-x-2 text-black hover:text-orange-500"
              onClick={() => {
                setShowCart(!showCart);
                setIsMobileMenuOpen(false);
              }}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          
        </div>
      )}

      
      {showCart && (
        <div className="absolute right-0  w-11/12 md:w-96 bg-orange-100 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col z-50 max-h-[90vh] overflow-y-auto">
          {/* Cart Header */}
          <div className="p-6 border-b flex justify-between items-center">
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-black">Shopping Cart</h2>
=======
            <h2 className="text-2xl font-bold text-gray-800">Food Cart</h2>
>>>>>>> 3d4a51edc68296ba13e297e030b72a5854fcaf25
            <button
              className="text-black cursor-pointer"
              onClick={() => setShowCart(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-black mt-8">
                Your cart is empty
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-orange-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">
                        {item.name}
                      </h3>
                      <p className="text-black">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-orange-100 text-black hover:bg-orange-200 cursor-pointer"
                          onClick={() => handleDecreaseQuantity(item._id)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="text-black w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-orange-100 text-black hover:bg-orange-200 cursor-pointer"
                          onClick={() => handleIncreaseQuantity(item._id)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cartItems?.length !== 0 && (
            <div className="p-6 mb-4 bg-white">
              <h2 className="text-orange-400 text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </h2>
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
                onClick={() => {
                  setShowCart(!showCart);
                  handelProceed();
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>



  );

};

export default Navbar;




