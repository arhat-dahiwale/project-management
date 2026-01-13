import pool from "../db/index.js";

export async function listTasksByProject(projectId) {
    const result = await pool.query(
        `SELECT id, title, status, description, created_at
        FROM tasks 
        WHERE project_id=$1
        ORDER BY created_at DESC`,
        [projectId]
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
    const res = await pool.query(
        `DELETE FROM tasks 
        WHERE id=$1 AND project_id=$2
        RETURNING id`,
        [taskId,projectId]
    );

    return res.rows.length > 0;
}