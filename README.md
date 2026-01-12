# User Management Dashboard

A production-quality React 19 TypeScript dashboard for managing and viewing user data. Features search, sort, and detail view capabilities with a focus on performance, maintainability, and accessibility.

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

The application will be available at `http://localhost:5173` by default.

## Features

- **User List Display**: Fetches and displays users from JSONPlaceholder API
- **Search**: Debounced search filtering by user name
- **Sort**: Toggle between A-Z and Z-A alphabetical sorting
- **Detail Modal**: Click any user to view full contact details
- **Error Handling**: Graceful error states with retry capability
- **Accessibility**: Keyboard navigation, focus management, ARIA attributes

## Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary/   # React error boundary
│   ├── ErrorMessage/    # Error display with retry
│   ├── LoadingSpinner/  # Loading indicator
│   ├── SearchInput/     # Debounced search input
│   ├── SortControl/     # Sort direction toggle
│   ├── UserCard/        # Individual user display
│   ├── UserList/        # User list container
│   └── UserModal/       # User detail modal
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts   # Generic debounce hook
│   ├── useModal.ts      # Modal state + ESC key handling
│   └── useUsers.ts      # Data fetching + state management
├── pages/               # Page-level components
│   └── UserListPage/    # Main dashboard page
├── types/               # TypeScript type definitions
│   └── user.ts          # User, Address, Company interfaces
└── utils/               # Utility functions
    ├── api.ts           # API service layer
    └── userFilters.ts   # Filter and sort functions
```

## Architectural Decisions

### State Management

- **Local state with hooks**: Chose React's built-in useState/useReducer over external state libraries (Redux, Zustand) because the app's state is simple and localized. No global state sharing needed.
- **Custom hooks for separation**: `useUsers`, `useDebounce`, and `useModal` encapsulate specific concerns, making components cleaner and logic reusable.

### Data Flow

- **Unidirectional**: Data flows down from `UserListPage` to child components via props. Events bubble up through callbacks.
- **Derived state with useMemo**: Filtered and sorted users are computed from source data, avoiding state synchronization issues.

### Component Design

- **Presentational/Container pattern**: `UserListPage` handles logic and state; child components are mostly presentational.
- **Single responsibility**: Each component has one job (e.g., `SearchInput` only handles search input, not filtering logic).

## Performance: Re-renders and Optimizations

### How Re-renders Are Prevented

1. **Debounced Search Input** (`useDebounce`)

   - Problem: Typing triggers a state change on every keystroke, causing the entire user list to re-filter and re-render.
   - Solution: The `useDebounce` hook delays updating `debouncedSearchTerm` until 300ms after the user stops typing. The filter computation only runs when `debouncedSearchTerm` changes, not on every keystroke.

2. **Memoized Filtered/Sorted List** (`useMemo`)

   - Problem: Filtering and sorting are O(n) operations that would run on every render.
   - Solution: `useMemo` caches the computed result. It only recalculates when `users`, `debouncedSearchTerm`, or `sortDirection` change.

   ```typescript
   const filteredAndSortedUsers = useMemo(() => {
     const filtered = filterUsersByName(users, debouncedSearchTerm);
     return sortUsersByName(filtered, sortDirection);
   }, [users, debouncedSearchTerm, sortDirection]);
   ```

3. **Memoized UserCard** (`React.memo`)

   - Problem: When the parent re-renders (e.g., modal opens), all UserCard components would re-render even if their props haven't changed.
   - Solution: `React.memo` wraps `UserCard`, performing a shallow comparison of props. Cards only re-render when their specific `user` or `onClick` prop changes.

4. **Stable Callbacks** (`useCallback`)
   - Problem: Inline functions create new references on every render, breaking `React.memo` optimizations.
   - Solution: `useCallback` memoizes event handlers like `handleSortToggle`, `handleUserClick`, and `handleCloseModal`, ensuring stable references.

### What We Intentionally Avoided

- **Over-memoization**: Not every value needs memoization. Simple computations and components that always re-render anyway don't benefit from it.
- **Premature optimization**: Started with a working implementation, then added optimizations where profiling showed benefit.

## Scaling to 100,000 Users

The current implementation works well for the 10 users from JSONPlaceholder. For 100,000 users, these changes would be necessary:

### 1. List Virtualization

Replace the current list rendering with a virtualization library:

```typescript
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={filteredUsers.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <UserCard
      style={style}
      user={filteredUsers[index]}
      onClick={() => handleUserClick(filteredUsers[index])}
    />
  )}
</FixedSizeList>;
```

This renders only visible items (~10-20) instead of all 100,000.

### 2. Server-Side Filtering and Sorting

Move filtering/sorting to the API:

```typescript
// Instead of fetching all users and filtering client-side:
const { users } = await fetch(
  `/api/users?search=${term}&sort=${direction}&page=${page}`
);
```

Benefits:

- Reduces payload size (only fetch matching users)
- Leverages database indexes for fast queries
- Enables pagination

### 3. Pagination or Infinite Scroll

Implement cursor-based pagination:

```typescript
interface PaginatedResponse {
  users: User[];
  nextCursor: string | null;
  totalCount: number;
}
```

### 4. Web Workers for Heavy Computation

If client-side filtering is still needed, offload to a worker:

```typescript
// filterWorker.ts
self.onmessage = (e) => {
  const { users, searchTerm } = e.data;
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  self.postMessage(filtered);
};
```

### 5. Search Optimization

For complex search, use a search index library like Fuse.js or MiniSearch that pre-indexes data for faster lookups.

## Refactoring Considerations

### If I Had More Time

1. **Add comprehensive tests**: Property-based tests for filter/sort logic, integration tests for user flows, accessibility tests.

2. **Extract a design system**: Move common styles, spacing, and colors to CSS custom properties or a theme object.

3. **Add loading skeletons**: Replace the spinner with skeleton placeholders that match the layout for better perceived performance.

4. **Implement optimistic updates**: If the app had write operations, show changes immediately while syncing in the background.

5. **Add error tracking**: Integrate with a service like Sentry to capture and monitor production errors.

### Code Quality Improvements

1. **Stricter TypeScript**: Enable `strict: true` and `noUncheckedIndexedAccess` for better type safety.

2. **Component documentation**: Add JSDoc comments to all public interfaces and complex functions.

3. **Storybook**: Create a component library with Storybook for visual testing and documentation.

## API Reference

The application fetches data from:

- **Endpoint**: `https://jsonplaceholder.typicode.com/users`
- **Method**: GET
- **Response**: Array of User objects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
