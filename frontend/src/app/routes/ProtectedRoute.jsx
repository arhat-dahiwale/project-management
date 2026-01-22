import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function ProtectedRoute({children}) {
    const {status} = useAuth();

    if (status === "checking") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace={true} />
    }

    if (status === "authenticated") {
        return children;
    }

    return null;
}


