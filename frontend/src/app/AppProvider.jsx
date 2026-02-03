// frontend/src/app/AppProvider.jsx

import { AuthProvider } from "../context/AuthContext";
import { OrgProvider } from "../context/OrgContext"; 
import { ProjectProvider, projectProvider } from "../context/projectContext";

export default function AppProviders({ children }) {
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
