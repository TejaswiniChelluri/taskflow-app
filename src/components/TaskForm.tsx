import React from "react";
import { useForm, Controller } from "react-hook-form";
import { AlertCircle, Save, X } from "lucide-react";
import { ITaskFormData, TaskPriority, TaskStatus, TaskCategory } from "../types.ts";
import { Input, TextArea } from "./Input.tsx";
import { Button } from "./Button.tsx";

interface TaskFormProps {
  initialData?: Partial<ITaskFormData>;
  onSubmit: (data: ITaskFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  // Define default values
  const defaultValues: ITaskFormData = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "Medium",
    status: initialData?.status || "Pending",
    category: initialData?.category || "Personal",
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().substring(0, 10)
      : "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ITaskFormData>({
    defaultValues,
  });

  const priorityOptions: TaskPriority[] = ["High", "Medium", "Low"];
  const statusOptions: TaskStatus[] = ["Pending", "In Progress", "Completed"];
  const categoryOptions: TaskCategory[] = ["Work", "Personal", "Study", "Shopping", "Health"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="task-submission-form">
      {/* Title */}
      <Input
        id="task-form-title"
        label="Task Title"
        placeholder="e.g. Finish project milestones"
        error={errors.title?.message}
        {...register("title", {
          required: "Title is required",
          maxLength: { value: 100, message: "Title must be under 100 characters" },
        })}
      />

      {/* Description */}
      <TextArea
        id="task-form-description"
        label="Task Description"
        placeholder="Provide details about the steps, goals, and resources needed for this task..."
        error={errors.description?.message}
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 10,
            message: "Description must be at least 10 characters long",
          },
        })}
      />

      {/* Selects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Priority Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-display uppercase tracking-wider">
            Priority
          </label>
          <div className="relative">
            <select
              id="task-form-priority"
              {...register("priority")}
              className="appearance-none w-full px-3.5 py-2.5 text-sm glass-input rounded-lg focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-hidden transition-all duration-150 text-neutral-800 dark:text-neutral-100 cursor-pointer"
            >
              {priorityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-display uppercase tracking-wider">
            Status
          </label>
          <div className="relative">
            <select
              id="task-form-status"
              {...register("status")}
              className="appearance-none w-full px-3.5 py-2.5 text-sm glass-input rounded-lg focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-hidden transition-all duration-150 text-neutral-800 dark:text-neutral-100 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-display uppercase tracking-wider">
            Category Hub
          </label>
          <div className="relative">
            <select
              id="task-form-category"
              {...register("category")}
              className="appearance-none w-full px-3.5 py-2.5 text-sm glass-input rounded-lg focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-hidden transition-all duration-150 text-neutral-800 dark:text-neutral-100 cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Due Date Picker */}
      <Input
        id="task-form-duedate"
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate", {
          required: "Due Date is required",
          validate: (val) => {
            const inputDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);
            if (inputDate < today) {
              return "Due date cannot be in the past";
            }
            return true;
          },
        })}
      />

      {/* Actions */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/20 dark:border-white/5">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          icon={<X className="w-4 h-4" />}
          id="task-form-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<Save className="w-4 h-4" />}
          id="task-form-save"
        >
          {initialData ? "Update Task" : "Save Task"}
        </Button>
      </div>
    </form>
  );
};
