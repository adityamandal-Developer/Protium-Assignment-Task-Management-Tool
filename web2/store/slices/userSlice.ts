import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";

// Define the initial state with an array for users, loading, and error states
const initialState = {
  users: [] as Array<{
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>,
  loading: false,
  error: null as string | null,
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ token }: { token: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

// Selector to get the users state
export const selectUsersState = (state: RootState) => state.users;

export default userSlice.reducer;
