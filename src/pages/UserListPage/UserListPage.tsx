import React, { useState, useMemo, useCallback, useRef } from "react";
import type { User, SortDirection } from "../../types";
import { useUsers } from "../../hooks/useUsers";
import { useDebounce } from "../../hooks/useDebounce";
import { useModal } from "../../hooks/useModal";
import { filterUsersByName, sortUsersByName } from "../../utils/userFilters";
import { SearchInput } from "../../components/SearchInput/SearchInput";
import { SortControl } from "../../components/SortControl/SortControl";
import { UserList } from "../../components/UserList/UserList";
import { UserModal } from "../../components/UserModal/UserModal";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const DEBOUNCE_DELAY = 300;

/**
 * Main page component for the user management dashboard.
 * Integrates search, sort, and modal functionality.
 *
 * Requirements: 1.1, 2.1, 2.2, 2.4, 3.1, 3.2, 4.1, 5.1, 5.2, 6.1, 7.1
 */
export const UserListPage: React.FC = () => {
  // Data fetching
  const { users, isLoading, error, refetch } = useUsers();

  // Search state with debouncing (Requirements 2.1, 2.2, 7.1)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  // Sort state (Requirements 3.1, 3.2)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Selected user and modal state (Requirement 4.1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Modal hook with focus restoration callback
  const handleModalClose = useCallback(() => {
    setSelectedUser(null);
    // Return focus to the element that triggered the modal (Requirement 8.3)
    if (triggerElementRef.current) {
      triggerElementRef.current.focus();
      triggerElementRef.current = null;
    }
  }, []);

  const { isOpen, open, close } = useModal(handleModalClose);

  // Compute filtered and sorted users with useMemo (Requirement 7.1)
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = filterUsersByName(users, debouncedSearchTerm);
    return sortUsersByName(filtered, sortDirection);
  }, [users, debouncedSearchTerm, sortDirection]);

  // Handle sort toggle (Requirement 3.1)
  const handleSortToggle = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Handle user click to open modal (Requirement 4.1)
  const handleUserClick = useCallback(
    (user: User) => {
      // Store the currently focused element for focus restoration
      triggerElementRef.current = document.activeElement as HTMLElement;
      setSelectedUser(user);
      open();
    },
    [open]
  );

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    close();
  }, [close]);

  // Render loading state (Requirement 5.1)
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 sm:p-4">
        <LoadingSpinner label="Loading users..." />
      </div>
    );
  }

  // Render error state (Requirement 6.1)
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 sm:p-4">
        <ErrorMessage
          message={error.message || "Failed to load users. Please try again."}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-4">
      <header className="mb-6">
        <h1 className="m-0 text-2xl font-semibold text-slate-800">
          User Management
        </h1>
      </header>

      <div className="flex gap-4 mb-6 flex-wrap max-sm:flex-col">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users by name..."
        />
        <SortControl direction={sortDirection} onToggle={handleSortToggle} />
      </div>

      <main className="min-h-[300px]">
        <UserList
          users={filteredAndSortedUsers}
          onUserClick={handleUserClick}
        />
      </main>

      <UserModal
        user={selectedUser}
        isOpen={isOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
