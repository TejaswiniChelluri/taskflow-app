import React, { useEffect, useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Briefcase,
  User,
  BookOpen,
  ShoppingBag,
  Heart,
  Keyboard,
  Compass,
  History,
  X,
} from "lucide-react";
import { useTasks } from "../context/TaskContext.tsx";
import { TaskCategory } from "../types.ts";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: () => void;
}

interface ActivityLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onQuickAdd }) => {
  const { stats, filters, updateFilters, tasks } = useTasks();
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Category list configuration
  const categories: { name: TaskCategory | "All Categories"; icon: React.ReactNode; color: string }[] = [
    { name: "All Categories", icon: <Compass className="w-4 h-4" />, color: "text-neutral-500" },
    { name: "Work", icon: <Briefcase className="w-4 h-4" />, color: "text-violet-500" },
    { name: "Personal", icon: <User className="w-4 h-4" />, color: "text-fuchsia-500" },
    { name: "Study", icon: <BookOpen className="w-4 h-4" />, color: "text-sky-500" },
    { name: "Shopping", icon: <ShoppingBag className="w-4 h-4" />, color: "text-pink-500" },
    { name: "Health", icon: <Heart className="w-4 h-4" />, color: "text-rose-500" },
  ];

  // Load activities from localStorage to make it real and fully dynamic
  useEffect(() => {
    const loadLogs = () => {
      const logs = localStorage.getItem("taskflow_activity_log");
      if (logs) {
        try {
          setActivities(JSON.parse(logs).slice(0, 5)); // Keep last 5
        } catch (e) {
          setActivities([]);
        }
      }
    };

    loadLogs();
    // Poll for changes in localStorage (e.g. when tasks are mutated)
    const interval = setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Progress circle configuration
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.completionPercentage / 100) * circumference;

  return (
    <>
      {/* Backdrop for tablet & mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/40 dark:bg-neutral-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 md:sticky md:top-16 md:h-[calc(100vh-64px)] w-64 glass-panel !border-y-0 !border-l-0 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        id="taskflow-sidebar"
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between md:hidden pb-1 border-b border-neutral-50 dark:border-neutral-800">
            <span className="font-bold text-sm text-neutral-400">Navigation</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Ring Card Widget */}
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-18 h-18 transform -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-neutral-200/50 dark:stroke-neutral-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-neutral-900 dark:stroke-neutral-100 transition-all duration-500 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black font-display text-neutral-800 dark:text-neutral-200">
                {stats.completionPercentage}%
              </span>
            </div>
            <div className="flex-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-display">
                Completion Rate
              </h4>
              <p className="text-xl font-black text-neutral-800 dark:text-neutral-100 mt-0.5">
                {stats.completed}/{stats.total}
              </p>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Tasks finished</span>
            </div>
          </div>

          {/* Categories Filter list */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1 font-display">
              Task Hubs
            </h3>
            <ul className="space-y-1">
              {categories.map((cat) => {
                const isActive =
                  (cat.name === "All Categories" && filters.category === "All Categories") ||
                  filters.category === cat.name;

                return (
                  <li key={cat.name}>
                    <button
                      onClick={() => {
                        updateFilters({ category: cat.name });
                        onClose(); // Auto-close on mobile
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-neutral-900/85 text-white dark:bg-white dark:text-neutral-900 shadow-xs backdrop-blur-xs"
                          : "text-neutral-600 hover:bg-white/40 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/30 dark:hover:text-neutral-200"
                      }`}
                      id={`sidebar-category-${cat.name.toLowerCase().replace(" ", "-")}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? "text-inherit" : cat.color}>{cat.icon}</span>
                        <span>{cat.name === "All Categories" ? "Overview" : cat.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/10 dark:text-neutral-900"
                            : "bg-neutral-100/60 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {cat.name === "All Categories"
                          ? tasks.length
                          : tasks.filter((t) => t.category === cat.name).length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent Activity Log Panel */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1 font-display flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Recent Activity
            </h3>
            <div className="glass-card rounded-xl p-3 min-h-[100px] flex flex-col justify-center">
              {activities.length === 0 ? (
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center font-medium py-4">
                  No actions logged yet.<br />Tasks you edit will log here!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((act) => (
                    <div key={act.id} className="flex flex-col text-[11px] leading-relaxed border-b border-neutral-150/40 dark:border-neutral-800/40 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-bold text-neutral-800 dark:text-neutral-300">
                        {act.type}
                      </span>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {act.message}
                      </p>
                      <span className="text-[9px] text-neutral-400 font-mono mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Guide Footer */}
        <div className="p-4 border-t border-white/20 dark:border-white/5 bg-white/20 dark:bg-black/10">
          <div className="flex gap-2 items-center text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-display mb-2">
            <Keyboard className="w-3.5 h-3.5" /> Hotkeys Guide
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-medium font-mono text-neutral-500 dark:text-neutral-400">
            <div className="flex justify-between border-b border-neutral-200/40 dark:border-neutral-800/60 pb-0.5">
              <span>New Task</span>
              <kbd className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1 rounded-sm text-neutral-600 dark:text-neutral-300">N</kbd>
            </div>
            <div className="flex justify-between border-b border-neutral-200/40 dark:border-neutral-800/60 pb-0.5">
              <span>Search</span>
              <kbd className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1 rounded-sm text-neutral-600 dark:text-neutral-300">/</kbd>
            </div>
            <div className="flex justify-between border-b border-neutral-200/40 dark:border-neutral-800/60 pb-0.5">
              <span>Close</span>
              <kbd className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1 rounded-sm text-neutral-600 dark:text-neutral-300">Esc</kbd>
            </div>
            <div className="flex justify-between border-b border-neutral-200/40 dark:border-neutral-800/60 pb-0.5">
              <span>Sync</span>
              <kbd className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1 rounded-sm text-neutral-600 dark:text-neutral-300">R</kbd>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
