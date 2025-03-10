import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage (if available)
const loadCartFromLocalStorage = () => {
    const cartData = localStorage.getItem("cartItems");
    return cartData ? JSON.parse(cartData) : [];
};

const saveCartToLocalStorage = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadCartFromLocalStorage(),
    },
    reducers: {
        addItem: (state, action) => {
            const itemIndex = state.items.findIndex(item => item._id === action.payload._id);
            if (itemIndex >= 0) {
                state.items[itemIndex].quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            saveCartToLocalStorage(state.items);
        },
        increaseQuantity: (state, action) => {
            const itemIndex = state.items.findIndex(item => item._id === action.payload);
            if (itemIndex >= 0) {
                state.items[itemIndex].quantity += 1;
                saveCartToLocalStorage(state.items);
            }
        },
        decreaseQuantity: (state, action) => {
            const itemIndex = state.items.findIndex(item => item._id === action.payload);
            if (itemIndex >= 0) {
                if (state.items[itemIndex].quantity > 1) {
                    state.items[itemIndex].quantity -= 1;
                } else {
                    state.items.splice(itemIndex, 1);
                }
                saveCartToLocalStorage(state.items);
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveCartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cartItems");
        },
    },
});

export const { addItem, removeItem, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
