import { AuthProvider } from "../context/AuthContext";
// import { OrgProvider } from "../context/OrgContext"; // later

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
