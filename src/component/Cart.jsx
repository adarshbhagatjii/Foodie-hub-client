import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItem, increaseQuantity, decreaseQuantity } from '../utils/cartSlice';
import { useNavigate } from 'react-router';

const Cart = () => {
    const cartItems = useSelector((store) => store.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleIncreaseQuantity = (id) => {
        dispatch(increaseQuantity(id));
    };

    const handleDecreaseQuantity = (id) => {
        dispatch(decreaseQuantity(id));
    };

    const handelProceed = () => {
        navigate('/placeorder');
    };

    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    // Calculate total price based on quantity
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="text-center m-4 p-4">
            <h1 className="text-2xl font-bold">Cart</h1>
            <button
                className="bg-gray-300 font-semibold m-3 p-3 rounded-lg"
                onClick={handleClearCart}
            >
                Clear Cart
            </button>
            <div className="w-6/12 m-auto bg-gray-600 shadow-lg">
                {cartItems?.length === 0 && (
                    <h1 className="text-2xl font-bold">Your cart is empty! Add items.</h1>
                )}
                <div className="p-4 space-y-4">
                    {cartItems?.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                            {/* Item Image */}
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md shadow-md"
                            />

                            {/* Item Details */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">
                                    {item.name} <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
                                </h3>
                                <p className="text-gray-300">{item.description}</p>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                                        onClick={() => handleDecreaseQuantity(item._id)}
                                    >
                                        -
                                    </button>
                                    <span className="text-white font-semibold">{item.quantity}</span>
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                        onClick={() => handleIncreaseQuantity(item._id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out cursor-pointer"
                                onClick={() => handleRemoveItem(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    {cartItems?.length !== 0 && (
                        <div className="mt-4 p-4 bg-gray-700 text-white rounded-lg">
                            <h2 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
                            <button
                                className="bg-blue-500 text-white font-semibold mt-3 px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                                onClick={handelProceed}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
