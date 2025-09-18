import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { BASE_URL } from '../utils/constants';
import { clearCart } from '../utils/cartSlice';
import { toast } from 'react-toastify';
import { MapPin, ShoppingCart } from "lucide-react";



const PlaceOrder = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const newPrice = Math.round(totalPrice); 

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'COD') {
       await placeOrder();
    } else {
    await handleOnlinePayment();
    }
  };
  

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const { address } = response.data;
        setAddress({
          street: address.road,
          city: address.city,
          state: address.state,
          postalCode: address.postcode,
          country: address.country
        });
      } catch (error) {
        console.error('Failed to fetch address', error);
      }
    }, (error) => {
      console.warn('Location access denied. Please enter address manually.');
    });
  };
  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handleOnlinePayment = async () => {
    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }
  
      //  Create an order on the backend
      const  data = await axios.post(`${BASE_URL}/create-order`, {
        amount: newPrice,
        currency: "INR",
      }, { withCredentials: true });
      
  
      //  Configure Razorpay options
      const options = {
        key: "rzp_test_K3OXcUUfDvf7Nm", 
        amount: data.amount,  
        currency: data.currency,
        name: "Foodie Hub",
        description: "Order Payment",
        order_id: data.data.orderId,  
       
      
        handler: async (response) => {
          try {
           
      
            //  Verify the payment
            const verifyRes = await axios.post(
              `${BASE_URL}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id, 
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature, 
                orderData: {
                  restaurant: cartItems.length > 0 ? cartItems[0].restaurant._id : null,
                  items: cartItems.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity || 1
                  })),
                  totalPrice,
                  address,
                  paymentMethod: "Card"
                }
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, 
              }
            );
            
      
            
      
            if (verifyRes.data.success) {
              toast.success("✅ Payment Successful & Order Placed!");
              dispatch(clearCart());
              navigate("/");
            } else {
              toast.error("❌ Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("⚠️ Payment verification error! Please try again.");
          }
        },
      
        prefill: {
          name: "foodie hub",
          email: "foodiehub01@gmail.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };
      
  
      //  Open Razorpay payment modal
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
  
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed!");
    }
  };
  
  

 

  const placeOrder = async () => {
    const orderData = {
      restaurant: cartItems.length > 0 ? cartItems[0].restaurant._id : null,
      items: cartItems.map(item => ({
        menuItem: item._id,
        quantity: item.quantity || 1
      })),
      totalPrice,
      address,
      paymentMethod
    };
    

    try {
      const response = await axios.post(BASE_URL+'/user/order', orderData, {withCredentials: true});
      
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="max-w-md mx-auto my-24 rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 flex items-center gap-3">
        <ShoppingCart className="w-6 h-6" />
        <div>
          <h1 className="text-lg font-bold">Complete Your Order</h1>
          <p className="text-sm text-orange-100">
            Fill in your details to place your order
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Address */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md text-black font-semibold">Delivery Address</h2>
            <button
              onClick={fetchLocation}
              className="flex items-center gap-1 px-3 py-1 border border-orange-400 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 rounded-md  transition text-sm text-white "
            >
              <MapPin className="w-4 h-4" /> Use Location
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500  outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
                className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-md text-black font-semibold mb-2">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option className="bg-orange-300 hover:bg-orange-600" value="">Choose payment method</option>
            <option className="bg-orange-300 hover:bg-orange-600" value="COD">Cash on Delivery</option>
            <option className="bg-orange-300 hover:bg-orange-600" value="Card">Online Payment</option>
          </select>
        </div>
        

        {/* Total */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <h2 className="text-md font-semibold text-black">Total Amount</h2>
          <p className="text-sm text-black">Including taxes and delivery</p>
          <p className="text-2xl font-bold text-orange-600">
            ${newPrice}
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handlePlaceOrder}
          className="w-full  text-white font-semibold py-3 rounded-md bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90  transition"
        >
          Place Order - ${newPrice}
        </button>
      </div>
      </div>
  );
};

export default PlaceOrder;
