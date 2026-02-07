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
    await addMember(orgId, { email, role });
    setEmail("");
    await refresh();
    setLoading(false);
  }

  async function handleRemove(userId) {
    try {
      await removeMember(orgId, userId);
      await refresh();
    } catch {
      setShowPermissionModal(true);
    }
  }



  const {user}= useAuth();
  const currentUserId = user?.id;

  return (
    <div>
      <h3>Members</h3>

      {members.map((m) => (
        <div key={m.user_id} style={{ display: "flex", gap: "1rem" }}>
          <span>{m.email}</span>
          <span>{m.role}</span>
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

      <h4>Add member</h4>
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
