export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskCategory = "Work" | "Personal" | "Study" | "Shopping" | "Health";

export interface ITask {
  _id: string;
  id?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
}

export interface IFilterState {
  search: string;
  status: string; // 'All' | TaskStatus
  priority: string; // 'All' | TaskPriority
  category: string; // 'All Categories' | TaskCategory
  sortBy: string; // Newest First, Oldest First, etc.
}

export interface ITaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
  completionPercentage: number;
}
