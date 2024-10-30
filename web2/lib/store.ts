// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/slices/tasksSlice";
import userReducer from "../store/slices/userSlice";
import commentsReducer from "../store/slices/commentsSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      users: userReducer,
      comments: commentsReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
