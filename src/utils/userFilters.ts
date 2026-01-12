import type { User, SortDirection } from "../types/user";

/**
 * Filters users by name (case-insensitive)
 * @param users - Array of users to filter
 * @param searchTerm - Search string to match against user names
 * @returns Filtered array of users whose names contain the search term
 */
export function filterUsersByName(users: User[], searchTerm: string): User[] {
  if (!searchTerm.trim()) {
    return users;
  }

  const normalizedSearch = searchTerm.toLowerCase();
  return users.filter((user) =>
    user.name.toLowerCase().includes(normalizedSearch)
  );
}

/**
 * Sorts users by name alphabetically
 * @param users - Array of users to sort
 * @param direction - Sort direction ('asc' for A-Z, 'desc' for Z-A)
 * @returns New sorted array of users
 */
export function sortUsersByName(
  users: User[],
  direction: SortDirection
): User[] {
  return [...users].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return direction === "asc" ? comparison : -comparison;
  });
}
