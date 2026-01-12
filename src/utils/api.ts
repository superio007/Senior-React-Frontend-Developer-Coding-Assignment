import type { User } from "../types";

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Fetches users from the JSONPlaceholder API
 * @returns Promise resolving to array of User objects
 * @throws Error on network failure or non-OK HTTP response
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error (e.g., no internet connection)
      throw new Error("Unable to connect. Please check your connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch users");
  }
}
