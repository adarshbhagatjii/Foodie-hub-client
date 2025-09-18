import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Shemer from './Shemer';
import RestaurantCard from './RestaurantCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import MenuCard from './MenuCard';
import PromoCarousel from './promoCarousel';


const Home = ({ searchQuery }) => {
    const [listOfRestaurant, setListOfRestaurant] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]); // store all menu items
    const [filteredResturant, setFilteredResturant] = useState([]);
    const [filteredMenulist, setFilteredMenulist] = useState({});

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await axios.get(BASE_URL + "/restaurant/viewAll", {
                withCredentials: true
            });

            const restaurants = Array.isArray(res.data.data) ? res.data.data : [];
            setListOfRestaurant(restaurants);
            setFilteredResturant(restaurants);

            // collect all menu items
            let allMenu = [];
            restaurants.forEach(restaurant => {
                if (Array.isArray(restaurant.menu)) {
                    allMenu = [...allMenu, ...restaurant.menu];
                }
            });
            setAllMenuItems(allMenu);

            // group menu items initially
            const groupedMenu = allMenu.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});
            setFilteredMenulist(groupedMenu);

        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    // fetch once
    useEffect(() => {
        fetchData();
    }, []);

    // filter when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim() === "") {
            // reset to all
            setFilteredResturant(listOfRestaurant);

            const groupedMenu = allMenuItems.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});
            setFilteredMenulist(groupedMenu);

        } else {
            // filter restaurants
            const filteredRestaurants = listOfRestaurant.filter(res =>
                res.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredResturant(filteredRestaurants);

            // filter menu items
            const filteredMenuItems = allMenuItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const groupedFilteredMenu = filteredMenuItems.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});
            setFilteredMenulist(groupedFilteredMenu);
        }
    }, [searchQuery, listOfRestaurant, allMenuItems]);

    return listOfRestaurant.length === 0 ? (
        <Shemer />
    ) : (
        <>
        <div className='mt-24 '>
        <PromoCarousel />
        </div>

        <div className=' bg-orange-50' >
            <div className=" m-4" >
                <h2 className="text-2xl font-bold text-gray-800 pt-4 mb-6 text-center ">
                    🍽️ Restaurant Categories
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredResturant.length > 0 ? (
                        filteredResturant.map((restaurant) => (
                            <Link key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                                <RestaurantCard resdata={restaurant} />
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            No restaurants found matching "{searchQuery}"
                        </p>
                    )}
                </div>

            </div>


            <div className="p-4 sm:p-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
                    Featured Dishes
                </h2>

                {Object.keys(filteredMenulist).length > 0 ? (
                    Object.keys(filteredMenulist).map((category) => (
                        <div key={category} className="my-6">
                            <h3 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 border-b-2 pb-2">
                                {category}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredMenulist[category].map((menu) => (
                                    <MenuCard key={menu._id} menudata={menu} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-4">No menu items available.</p>
                )}
            </div>


        </div>
        </>


    );
};

export default Home;


