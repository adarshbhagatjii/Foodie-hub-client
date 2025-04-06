import React from 'react';

const RestaurantCard = ({ resdata }) => {
  return (
    <div className="bg-white flex flex-col justify-center items-center rounded-lg shadow-2xl overflow-hidden text-gray-800 ">
      
      <div className="w-full h-48 object-cover">
        <img
          className="w-full h-full object-cover"
          src={resdata.imageUrl}
          alt={resdata.name}
        />
      </div>

     
      <h3 className="text-lg font-bold p-2">{resdata.restaurantName}</h3>
      <h4 className="text-sm font-semibold p-2">{resdata.cuisine}</h4>
      <h4 className="text-sm font-semibold p-2">
        ⭐ {resdata.rating ? resdata.rating : "N/A"}
      </h4>
      <h4 className="text-sm font-semibold p-2 text-center">
        {resdata.description?.length > 80
          ? resdata.description.substring(0, 80) + "..."
          : resdata.description}
      </h4>
    </div>
  );
};

export default RestaurantCard;
