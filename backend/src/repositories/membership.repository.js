// membership.repository.js

import pool from "../db/index.js";

export async function getMembership(userId, orgId) {
    const result = await pool.query(
        `SELECT role 
        FROM memberships
        WHERE user_id=$1 AND organization_id=$2`,
        [userId,orgId]
    );

    return result.rows[0] || null;
}