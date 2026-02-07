// backend/src/repositories/membership.repository.js

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

export async function listUserOrganizations(userId) {
    const result = await pool.query(
        `SELECT 
            o.id,
            o.name,
            o.created_at,
            m.role
        FROM organizations o
        JOIN memberships m ON m.organization_id = o.id
        WHERE m.user_id = $1
        ORDER BY o.created_at DESC`,
        [userId]
    );

    return result.rows;
}


export async function listOrgMembers(orgId) {
  const result = await pool.query(
    `SELECT 
        u.id AS user_id,
        u.email,
        m.role
     FROM memberships m
     JOIN users u ON u.id = m.user_id
     WHERE m.organization_id = $1
     ORDER BY m.created_at ASC`,
    [orgId]
  );

  return result.rows;
}

export async function addMemberToOrg(userId, orgId, role) {
  const result = await pool.query(
    `INSERT INTO memberships (user_id, organization_id, role)
     VALUES ($1, $2, $3)
     RETURNING user_id, organization_id, role`,
    [userId, orgId, role]
  );

  return result.rows[0];
}


export async function removeMemberFromOrg(userId, orgId) {
  const result = await pool.query(
    `DELETE FROM memberships
     WHERE user_id = $1 AND organization_id = $2
     RETURNING user_id`,
    [userId, orgId]
  );

  return result.rows.length > 0;
}


export async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, email
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}