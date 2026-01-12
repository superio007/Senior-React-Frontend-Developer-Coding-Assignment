import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserListPage } from "./pages/UserListPage";

function App() {
  return (
    <ErrorBoundary>
      <UserListPage />
    </ErrorBoundary>
  );
}

export default App;
