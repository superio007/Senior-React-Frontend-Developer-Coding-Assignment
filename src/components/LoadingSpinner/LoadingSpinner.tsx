import React from "react";

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading...",
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 gap-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-10 h-10 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="text-slate-500 text-sm">{label}</span>
    </div>
  );
};
