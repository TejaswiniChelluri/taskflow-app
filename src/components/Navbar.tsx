import React from "react";
import { Menu, Sun, Moon, Database, Plus, CheckSquare, Sparkles } from "lucide-react";
import { useTasks } from "../context/TaskContext.tsx";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleSidebar: () => void;
  onQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  toggleSidebar,
  onQuickAdd,
}) => {
  const { isMongo, stats } = useTasks();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel !border-t-0 !border-x-0 transition-colors duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo and Hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-hidden md:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
            id="mobile-sidebar-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              TaskFlow
              <span className="hidden sm:inline-block text-[10px] font-semibold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded-md font-sans">
                v1.0
              </span>
            </span>
          </div>
        </div>

        {/* Right Side: Status Badges, Progress, Theme Toggle, Actions */}
        <div className="flex items-center gap-3">
          {/* Database Status indicator (very informative!) */}
          <div
            className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 ${
              isMongo
                ? "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                : "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40"
            }`}
            title={
              isMongo
                ? "Connected to MongoDB Atlas Database"
                : "Using Local File Storage. Configure MONGO_URI in secrets for MongoDB Atlas!"
            }
            id="db-status-badge"
          >
            <Database className={`w-3.5 h-3.5 ${isMongo ? "animate-pulse" : ""}`} />
            <span>{isMongo ? "Atlas DB Connected" : "Local Demo Storage"}</span>
          </div>

          {/* Task Completion Mini Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold px-2.5 py-1 glass-card rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "10s" }} />
            <span className="text-neutral-600 dark:text-neutral-400">
              Progress: <span className="text-neutral-900 dark:text-white font-bold">{stats.completionPercentage}%</span>
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 glass-card transition-all duration-150 cursor-pointer"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onQuickAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
            id="navbar-quick-add-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};
