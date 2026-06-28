import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label?: string;
  error?: string;
  id: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-display uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`px-3.5 py-2 text-sm ${
            error
              ? "bg-white/50 dark:bg-neutral-900/50 border border-red-500 focus:ring-red-500/20"
              : "glass-input focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10"
          } rounded-lg outline-hidden focus:ring-4 transition-all duration-150 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 font-sans ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500 mt-0.5 animate-fadeIn" id={`${id}-error`}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-display uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`px-3.5 py-2 text-sm ${
            error
              ? "bg-white/50 dark:bg-neutral-900/50 border border-red-500 focus:ring-red-500/20"
              : "glass-input focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10"
          } rounded-lg outline-hidden focus:ring-4 transition-all duration-150 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 font-sans min-h-[100px] resize-y ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500 mt-0.5 animate-fadeIn" id={`${id}-error`}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
