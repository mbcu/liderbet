import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "../Home/homeSlice";

export const store = configureStore({
	reducer: {
		info: homeReducer
	}
});