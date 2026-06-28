import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useTasks } from "../context/TaskContext.tsx";
import { TaskForm } from "../components/TaskForm.tsx";
import { ITaskFormData } from "../types.ts";
import { logActivity } from "../utils/activity.ts";

export const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTask, operationLoading } = useTasks();

  const handleFormSubmit = async (data: ITaskFormData) => {
    const success = await createTask(data);
    if (success) {
      logActivity("Task Created 📝", `Added new task: "${data.title}"`);
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="add-task-view">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer w-fit"
          id="add-task-back-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mt-1">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900 dark:text-white">
              Create New Task Objective
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Fill in the parameters below to add a new objective milestone to your workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form container */}
      <div className="glass-card rounded-xl p-6 sm:p-8">
        <TaskForm onSubmit={handleFormSubmit} onCancel={handleCancel} loading={operationLoading} />
      </div>
    </div>
  );
};
