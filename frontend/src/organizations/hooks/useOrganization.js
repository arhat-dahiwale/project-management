// frontend/src/organizations/hooks/useOrganization.js

import { useState, useCallback } from "react";
import { useOrgContext } from "../../context/OrgContext";
import * as orgApi from "../org.api";

export function useOrganization() {

  const { 
    orgs, 
    activeOrg, 
    setActiveOrg, 
    refreshOrgs 
  } = useOrgContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrganization = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
        const newOrg = await orgApi.createOrganization(payload);
        await refreshOrgs();
        setActiveOrg(newOrg.id);
        return newOrg;
    } catch (err) {
        setError(err);
        throw err;
    } finally {
        setIsLoading(false);
    }
  }, [refreshOrgs, setActiveOrg]);

  const updateOrganization = useCallback(async (orgId, payload) => {
    setIsLoading(true);
    setError(null);

    try {
        const updatedOrg = await orgApi.updateOrganization(orgId,payload);
        await refreshOrgs();
        return updatedOrg;
    } catch (err) {
        setError(err);
        throw err;
    } finally {
        setIsLoading(false);
    }
  }, [refreshOrgs]);

  return {
    orgs,
    activeOrg,
    createOrganization,
    updateOrganization,
    setActiveOrg, 
    isLoading,
    error
  };
}