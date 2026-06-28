import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const sortOptions = ["Newest First", "Oldest First", "Priority", "Due Date", "Alphabetical"];

  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto" id="sort-dropdown-container">
      <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-display pl-0.5">
        Sort By
      </span>
      <div className="relative">
        <select
          id="sort-tasks-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full sm:w-auto min-w-[140px] pl-8 pr-8 py-2 text-xs font-semibold glass-input rounded-lg outline-hidden transition-all duration-150 text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
              {opt}
            </option>
          ))}
        </select>
        {/* Sort Icons */}
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
          <ArrowUpDown className="h-3.5 w-3.5" />
        </div>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-neutral-400">
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
