import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { BASE_URL } from '../utils/constants';
import { clearCart } from '../utils/cartSlice';
import { toast } from 'react-toastify';

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
    <div className="max-w-md mx-auto p-4 bg-orange-100 text-gray-900 shadow-lg mt-18 rounded-lg mb-3">
      <h1 className="text-xl text-center font-bold mb-4">Place Your Order</h1>

      <div className="mb-4 gap-2">
        <h2 className="text-lg text-center font-semibold">Address</h2>
        <label  className="block text-sm font-medium text-orange-500">
                  Street
                </label>
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          required
          onChange={(e) => setAddress({...address, street: e.target.value})}
          className="block w-full rounded-md border border-orange-900 bg-orange-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
        />
        <label  className="block text-sm font-medium text-orange-500">
                  City
                </label>
        <input
          type="text"
          placeholder="City"
          value={address.city}
          required
          onChange={(e) => setAddress({...address, city: e.target.value})}
          className=" block w-full rounded-md border border-orange-900 bg-orange-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
        />
        <label  className="block text-sm font-medium text-orange-500">
                  State
                </label>
        <input
          type="text"
          placeholder="State"
          value={address.state}
          required
          onChange={(e) => setAddress({...address, state: e.target.value})}
          className="block w-full rounded-md border border-orange-900 bg-orange-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
        />
        <label className="block text-sm font-medium text-orange-500">
                  PostalCode
                </label>
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          required
          onChange={(e) => setAddress({...address, postalCode: e.target.value})}
          className="block w-full rounded-md border border-orange-900 bg-orange-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
        />
        <label className="block text-sm font-medium text-orange-500">
                  Country
                </label>
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          required
          onChange={(e) => setAddress({...address, country: e.target.value})}
          className="block w-full rounded-md border border-orange-900 bg-orange-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
        />
        <button 
          onClick={fetchLocation} 
          className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 mt-4">Fetch My Location</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 text-gray-900 border rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Online Payment</option>
          
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Price</h2>
        <p className="text-green-600 font-bold">${newPrice}</p>
      </div>

      <button
        className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
      
    </div>
  );
};

export default PlaceOrder;
