import React from "react";
import { TaskPriority, TaskStatus, TaskCategory } from "../types.ts";

interface BadgeProps {
  type: "priority" | "status" | "category";
  value: TaskPriority | TaskStatus | TaskCategory;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, showDot = false }) => {
  let styles = "px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 w-fit";
  let dotColor = "w-1.5 h-1.5 rounded-full";

  if (type === "priority") {
    switch (value) {
      case "High":
        styles += " bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30";
        dotColor += " bg-red-500";
        break;
      case "Medium":
        styles += " bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30";
        dotColor += " bg-blue-500";
        break;
      case "Low":
        styles += " bg-neutral-100 text-neutral-600 border-neutral-200/60 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700/60";
        dotColor += " bg-neutral-400 dark:bg-neutral-500";
        break;
    }
  } else if (type === "status") {
    switch (value) {
      case "Pending":
        styles += " bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
        dotColor += " bg-amber-500";
        break;
      case "In Progress":
        styles += " bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/30";
        dotColor += " bg-indigo-500";
        break;
      case "Completed":
        styles += " bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
        dotColor += " bg-emerald-500";
        break;
    }
  } else if (type === "category") {
    switch (value) {
      case "Work":
        styles += " bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30";
        dotColor += " bg-violet-500";
        break;
      case "Personal":
        styles += " bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100 dark:bg-fuchsia-950/30 dark:text-fuchsia-400 dark:border-fuchsia-900/30";
        dotColor += " bg-fuchsia-500";
        break;
      case "Study":
        styles += " bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30";
        dotColor += " bg-sky-500";
        break;
      case "Shopping":
        styles += " bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30";
        dotColor += " bg-pink-500";
        break;
      case "Health":
        styles += " bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30";
        dotColor += " bg-rose-500";
        break;
    }
  }

  return (
    <span className={styles} id={`badge-${type}-${value.toLowerCase()}`}>
      {showDot && <span className={dotColor} />}
      {value}
    </span>
  );
};
