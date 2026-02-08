// frontend/src/organizations/pages/OrganizationsPage.jsx
import React, { useState } from "react";
import { useOrganization } from "../hooks/useOrganization";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { Input } from "../../shared/components/Input";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { Spinner } from "../../shared/components/Spinner";
import { useNavigate } from "react-router-dom";


export function OrganizationsPage() {
  const navigate = useNavigate();
  const { orgs, createOrganization, updateOrganization, setActiveOrg, isLoading: orgsLoading } = useOrganization();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editOrgName, setEditOrgName] = useState("");


  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      await createOrganization({ name: newOrgName });
      setIsModalOpen(false);
      setNewOrgName("");
    } catch (err) {
      setCreateError(err.message || "Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const pageHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
    flexWrap: "wrap"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem"
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--gray-200)",
    padding: "1.5rem",
    boxShadow: "var(--shadow-sm)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position:"relative"
  };

  if (orgsLoading && orgs.length === 0) {
    return <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}><Spinner /></div>;
  }

  


  return (
    <div>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "var(--gray-900)" }}>
            Organizations
          </h1>
          <p style={{ color: "var(--gray-500)", marginTop: "0.5rem" }}>
            Manage your teams and workspaces
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: "0.5rem" }} >
          + New Organization
        </Button>
      </div>

      <div style={gridStyle}>
        {orgs.map((org) => (
          <div 
            key={org.id} 
            style={cardStyle}
            onClick={() => {setActiveOrg(org.id); navigate(`/organizations/${org.id}/projects`);}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.borderColor = "var(--primary-200)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--gray-200)";
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();       
                setEditingOrg(org);           
                setEditOrgName(org.name);     
                setIsEditModalOpen(true);     
              }}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                padding: "0.25rem",
                color: "var(--gray-400)"
              }}
            >
              ✎
            </Button>


            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              {org.name}
            </h3>
            <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
              Created {new Date(org.created_at).toLocaleDateString()}
            </div>
            {/* add member count here later */}
          </div>
        ))}
        
        {orgs.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", borderStyle: "dashed", backgroundColor: "var(--gray-50)", cursor: "default" }}>
            <p style={{ color: "var(--gray-500)" }}>You don't have any organizations yet.</p>
            <Button variant="ghost" onClick={() => setIsModalOpen(true)} style={{ marginTop: "1rem" }}>
              Create your first one
            </Button>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Organization"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isCreating}>Create Organization</Button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <ErrorMessage message={createError} />
          <Input
            label="Organization Name"
            placeholder="Acme Corp, My Startup, etc."
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!editingOrg}
              onClick={async () => {
                await updateOrganization(editingOrg.id, { name: editOrgName });
                setIsEditModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <Input
          label="Organization Name"
          value={editOrgName}
          onChange={(e) => setEditOrgName(e.target.value)}
          autoFocus
        />
      </Modal>

    </div>
  );
}