import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);


    const getOrderHistory = async () => {
        // API call to get order history
        const res = await axios.get(BASE_URL + "/user/orderHistory", {
            withCredentials: true,
        });
        const data = res.data.userorder;
        
        setOrders(data);

    }
    useEffect(() => {
        getOrderHistory();
    }, [])
    return (
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen py-12 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-10 drop-shadow">
      🍽️ My Orders
    </h2>

    {orders.length === 0 ? (
      <p className="text-center text-gray-500 text-lg">
        You have no orders yet. Start exploring delicious meals! 😋
      </p>
    ) : (
      <div className="space-y-8">
        {orders.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">
                  {item.restaurant.restaurantName}
                </h3>
                <p className="text-orange-100 text-sm">
                  Order ID: {item._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold capitalize shadow 
                  ${
                    item.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
              >
                {item.status}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col md:flex-row gap-8">
              {/* Left: Order Info */}
              <div className="flex-1 space-y-3">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-800">Total Price: </span>
                  <span className="text-orange-600 font-bold">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-800">Payment Method: </span>
                  {item.paymentMethod}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-800">Order Date: </span>
                  {new Date(item.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Right: Ordered Items */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                  🛒 Ordered Items
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {item.items.map((menu) => (
                    <div
                      key={menu._id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        🍔 {menu.menuItem.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Category: {menu.menuItem.category}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Qty: {menu.quantity}
                        </span>
                        <span className="text-sm font-semibold text-orange-600">
                          ${menu.menuItem.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>


    )
}

export default OrderHistory




// <div className="bg-gray-50 min-h-screen py-10 px-4 mt-18">
        //     <div className="max-w-5xl mx-auto">
        //         <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-8">
        //             🍽️ My Orders
        //         </h2>

        //         {orders.length === 0 ? (
        //             <p className="text-center text-gray-500">You have no orders yet.</p>
        //         ) : (
        //             orders.map((item) => (
        //                 <div
        //                     key={item._id}
        //                     className="bg-white rounded-2xl shadow-md p-6 mb-6 transition hover:shadow-lg"
        //                 >
        //                     <div className="flex flex-col md:flex-row justify-between gap-6">
        //                         {/* Order Details */}
        //                         <div className="flex-1">
        //                             <p className="text-sm text-gray-500 mb-1">
        //                                 <span className="font-semibold text-gray-700">
        //                                     Restaurant:
        //                                 </span>{" "}
        //                                 {item.restaurant.restaurantName}
        //                             </p>
        //                             <p className="text-sm text-gray-500 mb-1">
        //                                 <span className="font-semibold text-gray-700">
        //                                     Total Price:
        //                                 </span>{" "}
        //                                 <span className="text-orange-600 font-medium">
        //                                     ${item.totalPrice.toFixed(2)}
        //                                 </span>
        //                             </p>
        //                             <p className="text-sm text-gray-500 mb-1">
        //                                 <span className="font-semibold text-gray-700">Status:</span>{" "}
        //                                 <span
        //                                     className={`font-semibold ${item.status === "completed"
        //                                             ? "text-green-600"
        //                                             : item.status === "cancelled"
        //                                                 ? "text-red-500"
        //                                                 : "text-yellow-500"
        //                                         }`}
        //                                 >
        //                                     {item.status}
        //                                 </span>
        //                             </p>
        //                             <p className="text-sm text-gray-500">
        //                                 <span className="font-semibold text-gray-700">
        //                                     Payment Method:
        //                                 </span>{" "}
        //                                 {item.paymentMethod}
        //                             </p>
        //                             <p className="text-sm text-gray-500 mb-1">
        //                                 <span className="font-semibold text-gray-700">Order Date:</span>{" "}
        //                                 {new Date(item.createdAt).toLocaleString("en-US", {
        //                                     year: "numeric",
        //                                     month: "long",
        //                                     day: "numeric",
        //                                     hour: "numeric",
        //                                     minute: "2-digit",
        //                                 })}
        //                             </p>
        //                         </div>

        //                         {/* Menu Items */}
        //                         <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
        //                             <h4 className="font-semibold text-gray-800 mb-2 text-sm">
        //                                 Ordered Items:
        //                             </h4>
        //                             <div className="space-y-3">
        //                                 {item.items.map((menu) => (
        //                                     <div key={menu._id} className="bg-gray-50 p-3 rounded-md">
        //                                         <p className="text-sm text-gray-700">
        //                                             🍔{" "}
        //                                             <span className="font-semibold">
        //                                                 {menu.menuItem.name}
        //                                             </span>
        //                                         </p>
        //                                         <p className="text-sm text-gray-500">
        //                                             Category: {menu.menuItem.category}
        //                                         </p>
        //                                         <p className="text-sm text-gray-500">
        //                                             Price: ${menu.menuItem.price}
        //                                         </p>
        //                                         <p className="text-sm text-gray-500">
        //                                             Quantity: {menu.quantity}
        //                                         </p>
        //                                     </div>
        //                                 ))}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             ))
        //         )}
        //     </div>
        // </div>