// frontend/src/app/App.jsx

import { AppProvider } from "./AppProvider";
import { AppRouter } from "./Router";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;