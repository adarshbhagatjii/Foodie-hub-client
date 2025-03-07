import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { addItem } from '../utils/cartSlice';


const RestaurantMenu = () => {
    const [menu, setMenu] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [RestaurantName, setRestaurantName] = useState("");
    

    const { resid } = useParams();
    const dispatch = useDispatch();

    const handleClick = (item) => {
        dispatch(addItem(item));
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/menuItem/get/${resid}`, {
                withCredentials: true
            });

            
            const{restaurantName}=res.data.menuItem[0].restaurant;
            setRestaurantName(restaurantName);
          

            const menuData = Array.isArray(res.data.menuItem) ? res.data.menuItem : [];
            setMenu(menuData);

            // Extract unique categories
            const categoryList = [...new Set(menuData.map(item => item.category))];
            setCategories(categoryList);

            // Initialize category state to collapsed (false)
            const initialCategoryState = {};
            categoryList.forEach(category => {
                initialCategoryState[category] = false;
            });
            setSelectedCategory(initialCategoryState);
        } catch (error) {
            console.error("Error fetching data:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Toggle category collapse state
    const toggleCategory = (category) => {
        setSelectedCategory(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };
    

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">{RestaurantName}</h1>
            <h1 className="text-3xl font-bold text-center mb-6"> Menu Items</h1>

            {categories.map(category => (
                <div key={category} className="bg-gray-600 shadow-lg rounded-lg mb-4">
                    {/* Category Header */}
                    <div 
                        className="flex justify-between items-center px-6 py-4 bg-gray-600 cursor-pointer rounded-t-lg" 
                        onClick={() => toggleCategory(category)}
                    >
                        <h2 className="text-xl font-semibold">{category} ({menu.filter(item => item.category === category).length})</h2>
                        <span className="text-xl">{selectedCategory[category] ? "🔺" : "🔻"}</span>
                    </div>

                    {/* Menu Items (Show/Hide based on category state) */}
                    {selectedCategory[category] && (
                        <div className="p-4 space-y-4">
                            {menu.filter(item => item.category === category).map(item => (
                                <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                                    {/* Item Image */}
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="w-20 h-20 object-cover rounded-md shadow-md"
                                    />

                                    {/* Item Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.name} <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span></h3>
                                        <p className="text-gray-300">{item.description}</p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer"
                                        onClick={() => handleClick(item)}
                                    >
                                        Add +
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RestaurantMenu;
