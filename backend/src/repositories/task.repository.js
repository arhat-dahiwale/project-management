// task.repository.js
import pool from "../db/index.js";

export async function listTasksByProject(projectId, {limit,cursor}) {
    const params = [projectId];
    let cursorCondition = "";
    if (cursor) {
        params.push(cursor);
        cursorCondition = `AND created_at < $2`;
    }
    params.push(limit);

    const result = await pool.query(
        `SELECT id, title, status, description, created_at
        FROM tasks 
        WHERE project_id=$1 AND deleted_at IS NULL ${cursorCondition}
        ORDER BY created_at DESC
        LIMIT $${params.length}`,
        params
    );

    return result.rows;
}

export async function createTask(projectId, title, description,status) {
    const result = await pool.query(
        `INSERT INTO tasks(project_id,title,status,description)
        VALUES ($1,$2,$3,$4)
        RETURNING id,title,status,created_at,description`,
        [projectId,title,status,description]
    );

    return result.rows[0];
}

/*
This function returns the updated task if task id found else null
it doesn't define ownership or authorization
*/
export async function updateTask(projectId, taskId,title,description,status) {
    const result = await pool.query(
        `UPDATE tasks 
        SET title=$1, description=$2, status=$3
        WHERE id=$4 AND project_id=$5
        RETURNING id,title,description,status,created_at`,
        [title,description,status,taskId,projectId]
    );

    return (result.rows.length === 0) ? null : result.rows[0];
}

export async function deleteTask(projectId,taskId) {
    const result = await pool.query(
        `UPDATE tasks 
        SET deleted_at=now()
        WHERE id=$1 AND project_id=$2 AND deleted_at=NULL
        RETURNING id`,
        [taskId,projectId]
    );

    return result.rows.length > 0;
}