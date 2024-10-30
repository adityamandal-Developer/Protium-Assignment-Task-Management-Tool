import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";
import { FilterTasksDto, Task } from "@/types/types";

interface TasksState {
  tasks: Task[];
  stats: {
    totalTasks?: number;
    pendingTasks?: number;
    completedTasks?: number;
    highPriorityTasks?: number;
  };
  loading: boolean;
  error: string | null;
  filters: FilterTasksDto;
}

const initialState: TasksState = {
  tasks: [],
  stats: {},
  loading: false,
  error: null,
  filters: {},
};
// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ filters, token }: { filters: FilterTasksDto; token: string }) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.dueDateBefore)
      queryParams.append("dueDateBefore", filters.dueDateBefore);
    if (filters.dueDateAfter)
      queryParams.append("dueDateAfter", filters.dueDateAfter);
    if (filters.search) queryParams.append("search", filters.search);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}tasks?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch tasks");
    return (await response.json()) as Task[];
  }
);

export const fetchTasksStats = createAsyncThunk(
  "tasks/fetchTasksStats",
  async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}tasks/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch tasks Stats");
    return await response.json();
  }
);

// Async thunk to create a task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({
    taskData,
    token,
  }: {
    taskData: Omit<Task, "id">;
    token: string;
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Failed to create task");
    return (await response.json()) as Task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({
    taskId,
    taskData,
    token,
  }: {
    taskId: string;
    taskData: Partial<Task>;
    token: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) throw new Error("Failed to update task");
    return (await response.json()) as Task;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterTasksDto>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create task";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update the task in the array
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })
      .addCase(fetchTasksStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTasksStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks stats";
      });
  },
});

export const selectTasksStats = (state: RootState) => state.tasks.stats;
export const { setFilters } = tasksSlice.actions;
export const selectTasksState = (state: RootState) => state.tasks;
export default tasksSlice.reducer;
