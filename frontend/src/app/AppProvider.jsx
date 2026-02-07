// frontend/src/app/AppProvider.jsx

import { AuthProvider } from "../context/AuthContext";
import { OrgProvider } from "../context/OrgContext"; 
import { ProjectProvider } from "../context/projectContext";

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <OrgProvider>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </OrgProvider>
    </AuthProvider>
  );
}
