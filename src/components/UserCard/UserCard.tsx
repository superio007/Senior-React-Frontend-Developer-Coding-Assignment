import React, { memo } from "react";
import type { User } from "../../types";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const UserCardComponent: React.FC<UserCardProps> = ({ user, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-500 hover:-translate-y-0.5 focus:shadow-md focus:border-blue-500 focus-visible:outline-3 focus-visible:outline-blue-500 focus-visible:outline-offset-2 focus-visible:shadow-md focus-visible:border-blue-500 focus-visible:-translate-y-0.5"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${user.name}`}
    >
      <h3 className="m-0 mb-2 text-lg font-semibold text-slate-800">
        {user.name}
      </h3>
      <p className="m-0 mb-1 text-sm text-blue-500">{user.email}</p>
      <p className="m-0 text-sm text-slate-500">{user.company.name}</p>
    </div>
  );
};

export const UserCard = memo(UserCardComponent);
