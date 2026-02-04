// frontend/src/tasks/components/TaskList.jsx
import React from "react";
import { TaskItem } from "./TaskItem";

export function TaskList({ 
  title, 
  status, 
  tasks, 
  onUpdateTask, 
  onDeleteTask 
}) {
  
  const columnTasks = tasks.filter((t) => t.status === status);

  const containerStyle = {
    backgroundColor: "var(--gray-100)",
    borderRadius: "var(--radius-lg)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: "300px"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid var(--gray-200)"
  };

  const titleStyle = {
    fontWeight: "bold",
    color: "var(--gray-700)",
    textTransform: "uppercase",
    fontSize: "0.875rem",
    letterSpacing: "0.05em"
  };

  const countStyle = {
    backgroundColor: "var(--gray-200)",
    color: "var(--gray-600)",
    borderRadius: "12px",
    padding: "0.1rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: "600"
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        <span style={countStyle}>{columnTasks.length}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: "100px" }}>
        {columnTasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
        
        {columnTasks.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)", fontSize: "0.875rem", border: "1px dashed var(--gray-300)", borderRadius: "var(--radius-md)" }}>
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}