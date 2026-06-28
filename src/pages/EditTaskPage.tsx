import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useTasks } from "../context/TaskContext.tsx";
import { TaskForm } from "../components/TaskForm.tsx";
import { Loader } from "../components/Loader.tsx";
import { ITask, ITaskFormData } from "../types.ts";
import { logActivity } from "../utils/activity.ts";

export const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, operationLoading } = useTasks();

  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        setLoading(true);
        const fetched = await getTaskById(id);
        if (fetched) {
          setTask(fetched);
        } else {
          navigate("/");
        }
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, getTaskById, navigate]);

  const handleFormSubmit = async (data: ITaskFormData) => {
    if (id && task) {
      const success = await updateTask(id, data);
      if (success) {
        logActivity("Task Updated ✨", `Modified parameters on: "${data.title}"`);
        navigate("/");
      }
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return <Loader fullPage size="lg" />;
  }

  if (!task) {
    return (
      <div className="text-center py-12" id="edit-task-not-found">
        <h3 className="text-lg font-bold text-red-500">Task Not Found</h3>
        <button onClick={handleCancel} className="mt-4 text-sm font-semibold text-neutral-600 underline">
          Go back to dashboard
        </button>
      </div>
    );
  }

  // Pre-format dates for edit population
  const initialFormData: Partial<ITaskFormData> = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    category: task.category,
    dueDate: task.dueDate,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="edit-task-view">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer w-fit"
          id="edit-task-back-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mt-1">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs">
            <Edit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-neutral-900 dark:text-white">
              Edit Task Objective
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Refine your task description, status, priority, category hub, or due date.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form container */}
      <div className="glass-card rounded-xl p-6 sm:p-8">
        <TaskForm
          initialData={initialFormData}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          loading={operationLoading}
        />
      </div>
    </div>
  );
};
