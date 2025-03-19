import { configureStore, combineReducers } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import userSlice from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userDetails"], // Persist only user details
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  userDetails: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
