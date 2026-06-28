import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskProvider, useTasks } from "./context/TaskContext.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { AddTaskPage } from "./pages/AddTaskPage.tsx";
import { EditTaskPage } from "./pages/EditTaskPage.tsx";

// Helper component to manage keyboard shortcuts and layout wrapper
const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchTasks } = useTasks();

  // Dark mode persistent state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("taskflow_dark_mode");
    if (saved) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Mobile/Tablet Sidebar toggled drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("taskflow_dark_mode", String(darkMode));
  }, [darkMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      // Safeguard: Don't trigger shortcuts if user is actively writing in a form field
      const isTyping = activeTag === "input" || activeTag === "textarea" || document.activeElement?.getAttribute("contenteditable") === "true";

      if (isTyping) {
        // Allow escaping inputs on ESC
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          toast.info("Hotkey: Navigating to Create Task Form", { autoClose: 1500 });
          navigate("/add");
          break;
        case "/":
          e.preventDefault();
          const searchInput = document.getElementById("search-tasks-input");
          if (searchInput) {
            searchInput.focus();
            toast.info("Hotkey: Search Bar Focused", { autoClose: 1000 });
          }
          break;
        case "r":
          e.preventDefault();
          toast.info("Hotkey: Synchronizing Task list...", { autoClose: 1000 });
          fetchTasks();
          break;
        case "escape":
          e.preventDefault();
          // Go home on ESC
          if (location.pathname !== "/") {
            navigate("/");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location, fetchTasks]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleQuickAdd = () => {
    navigate("/add");
  };

  return (
    <div className="min-h-screen glass-bg flex flex-col transition-colors duration-200 relative">
      {/* Dynamic Glowing Ambient Blobs for Frosted Glass Backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-300/10 dark:bg-emerald-500/5 blur-[120px] animate-float-reverse" />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-purple-400/10 dark:bg-violet-600/5 blur-[140px] animate-float-slow" />
      </div>

      {/* Top sticky Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        toggleSidebar={toggleSidebar}
        onQuickAdd={handleQuickAdd}
      />

      {/* Main Container Stage (Sidebar + Page content) */}
      <div className="flex-grow flex relative">
        {/* Left Side Navigation and Stats Panel */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onQuickAdd={handleQuickAdd} />

        {/* Dynamic page content container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTaskPage />} />
            <Route path="/edit/:id" element={<EditTaskPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* React Toastify alerts */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        aria-label="Toast Container"
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <AppLayout />
      </TaskProvider>
    </BrowserRouter>
  );
}
