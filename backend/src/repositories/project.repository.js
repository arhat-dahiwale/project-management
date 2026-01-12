import pool from "../db";

export async function createProject(orgId, name) {
    const result = await pool.query(
        `INSERT INTO projects(id, organization_id, name)
        VALUES (gen_random_uuid(), $1,$2)
        RETURNING id, name`,
        [orgId,name]
    );

    return result.rows[0];
}

export async function listProjects(orgId, ) {
    const result = await pool.query(
        `SELECT id, name
        FROM projects
        WHERE organization_id = $1
        ORDER BY created_at DESC`,
        [orgId]
    );

    return result.rows;
}