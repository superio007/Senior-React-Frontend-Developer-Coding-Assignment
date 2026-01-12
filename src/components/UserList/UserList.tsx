import React from "react";
import type { User } from "../../types";
import { UserCard } from "../UserCard/UserCard";

interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  if (users.length === 0) {
    return (
      <div
        className="text-center p-8 text-slate-500 bg-white rounded-lg border border-dashed border-slate-200"
        role="status"
        aria-live="polite"
      >
        <p>No users found matching your search.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 max-sm:grid-cols-1"
      role="list"
      aria-label="User list"
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={() => onUserClick(user)} />
      ))}
    </div>
  );
};
