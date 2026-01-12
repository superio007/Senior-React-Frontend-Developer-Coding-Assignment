import React from "react";
import type { SortDirection } from "../../types";

interface SortControlProps {
  direction: SortDirection;
  onToggle: () => void;
}

export const SortControl: React.FC<SortControlProps> = ({
  direction,
  onToggle,
}) => {
  const label = direction === "asc" ? "A-Z" : "Z-A";
  const ariaLabel = `Sort by name ${
    direction === "asc" ? "ascending" : "descending"
  }. Click to toggle.`;

  return (
    <button
      className="py-2 px-4 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-slate-50 hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 focus-visible:bg-slate-50 focus-visible:border-blue-500"
      onClick={onToggle}
      type="button"
      aria-label={ariaLabel}
    >
      Sort: {label}
    </button>
  );
};
