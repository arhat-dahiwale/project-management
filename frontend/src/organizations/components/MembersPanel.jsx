// frontend/src/organizations/components/MembersPanel.jsx
import { useEffect, useState } from "react";
import { listMembers, addMember, removeMember } from "../members.api";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../shared/components/Modal";

export function MembersPanel({ orgId }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);



  async function refresh() {
    const data = await listMembers(orgId);
    setMembers(data);
  }

  useEffect(() => {
    refresh();
  }, [orgId]);

  async function handleAdd() {
    setLoading(true);
    setError(null);

    try {
      await addMember(orgId, { email, role });
      setEmail("");
      await refresh();
    } catch (err) {
      if (err?.message === "USER_NOT_FOUND") {
        setError("No user found with this email.");
      } else if (err?.message === "ALREADY_A_MEMBER") {
        setError("This user is already a member of the organization.");
      } else if (err?.message === "INSUFFICIENT_ROLE") {
        setError("You don’t have permission to add members.");
      } else {
        setError("Failed to add member. Please try again.");
      }
    } finally {
      setLoading(false); 
    }
  }


  async function handleRemove(userId) {
    try {
      await removeMember(orgId, userId);
      await refresh();
    } catch {
      setShowPermissionModal(true);
    }
  }

  const containerStyle = {
    marginTop: "2rem",
    marginBottom: "2.5rem",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--gray-200)",
  };


  const {user}= useAuth();
  const currentUserId = user?.id;

  return (
    <div style={containerStyle}>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "1rem",
          color: "var(--gray-900)",
        }}
      >
        Members
      </h3>


      {members.map((m) => (
        <div
            key={m.user_id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0",
              borderBottom: "1px solid var(--gray-100)",
              fontSize: "0.875rem",
            }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span>{m.email}</span>
            <span style={{ color: "var(--gray-500)", fontSize: "0.75rem" }}>
              {m.role}
            </span>
          </div>

          {m.user_id !== currentUserId && (
            <Button
                variant="ghost"
                onClick={() => handleRemove(m.user_id)}
            >
                Remove
            </Button>
            )}
        </div>
      ))}

      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--gray-200)" }}>


        <h4
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
          }}
        >
          Add member
        </h4>

        {error && (
          <div style={{ marginBottom: "0.75rem", color: "var(--danger)", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>  
          <Input
            placeholder="user@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={handleAdd} isLoading={loading}>
            Add
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="Permission Required"
        footer={
          <Button onClick={() => setShowPermissionModal(false)}>
            OK
          </Button>
        }
      >
        <p>
          You don’t have permission to remove members from this organization.
        </p>
      </Modal>

    </div>
  );
}
