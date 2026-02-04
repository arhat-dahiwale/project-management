// frontend/src/tasks/components/TaskItem.jsx
import React, { useState } from "react";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

export function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await onUpdate(task.id, { 
        title: editTitle, 
        description: editDesc 
      });
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      setIsDeleting(false);
      alert("Failed to delete");
    }
  };

  const handleMove = async (newStatus) => {
    setIsSaving(true);
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (err) {
      alert("Failed to move task");
    } finally {
      setIsSaving(false);
    }
  };


  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "var(--radius-md)",
    padding: "1rem",
    marginBottom: "1rem",
    border: "1px solid var(--gray-200)",
    boxShadow: "var(--shadow-sm)",
    transition: "box-shadow 0.2s"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem"
  };

  const descStyle = {
    fontSize: "0.875rem",
    color: "var(--gray-600)",
    whiteSpace: "pre-wrap",
    marginBottom: "1rem"
  };

  const actionRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
    paddingTop: "0.5rem",
    borderTop: "1px solid var(--gray-100)"
  };

  
  const renderMoveControls = () => {
    const { status } = task;
    return (
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {status !== "todo" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleMove(status === "done" ? "in_progress" : "todo")}
            disabled={isSaving}
            title="Move Back"
            style={{ padding: "0.25rem 0.5rem" }}
          >
            ←
          </Button>
        )}
        {status !== "done" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleMove(status === "todo" ? "in_progress" : "done")}
            disabled={isSaving}
            title="Move Forward"
            style={{ padding: "0.25rem 0.5rem" }}
          >
            →
          </Button>
        )}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div style={cardStyle}>
        <Input 
          value={editTitle} 
          onChange={(e) => setEditTitle(e.target.value)} 
          placeholder="Task Title"
          autoFocus
          style={{ marginBottom: "0.5rem" }}
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description..."
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--gray-300)",
            fontSize: "0.875rem",
            minHeight: "80px",
            fontFamily: "inherit",
            resize: "vertical",
            marginBottom: "0.5rem"
          }}
        />
        <div style={{ display: "flex",gap: "0.5rem", justifyContent: "flex-end" }}>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} isLoading={isSaving}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h4 style={{ fontWeight: "600", fontSize: "1rem",color: "var(--gray-900)", margin: 0 }}>
          {task.title}
        </h4>
        <Button 
          variant="ghost" 
          onClick={() => setIsEditing(true)} 
          style={{ padding: "0.25rem", color: "var(--gray-400)" }}
        >
          ✎
        </Button>
      </div>

      {task.description && (
        <div style={descStyle}>{task.description}</div>
      )}

      <div style={actionRowStyle}>
        <div style={{ fontSize: "0.75rem", color:"var(--gray-400)" }}>
          {new Date(task.created_at).toLocaleDateString()}
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
           {renderMoveControls()}
           
           <Button 
            variant="ghost" 
            onClick={handleDelete} 
            isLoading={isDeleting}
            style={{ color: "var(--danger)", padding: "0.25rem 0.5rem", marginLeft: "0.5rem" }}
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
}