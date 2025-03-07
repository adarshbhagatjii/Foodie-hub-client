import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Shemer from './Shemer';
import RestaurantCard from './RestaurantCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const Home = () => {
    const [listOfRestaurant, setListOfRestaurant] = useState([]);
    
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

            console.log("API Response:", res.data);

            // Extract restaurants from "data" property
            setListOfRestaurant(Array.isArray(res.data.data) ? res.data.data : []);
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
        <div>
            <div className="flex flex-wrap justify-center gap-6 p-6">
                {listOfRestaurant.map((restaurant) => (
                    <Link key={restaurant._id} to={`/restaurant/${restaurant._id}`}>
                        <RestaurantCard resdata={restaurant} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
