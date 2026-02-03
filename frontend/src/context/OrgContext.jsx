// frontend/src/context/OrgContext.jsx

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import * as orgApi from "../organizations/org.api";

import {
    getActiveOrgId,
    setActiveOrgId,
    clearActiveOrgId,
} from "../shared/utils/orgStorage";

const OrgContext = createContext(null);

export function OrgProvider({children}) {
    const {status : authStatus} = useAuth();
    const [status,setStatus] = useState("idle");
    const [orgs, setOrgs] = useState([]);
    const [activeOrg, setActiveOrgstate] = useState(null);

    const reset = useCallback(() => {
        setStatus("idle");
        setOrgs([]);
        setActiveOrgstate(null);
        clearActiveOrgId();
    }, []);

    const resolveActiveOrg = useCallback((fetchedOrgs) => {
        const persistedOrgId = getActiveOrgId();
        let resolvedOrg = null;

        if (persistedOrgId) {
            resolvedOrg= fetchedOrgs.find((o) => o.id === persistedOrgId) || null;
        }

        if (!resolvedOrg) {
            resolvedOrg = fetchedOrgs[0] || null;
        }

        if (!resolvedOrg) {
            throw new Error("NO_ORGANIZATION_AVAILABLE");
        }

        setActiveOrgstate(resolvedOrg);
        setActiveOrgId(resolvedOrg.id);
    }, []);

    const bootstrap = useCallback(async () => {
        setStatus("loading");

        try {
            const fetchedOrgs = await orgApi.getOrganizations();
            setOrgs(fetchedOrgs);
            resolveActiveOrg(fetchedOrgs);
            setStatus("ready");
        } catch (err) {
            console.error("org bootstrap failed : ", err);
            setStatus("error");
        }
    }, [resolveActiveOrg]);

    useEffect(() => {
        if (authStatus === "authenticated") {
            bootstrap();
        } else {
            reset();
        }
    }, [authStatus,bootstrap,reset]);

    const setActiveOrg = useCallback((orgId) => {
        const org = orgs.find((o) => o.id === orgId);
        if (!org) return;
        setActiveOrgstate(org);
        setActiveOrgId(org.id);
    },[orgs]);

    const refreshOrgs = useCallback(async () => {
        if (authStatus !== "authenticated") return;
        await bootstrap();
    }, [authStatus,bootstrap]);

    const value = {
        status,
        orgs,
        activeOrg,
        setActiveOrg,
        refreshOrgs,
    };

    return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrgContext() {
    const ctx = useContext(OrgContext);
    if (!ctx) {
        throw new Error("OrgContext must be used within OrgProvider");
    }
    return ctx;
}