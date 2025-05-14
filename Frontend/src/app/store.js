import { configureStore, combineReducers } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import userSlice from "./userSlice";
import gradesReducer from "./gradeSlice"; // Import the persisted reducer
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userDetails", "grades"], // Persist only user details and grades
};

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  userDetails: userSlice,
  grades: gradesReducer, // Use the exported persisted reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions for serializable check
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);