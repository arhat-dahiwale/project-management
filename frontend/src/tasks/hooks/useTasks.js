// frontend/src/tasks/hooks/useTasks.js

import { useState, useCallback, useEffect } from "react";
import * as tasksApi from "../tasks.api";

export function useTasks(orgId, projectId) {
  const [tasks, setTasks] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async ({ cursor = null, isLoadMore = false } = {}) => {

    if (!orgId || !projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await tasksApi.getTasks(orgId, projectId, { cursor });
      
      const newTasks = response.data || [];
      const newCursor = response.nextCursor;

      setNextCursor(newCursor);

      if (isLoadMore) {
        setTasks((prev) => [...prev, ...newTasks]);
      } else {
        setTasks(newTasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, projectId]);


  useEffect(() => {
    setTasks([]); 
    setNextCursor(null);
    fetchTasks({ cursor: null, isLoadMore: false });
  }, [fetchTasks]);


  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading) {
      fetchTasks({ cursor: nextCursor, isLoadMore: true });
    }
  }, [nextCursor, isLoading, fetchTasks]);

  
  
  const createTask = async (payload) => {
    const newTask = await tasksApi.createTask(orgId, projectId, payload);
    setTasks((prev) => [newTask, ...prev]); 
    return newTask;
  };

  const updateTask = async (taskId, payload) => {
    const updated = await tasksApi.updateTask(orgId, projectId, taskId, payload);
    setTasks((prev) => 
      prev.map((t) => (t.id === taskId ? updated : t))
    );
    return updated;
  };

  const deleteTask = async (taskId) => {
    await tasksApi.deleteTask(orgId, projectId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return {
    tasks,         
    isLoading,
    error,
    nextCursor,    
    loadMore,      
    createTask,
    updateTask,
    deleteTask,
    refresh: () => fetchTasks({ cursor: null, isLoadMore: false })
  };
}