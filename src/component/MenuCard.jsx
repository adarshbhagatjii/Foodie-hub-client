import React from 'react'
import { useDispatch } from 'react-redux';
import { addItem } from '../utils/cartSlice';
import { toast } from 'react-toastify';

const MenuCard = ({ menudata }) => {

const dispatch = useDispatch();

    const handleAddClick= (item) => {
        
        dispatch(addItem(item));
        toast.success('Added to cart!!');
    };

    return (
        <div className="w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[18vw] bg-white text-gray-600 p-4  flex flex-col items-center mx-3 pb-8 mt-5 shadow-orange-200 rounded-lg shadow-md  transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-full h-40  rounded-lg shadow-md overflow-hidden"> <img className="w-full h-full object-cover" src={menudata.imageUrl} alt={menudata.name} /></div>

            <h3 className="text-lg font-bold p-2">{menudata.name}</h3>
            <p className="text-sm font-semibold p-2">{menudata.description}</p>
            <p className="text-lg font-bold p-2">Price: ${menudata.price}</p>
            <button
                className="!rounded-button w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:opacity-90 transition-colors cursor-pointer whitespace-nowrap "
                onClick={() => handleAddClick(menudata)}
            >
                Add +
            </button>
        </div>
    )
}

export default MenuCard