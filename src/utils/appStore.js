import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";


const appStore = configureStore({
    reducer: {
        // Add your reducers here
        cart: cartReducer,
        user: userReducer,
    }
})
export default appStore;
