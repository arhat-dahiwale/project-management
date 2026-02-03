// frontend/src/context/AuthContext.jsx

import { useContext, useState, createContext, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../shared/utils/storage";
import { setAuthFailureHandler } from "../shared/utils/apiClient";
import { getCurrentUser } from "../auth/auth.api";


const initialAuthState = {
    status:"checking",
    user:null,
    token:null,
};

const AuthContext = createContext(undefined);

export function AuthProvider({children}) {
    const [auth,setAuth] = useState(initialAuthState);

    useEffect(() => {
        let cancelled = false;

        async function bootstrapAuth() {
            const tokenFromStorage = getToken();

            if (!tokenFromStorage) {
            setAuth({
                status: "unauthenticated",
                user: null,
                token: null,
            });
            return;
            }

            try {
            const user = await getCurrentUser();

            if (cancelled) return;

            setAuth({
                status: "authenticated",
                user,
                token: tokenFromStorage,
            });
            } catch (err) {
            removeToken();

            if (cancelled) return;

            setAuth({
                status: "unauthenticated",
                user: null,
                token: null,
            });
            }
        }

        bootstrapAuth();

        return () => {
            cancelled = true;
        };
    }, []);


    

    function login({user,token}) {
        saveToken(token);
        setAuth({
            status:"authenticated",
            user,
            token:token,
        });

    }

    function logout() {
        removeToken();
        setAuth({
            status:"unauthenticated",
            user:null,
            token:null,
        });
    }

    useEffect(() => {
        setAuthFailureHandler(logout);
        return () => setAuthFailureHandler(null);
    },[]);

    const value = {
        status:auth.status,
        user:auth.user,
        token:auth.token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
