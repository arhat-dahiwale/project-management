// frontend/src/app/routes/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {Spinner } from "../../shared/components/Spinner.jsx"

export function ProtectedRoute({children}) {
    const {status} = useAuth();

    if (status === "checking") {
        return <Spinner />
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace={true} />
    }

    if (status === "authenticated") {
        return children;
    }

    return null;
}


