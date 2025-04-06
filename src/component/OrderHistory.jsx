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
        <div className="bg-gray-50 min-h-screen py-10 px-4 mt-18">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-8">
                    🍽️ My Orders
                </h2>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-500">You have no orders yet.</p>
                ) : (
                    orders.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-md p-6 mb-6 transition hover:shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Order Details */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-semibold text-gray-700">
                                            Restaurant:
                                        </span>{" "}
                                        {item.restaurant.restaurantName}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-semibold text-gray-700">
                                            Total Price:
                                        </span>{" "}
                                        <span className="text-orange-600 font-medium">
                                            ${item.totalPrice.toFixed(2)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-semibold text-gray-700">Status:</span>{" "}
                                        <span
                                            className={`font-semibold ${item.status === "completed"
                                                    ? "text-green-600"
                                                    : item.status === "cancelled"
                                                        ? "text-red-500"
                                                        : "text-yellow-500"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-semibold text-gray-700">
                                            Payment Method:
                                        </span>{" "}
                                        {item.paymentMethod}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-semibold text-gray-700">Order Date:</span>{" "}
                                        {new Date(item.createdAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                        Ordered Items:
                                    </h4>
                                    <div className="space-y-3">
                                        {item.items.map((menu) => (
                                            <div key={menu._id} className="bg-gray-50 p-3 rounded-md">
                                                <p className="text-sm text-gray-700">
                                                    🍔{" "}
                                                    <span className="font-semibold">
                                                        {menu.menuItem.name}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Category: {menu.menuItem.category}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Price: ${menu.menuItem.price}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {menu.quantity}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    )
}

export default OrderHistory