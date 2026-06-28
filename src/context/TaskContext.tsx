import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ITask, IFilterState, ITaskStats, ITaskFormData } from "../types.ts";

interface TaskContextType {
  tasks: ITask[];
  loading: boolean;
  operationLoading: boolean;
  isMongo: boolean;
  filters: IFilterState;
  stats: ITaskStats;
  fetchTasks: () => Promise<void>;
  getTaskById: (id: string) => Promise<ITask | null>;
  createTask: (data: ITaskFormData) => Promise<boolean>;
  updateTask: (id: string, data: Partial<ITaskFormData>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  updateFilters: (updated: Partial<IFilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters: IFilterState = {
  search: "",
  status: "All",
  priority: "All",
  category: "All Categories",
  sortBy: "Newest First",
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [isMongo, setIsMongo] = useState(false);
  const [filters, setFilters] = useState<IFilterState>(defaultFilters);

  // Compute stats on the fly based on loaded tasks
  const [stats, setStats] = useState<ITaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    completionPercentage: 0,
  });

  // Calculate statistics from raw tasks list
  const recalculateStats = useCallback((taskList: ITask[]) => {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === "Completed").length;
    const pending = taskList.filter((t) => t.status === "Pending").length;
    const inProgress = taskList.filter((t) => t.status === "In Progress").length;
    const highPriority = taskList.filter((t) => t.priority === "High").length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({
      total,
      completed,
      pending,
      inProgress,
      highPriority,
      completionPercentage,
    });
  }, []);

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tasks", {
        params: {
          search: filters.search || undefined,
          status: filters.status !== "All" ? filters.status : undefined,
          priority: filters.priority !== "All" ? filters.priority : undefined,
          category: filters.category !== "All Categories" ? filters.category : undefined,
          sortBy: filters.sortBy,
        },
      });

      if (response.data?.success) {
        setTasks(response.data.tasks);
        setIsMongo(response.data.mode === "mongodb");
        recalculateStats(response.data.tasks);
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      const msg = error.response?.data?.message || "Failed to load tasks. Checking backend connection...";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters, recalculateStats]);

  // Initial fetch and effect for filtering
  useEffect(() => {
    fetchTasks();
  }, [filters, fetchTasks]);

  // Get task details by ID
  const getTaskById = async (id: string): Promise<ITask | null> => {
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      if (response.data?.success) {
        return response.data.task;
      }
      return null;
    } catch (error: any) {
      console.error(`Error fetching task ${id}:`, error);
      toast.error("Error loading task details.");
      return null;
    }
  };

  // Create a new task
  const createTask = async (data: ITaskFormData): Promise<boolean> => {
    setOperationLoading(true);
    try {
      const response = await axios.post("/api/tasks", data);
      if (response.data?.success) {
        toast.success("Task created successfully! 🎉");
        await fetchTasks(); // Refresh state dynamically
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating task:", error);
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((err: any) => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(error.response?.data?.message || "Failed to create task");
      }
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (id: string, data: Partial<ITaskFormData>): Promise<boolean> => {
    setOperationLoading(true);
    try {
      const response = await axios.put(`/api/tasks/${id}`, data);
      if (response.data?.success) {
        toast.success("Task updated successfully! ✨");
        await fetchTasks(); // Refresh state dynamically
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(`Error updating task ${id}:`, error);
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((err: any) => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(error.response?.data?.message || "Failed to update task");
      }
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete task with id
  const deleteTask = async (id: string): Promise<boolean> => {
    setOperationLoading(true);
    try {
      const response = await axios.delete(`/api/tasks/${id}`);
      if (response.data?.success) {
        toast.success("Task deleted successfully! 🗑️");
        await fetchTasks(); // Refresh state dynamically
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(`Error deleting task ${id}:`, error);
      toast.error(error.response?.data?.message || "Failed to delete task");
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  const updateFilters = (updated: Partial<IFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        operationLoading,
        isMongo,
        filters,
        stats,
        fetchTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
