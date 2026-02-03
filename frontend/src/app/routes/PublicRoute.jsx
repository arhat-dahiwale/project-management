// frontend/src/app/routes/PublicRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../shared/components/Spinner.jsx"

export function PublicRoute({children}) {
    const {status} = useAuth();

    if (status=== "checking") {
        return <Spinner />
    }

    if (status === "authenticated") {
        return <Navigate to="/organizations" replace /> 
    }

    if (status === "unauthenticated") {
        return children;
    }

    return null;
}