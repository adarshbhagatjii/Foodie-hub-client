import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Shemer from './Shemer';
import RestaurantCard from './RestaurantCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

import MenuCard from './MenuCard';


const Home = () => {
    const [listOfRestaurant, setListOfRestaurant] = useState([]);
    const [menulist, setMenulist] = useState({});
    
  const navigate = useNavigate();
 

    const fetchData = async () => {
        const token = localStorage.getItem("token"); // Get token from localStorage

        if (!token) {
            navigate("/login"); // Redirect to login if no token
            return;
        }
       
        try {
            const res = await axios.get(BASE_URL + "/restaurant/viewAll", {
                withCredentials: true
            });

            const restaurants = Array.isArray(res.data.data) ? res.data.data : [];
           console.log(res.data);
           
           let allMenuItems = [];
           restaurants.forEach(restaurant => {
               if (Array.isArray(restaurant.menu)) {
                   allMenuItems = [...allMenuItems, ...restaurant.menu];
               }
           });
             // 🏷️ **Group menu items by category**
             const groupedMenu = allMenuItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {});

            // Extract restaurants from "data" property
            setListOfRestaurant(restaurants);
            setMenulist(groupedMenu);
            
        } catch (error) {
           
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("token"); // Remove invalid token
                navigate("/login"); // Redirect to login if unauthorized
            }
        }
    };

    useEffect(() => {

        fetchData();
    }, []);

    return listOfRestaurant.length === 0 ? (
        <Shemer />
    ) : (
        <div >
            <div className=" m-6 border-gray-900 rounded-lg  bg-gray-900">
            <h2 className="text-3xl font-bold text-center text-gray-300  p-4">
                    🍽️ Restaurant Categories
                </h2>
           <div className='flex flex-wrap justify-center gap-6 p-6'>
           {listOfRestaurant.map((restaurant) => (
                    <Link key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                        <RestaurantCard resdata={restaurant} />
                    </Link>
                ))}
           </div>
               
            </div>
            
                
            <div className="p-6">
                <h2 className="text-3xl font-bold text-center text-gray-300 mb-6">
                    🍽️ Menu Categories
                </h2>

                {Object.keys(menulist).length > 0 ? (
                    Object.keys(menulist).map((category) => (
                        <div key={category} className="mb-12 bg-gray-900 shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl font-semibold text-center text-gray-300 mb-4 border-b-2 border-gray-300 pb-2">
                                {category}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-6">
                                {menulist[category].map((menu) => (
                                   <MenuCard  key={menu._id} menudata={menu} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No menu items available.</p>
                )}
            </div>
            
        </div>
    );
};

export default Home;
