import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import userReducer from "./slices/userSlice";
import commentsReducer from "./slices/commentsSlice";
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    users: userReducer,
    comments: commentsReducer,
  },
});

// Define RootState type for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
