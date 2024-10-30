import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";
import { Comment } from "@/types/types";

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunk to fetch comments for a task
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ taskId, token }: { taskId: string; token: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch comments");
    return (await response.json()) as Comment[];
  }
);

// Async thunk to create a comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({
    taskId,
    content,
    token,
  }: {
    taskId: string;
    content: string;
    token: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) throw new Error("Failed to create comment");
    return (await response.json()) as Comment;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create comment";
      });
  },
});

export const selectCommentsState = (state: RootState) => state.comments;
export default commentsSlice.reducer;
