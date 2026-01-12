import { useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { fetchUsers } from "../utils/api";

export interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * A hook for fetching and managing user data.
 * Provides loading and error states, plus a refetch capability.
 *
 * @returns Object containing users array, loading state, error state, and refetch function
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const refetch = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, isLoading, error, refetch };
}
