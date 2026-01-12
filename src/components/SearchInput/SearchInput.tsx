import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search users...",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative flex-1 min-w-[200px] max-w-[400px] max-sm:max-w-none">
      <input
        type="text"
        className="w-full py-2 px-4 pr-10 text-base border border-slate-200 rounded-lg bg-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder:text-slate-500"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search users by name"
      />
      {value && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-xl text-slate-500 cursor-pointer p-1 leading-none rounded hover:text-slate-800 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-1 focus-visible:bg-slate-200"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};
