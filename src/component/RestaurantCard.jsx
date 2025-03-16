import React from 'react';

const RestaurantCard = ({ resdata }) => {
  return (
    <div className="w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[18vw] bg-gray-700 p-4 flex flex-col items-center mx-3 pb-8 mt-5 rounded-lg shadow-md  transform transition duration-300 hover:scale-105 hover:shadow-xl">
      {/* Image Container */}
      <div className="w-full h-40 bg-gray-800 rounded-md overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={resdata.imageUrl}
          alt={resdata.name}
        />
      </div>

      {/* Restaurant Details */}
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
