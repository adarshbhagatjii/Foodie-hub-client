import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage (if available)
const loadCartFromLocalStorage = () => {
    const cartData = localStorage.getItem("cartItems");
    return cartData ? JSON.parse(cartData) : [];
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadCartFromLocalStorage(),
    },
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.items)); // Save to localStorage
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item._id !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.items)); // Save to localStorage
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cartItems"); // Clear from localStorage
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
