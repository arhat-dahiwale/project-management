// frontend/src/app/Router.jsx

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage.jsx";
import { RegisterPage } from "../auth/pages/RegisterPage.jsx";
import {OrganizationsPage} from "../organizations/pages/OrganizationsPage.jsx"
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { PublicRoute } from "./routes/PublicRoute.jsx";


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
                    path="/organizations"
                    element={
                        <ProtectedRoute>
                            <OrganizationsPage />
                        </ProtectedRoute>
                    }   
                />
                    
            </Routes>
        </BrowserRouter>
    );
}
