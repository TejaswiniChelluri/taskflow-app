import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Inbox,
  TrendingUp,
  AlertTriangle,
  Play,
  CheckCircle,
  FolderOpen,
  SlidersHorizontal,
  RotateCcw,
  Clock,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTasks } from "../context/TaskContext.tsx";
import { SearchBar } from "../components/SearchBar.tsx";
import { FilterDropdown } from "../components/FilterDropdown.tsx";
import { SortDropdown } from "../components/SortDropdown.tsx";
import { Button } from "../components/Button.tsx";
import { TaskCard } from "../components/TaskCard.tsx";
import { Modal } from "../components/Modal.tsx";
import { Loader } from "../components/Loader.tsx";
import { ITask } from "../types.ts";
import { logActivity } from "../utils/activity.ts";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    filters,
    stats,
    updateFilters,
    resetFilters,
    deleteTask,
    operationLoading,
  } = useTasks();

  // Delete modal confirmation states
  const [taskToDelete, setTaskToDelete] = useState<ITask | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEditClick = (task: ITask) => {
    navigate(`/edit/${task._id || task.id}`);
  };

  const handleDeleteClick = (task: ITask) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      const id = taskToDelete._id || taskToDelete.id;
      const success = await deleteTask(id);
      if (success) {
        logActivity("Task Deleted 🗑️", `Removed task: "${taskToDelete.title}"`);
      }
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Recharts priority data computed dynamically
  const chartData = [
    { name: "High", count: tasks.filter((t) => t.priority === "High").length, color: "#ef4444" },
    { name: "Medium", count: tasks.filter((t) => t.priority === "Medium").length, color: "#3b82f6" },
    { name: "Low", count: tasks.filter((t) => t.priority === "Low").length, color: "#737373" },
  ];

  const statusOptions = ["All", "Pending", "In Progress", "Completed"];
  const priorityOptions = ["All", "High", "Medium", "Low"];
  const categoryOptions = ["All Categories", "Work", "Personal", "Study", "Shopping", "Health"];

  // Check if any filter is dirty to show reset button
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.category !== "All Categories";

  return (
    <div className="space-y-8" id="dashboard-main-view">
      {/* Welcome Heading and Quick Add Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-neutral-900 dark:text-white">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Organize, prioritize, and crush your daily objectives with TaskFlow.
          </p>
        </div>
        <Button
          onClick={() => navigate("/add")}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          id="dashboard-add-task-btn"
        >
          Add New Task
        </Button>
      </div>

      {/* Grid containing Stats Cards and Priority Recharts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Cards Grid (takes 2 cols on wide screen) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4" id="stats-cards-grid">
          {/* Total Tasks Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Total Tasks</span>
              <Inbox className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.total}</span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Overall registered objectives</p>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-neutral-400">Pending</span>
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.pending}</span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Awaiting attention</p>
            </div>
          </div>

          {/* In Progress Tasks Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-500">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-neutral-400">In Progress</span>
              <Play className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.inProgress}</span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Active current sprints</p>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-500">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-neutral-400">Completed</span>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.completed}</span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Objectives crushed successfully</p>
            </div>
          </div>

          {/* High Priority Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-red-500">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-neutral-400">High Priority</span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.highPriority}</span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Urgent milestones</p>
            </div>
          </div>

          {/* Progress percentage Card */}
          <div className="glass-card rounded-xl p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-850 dark:text-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-neutral-400">Completeness</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-neutral-900 dark:text-white">{stats.completionPercentage}%</span>
              {/* Micro-bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Priority Bar Chart (takes 1 col) */}
        <div className="glass-card rounded-xl p-4.5 flex flex-col min-h-[220px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-display mb-3">
            Task Priority Distribution
          </h3>
          <div className="flex-grow w-full h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Filters, Controls, Search, and Sorting Bar */}
      <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={filters.search}
            onChange={(val) => updateFilters({ search: val })}
            placeholder="Search objectives by title, description, or category..."
          />
        </div>

        {/* Dropdowns Filters Area */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-end gap-4 border-t border-white/20 dark:border-white/5 pt-4">
          <FilterDropdown
            id="status-filter-select"
            label="Status"
            value={filters.status}
            options={statusOptions}
            onChange={(val) => updateFilters({ status: val })}
          />

          <FilterDropdown
            id="priority-filter-select"
            label="Priority"
            value={filters.priority}
            options={priorityOptions}
            onChange={(val) => updateFilters({ priority: val })}
          />

          <FilterDropdown
            id="category-filter-select"
            label="Category Hub"
            value={filters.category}
            options={categoryOptions}
            onChange={(val) => updateFilters({ category: val })}
          />

          <SortDropdown value={filters.sortBy} onChange={(val) => updateFilters({ sortBy: val })} />

          {/* Reset Filters Option */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors w-full sm:w-auto justify-center sm:justify-start"
              id="reset-filters-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Task List Grid */}
      {loading ? (
        <Loader size="md" />
      ) : tasks.length === 0 ? (
        // Beautiful Empty State
        <div
          className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          id="tasks-empty-state"
        >
          <div className="p-4 rounded-full glass-card text-neutral-400 dark:text-neutral-600">
            <FolderOpen className="w-12 h-12" />
          </div>
          <h3 className="mt-4 text-lg font-bold font-display text-neutral-900 dark:text-white">
            No Objectives Found
          </h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            {hasActiveFilters
              ? "There are no tasks that match your active search, priority, or status filters. Try clearing your filters!"
              : "Your checklist is completely pristine. Kick off a productive sprint by saving your first task milestone."}
          </p>
          <div className="mt-6 flex gap-3">
            {hasActiveFilters ? (
              <Button onClick={resetFilters} variant="secondary">
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/add")}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                id="create-first-task-btn"
              >
                Create Your First Task
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Tasks Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tasks-cards-grid-list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              onEdit={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task Milestone?"
        description={`Are you sure you want to delete "${taskToDelete?.title}"? This operation cannot be reversed.`}
        loading={operationLoading}
      />
    </div>
  );
};
