import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", fullPage = false }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  const containerClasses = fullPage
    ? "fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-neutral-200 border-t-neutral-800 dark:border-neutral-800 dark:border-t-neutral-200`}
        />
        {fullPage && (
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 font-display animate-pulse">
            Syncing TaskFlow...
          </p>
        )}
      </div>
    </div>
  );
};
