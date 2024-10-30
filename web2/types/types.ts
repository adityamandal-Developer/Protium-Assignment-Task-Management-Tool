export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  assigneeId?: string;
  comments?: string[];
}

export interface FilterTasksDto {
  status?: Status | "ALL";
  priority?: Priority | "ALL";
  dueDateBefore?: string;
  dueDateAfter?: string;
  search?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  taskId: string;
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}
