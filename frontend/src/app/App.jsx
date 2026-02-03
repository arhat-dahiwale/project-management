// frontend/src/app/App.jsx

import { AppProviders } from "./AppProvider";
import { AppRouter } from "./Router";

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;