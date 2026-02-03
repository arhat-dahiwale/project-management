// backend/src/repositories/organization.repository.js

import pool from "../db/index.js";

export async function createOrganization(name) {
    const result = await pool.query(
        `INSERT INTO organizations(id,name)
        VALUES (gen_random_uuid(), $1)
        RETURNING id, name, created_at`,
        [name]
    );

    return result.rows[0];
}

export async function getOrganizationById(orgId) {
    const result = await pool.query(
        `SELECT id, name, created_at
        FROM organizations
        WHERE id=$1`,
        [orgId]
    );

    return result.rows[0] || null;
}

export async function updateOrganization(orgId, name) {
    const result = await pool.query(
        `UPDATE organizations
        SET name=$1
        WHERE id=$2
        RETURNING id,name,created_at`,
        [name,orgId]
    );

    return result.rows[0] || null;
}

