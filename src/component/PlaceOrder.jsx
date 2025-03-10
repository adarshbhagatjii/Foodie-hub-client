import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { BASE_URL } from '../utils/constants';
import { clearCart } from '../utils/cartSlice';

const PlaceOrder = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'COD') {
      await placeOrder();
    } else {
      handleOnlinePayment();
    }
  };

  const placeOrder = async (paymentId = '') => {
    const orderData = {
      restaurant: cartItems.length > 0 ? cartItems[0].restaurant._id : null,
      items: cartItems.map(item => ({
        menuItem: item._id,
        quantity: item.quantity || 1
      })),
      totalPrice,
      address,
      paymentMethod,
      paymentId
    };

    try {
      const response = await axios.post(BASE_URL+'/user/order', orderData, {withCredentials: true});
      alert('Order placed successfully!');
      dispatch(clearCart());
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-600 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Place Your Order</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Address</h2>
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({...address, street: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({...address, city: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({...address, state: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) => setAddress({...address, postalCode: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={(e) => setAddress({...address, country: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <button 
          onClick={fetchLocation} 
          className="bg-blue-500 text-gray-900 px-4 py-2 rounded w-full">Fetch My Location</button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 text-gray-900 border rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Card Payment</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Price</h2>
        <p className="text-green-600 font-bold">${totalPrice.toFixed(2)}</p>
      </div>

      <button
        className="bg-green-500 text-gray-900 px-4 py-2 rounded w-full"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
