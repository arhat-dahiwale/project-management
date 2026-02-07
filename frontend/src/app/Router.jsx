// frontend/src/app/Router.jsx

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage.jsx";
import { RegisterPage } from "../auth/pages/RegisterPage.jsx";
import {OrganizationsPage} from "../organizations/pages/OrganizationsPage.jsx"
import { ProjectsPage } from "../projects/pages/ProjectsPage.jsx";
import { ProjectDetailsPage } from "../projects/pages/ProjectDetailsPage.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { PublicRoute } from "./routes/PublicRoute.jsx";
import { AppLayout } from "./AppLayout.jsx";


export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                <Route 
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />
                
                <Route
                    element={
                        <ProtectedRoute>
                        <AppLayout />
                        </ProtectedRoute>
                    }
                    >
                    <Route path="/" element={<Navigate to="/organizations" replace />} />
                    <Route path="/organizations" element={<OrganizationsPage />} />
                    <Route path="/organizations/:orgId/projects" element={<ProjectsPage />} />
                    <Route path="/organizations/:orgId/projects/:projectId" element={<ProjectDetailsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
                    
            </Routes>
        </BrowserRouter>
    );
}
