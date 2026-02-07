// frontend/src/organizations/components/OrgSwitcher.jsx
import React from "react";
import { useOrganization } from "../hooks/useOrganization";
import { useNavigate } from "react-router-dom";


export function OrgSwitcher() {
  const { orgs, activeOrg, setActiveOrg } = useOrganization();
  const navigate = useNavigate();


  const selectStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--gray-600)", 
    backgroundColor: "var(--gray-800)",
    color: "white",
    fontSize: "0.875rem",
    cursor: "pointer",
    marginBottom: "1rem"
  };

  if (!orgs.length) return null;

  return (
    <div style={{ padding: "0 1rem" }}>
      <div style={{ 
        fontSize: "0.75rem", 
        color: "var(--gray-500)", 
        marginBottom: "0.5rem",
        textTransform: "uppercase",
        fontWeight: "600",
        letterSpacing: "0.05em"
      }}>
        Organization
      </div>
      <select 
        style={selectStyle}
        value={activeOrg?.id || ""} 
        onChange={(e) => {
          const orgId = e.target.value;
          setActiveOrg(orgId);
          navigate(`/organizations/${orgId}/projects`);
        }}
      >
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}