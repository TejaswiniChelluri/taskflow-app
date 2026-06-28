import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search tasks...",
}) => {
  return (
    <div className="relative w-full" id="search-bar-container">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
        <Search className="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2.5 text-sm glass-input rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 outline-hidden transition-all duration-150 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
        placeholder={placeholder}
        id="search-tasks-input"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          id="clear-search-btn"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
