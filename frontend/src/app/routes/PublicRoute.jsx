import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PublicRoute({children}) {
    const {status} = useAuth();

    if (status=== "checking") {
        return <p>Loading...</p>;
    }

    if (status === "authenticated") {
        return <Navigate to="/organizations" replace /> 
    }

    if (status === "unauthenticated") {
        return children;
    }

    return null;
}