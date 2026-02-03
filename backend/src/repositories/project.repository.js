// backend/src/repositories/project.repository.js

import pool from "../db/index.js";

export async function createProject(orgId, name) {
    const result = await pool.query(
        `INSERT INTO projects(id, organization_id, name)
        VALUES (gen_random_uuid(), $1,$2)
        RETURNING id, name`,
        [orgId,name]
    );

    return result.rows[0];
}

export async function listProjectsByOrg(orgId) {
    const result = await pool.query(
        `SELECT id, name, created_at
        FROM projects
        WHERE organization_id = $1
        ORDER BY created_at DESC`,
        [orgId]
    );

    return result.rows;
}

export async function getProjectById(projectId) {
    const result = await pool.query(
        `SELECT id, organization_id,name,created_at
         FROM projects
         WHERE id = $1`,
        [projectId]
    );

    return result.rows[0] || null;
}

export async function updateProject(projectId, name) {
  const result = await pool.query(
    `UPDATE projects
     SET name = $1
     WHERE id = $2
     RETURNING id, organization_id, name, created_at`,
    [name, projectId]
  );

  return result.rows[0] || null;
}


export async function deleteProject(projectId) {
  const result = await pool.query(
    `DELETE FROM projects
     WHERE id = $1
     RETURNING id`,
    [projectId]
  );

  return result.rows.length > 0;
}