import React from "react";
import { motion } from "motion/react";
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, Hourglass } from "lucide-react";
import { ITask } from "../types.ts";
import { Badge } from "./Badge.tsx";
import { useTasks } from "../context/TaskContext.tsx";

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDeleteClick: (task: ITask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDeleteClick }) => {
  const { updateTask } = useTasks();

  // Calculate formatted dates
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedCreatedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate due date countdown & overdue status
  const getDueStatus = () => {
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (task.status === "Completed") {
      return { text: "Completed", isOverdue: false, style: "text-emerald-600 dark:text-emerald-400" };
    }

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "day" : "days"}`,
        isOverdue: true,
        style: "text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-sm border border-red-100 dark:border-red-900/30",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due Today ⚠️",
        isOverdue: false,
        style: "text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-sm border border-amber-100 dark:border-amber-900/30",
      };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow", isOverdue: false, style: "text-neutral-600 dark:text-neutral-400 font-medium" };
    } else {
      return { text: `Due in ${diffDays} days`, isOverdue: false, style: "text-neutral-500 dark:text-neutral-400" };
    }
  };

  const dueStatus = getDueStatus();

  // Double click or quick toggles status to completed
  const toggleComplete = async () => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    await updateTask(task._id, { status: newStatus });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col justify-between glass-card ${
        dueStatus.isOverdue
          ? "border-red-300 dark:border-red-900/50 shadow-xs shadow-red-500/5 ring-1 ring-red-500/15"
          : ""
      } rounded-xl p-5 overflow-hidden`}
      id={`task-card-${task._id}`}
    >
      {/* Complete indicator banner if overdue */}
      {dueStatus.isOverdue && (
        <span className="absolute top-0 right-0 left-0 h-1 bg-red-500" />
      )}

      {/* Top badges and Quick status tick */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-wrap gap-1.5 items-center">
          <Badge type="category" value={task.category} />
          <Badge type="priority" value={task.priority} showDot />
        </div>

        {/* Quick checkmark toggle */}
        <button
          onClick={toggleComplete}
          title={task.status === "Completed" ? "Mark incomplete" : "Quick mark completed"}
          className={`p-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
            task.status === "Completed"
              ? "bg-emerald-50/50 border-emerald-200/50 text-emerald-600 dark:bg-emerald-950/25 dark:border-emerald-900/30 dark:text-emerald-400"
              : "bg-white/40 border-white/40 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800/35 dark:border-neutral-700/50 dark:text-neutral-500 dark:hover:text-neutral-300"
          }`}
          id={`toggle-complete-btn-${task._id}`}
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Task Content */}
      <div className="mt-4 flex-grow">
        <h3
          onClick={toggleComplete}
          className={`text-base font-bold font-display tracking-tight text-neutral-900 dark:text-white cursor-pointer select-none decoration-neutral-400 decoration-2 decoration-wavy ${
            task.status === "Completed" ? "line-through text-neutral-400 dark:text-neutral-500 opacity-80" : ""
          }`}
          id={`task-title-${task._id}`}
        >
          {task.title}
        </h3>
        <p
          className={`mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed whitespace-pre-wrap ${
            task.status === "Completed" ? "opacity-70" : ""
          }`}
          id={`task-desc-${task._id}`}
        >
          {task.description}
        </p>
      </div>

      {/* Footer Area with Dates and Actions */}
      <div className="mt-5 pt-4 border-t border-white/40 dark:border-white/5 flex flex-col gap-3">
        {/* Dates and Countdown */}
        <div className="flex flex-col gap-1.5">
          {/* Due date countdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className={dueStatus.style}>{dueStatus.text}</span>
          </div>

          {/* Actual dates */}
          <div className="flex justify-between items-center text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due: {formattedDueDate}
            </span>
            <span>Created: {formattedCreatedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-white/20 dark:border-white/5">
          <Badge type="status" value={task.status} />

          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Edit Task"
              id={`edit-task-btn-${task._id}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteClick(task)}
              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Delete Task"
              id={`delete-task-btn-${task._id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
