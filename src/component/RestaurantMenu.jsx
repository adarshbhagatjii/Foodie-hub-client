import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decreaseQuantity, increaseQuantity } from '../utils/cartSlice';


const RestaurantMenu = () => {
    const [menu, setMenu] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [RestaurantName, setRestaurantName] = useState("");
    const cartItems = useSelector(state => state.cart.items);
    

    const { resid } = useParams();
    const dispatch = useDispatch();

    const handleAddClick= (item) => {
        dispatch(addItem(item));
    };
    const handleIncrease = (itemId) => {
        dispatch(increaseQuantity(itemId));
    };

    const handleDecrease = (itemId) => {
        dispatch(decreaseQuantity(itemId));
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

    const getItemQuantity = (itemId) => {
        const item = cartItems.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };
    

    return (
        <div className="p-4 mt-18 sm:p-6 max-w-4xl mx-auto h-screen overflow-y-auto">
  <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">{RestaurantName}</h1>
  <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Menu Items</h1>

  {categories.map(category => {
    const isOpen = selectedCategory[category];

    return (
      <div key={category} className="bg-orange-100 shadow-lg rounded-lg mb-4 transition-all duration-300">
        
        <div 
          className="flex justify-between items-center px-4 sm:px-6 py-4 bg-orange-200 cursor-pointer text-gray-800 rounded-t-lg" 
          onClick={() => toggleCategory(category)}
        >
          <h2 className="text-lg sm:text-xl font-semibold">
            {category} ({menu.filter(item => item.category === category).length})
          </h2>
          <span className="text-lg sm:text-xl">
            {isOpen ? "🔺" : "🔻"}
          </span>
        </div>

        
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 space-y-4">
            {menu.filter(item => item.category === category).map(item => (
              <div 
                key={item._id} 
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b text-gray-800 pb-4"
              >
                
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-md shadow-md"
                />

            
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {item.name} 
                    <span className="text-green-600 font-bold ml-2">${item.price.toFixed(2)}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800">{item.description}</p>
                </div>

                
                <div className="flex justify-end sm:justify-start">
                  {getItemQuantity(item._id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDecrease(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                      <span>{getItemQuantity(item._id)}</span>
                      <button onClick={() => handleIncrease(item._id)} className="bg-green-500 text-white px-2 py-1 rounded">+</button>
                    </div>
                  ) : (
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                      onClick={() => handleAddClick(item)}
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })}
</div>

    );
};

export default RestaurantMenu;
