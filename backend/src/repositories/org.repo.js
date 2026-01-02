const pool = require("../db/pool");

const getCode = async (org_id) => {
  const result = await pool.query(
    `
    SELECT join_code FROM organizations
    WHERE id = $1`,
    [org_id]
  );
  return result.rows;
};
const getOrgByName = async (org_name) => {
  const result = await pool.query(
    `
    SELECT *
    FROM organizations
    WHERE LOWER(name) = LOWER($1)
    `,
    [org_name]
  );
  return result.rows[0];
};

const getOrgByNameAndJoinCode = async (org_name, join_code) => {
  const result = await pool.query(
    `
    SELECT *
    FROM organizations
    WHERE LOWER(name) = LOWER($1)
      AND join_code = $2
    `,
    [org_name, join_code]
  );
  return result.rows[0];
};

const createOrg = async (org_name) => {
  const result = await pool.query(
    `
    INSERT INTO organizations (name)
    VALUES ($1)
    RETURNING id, name, join_code
    `,
    [org_name]
  );
  return result.rows[0];
};
const changeCode = async (newCode, organization_id) => {
  const result = await pool.query(
    `
    UPDATE organizations
    SET join_code = $1
    WHERE id = $2
    RETURNING join_code
    `,
    [newCode, organization_id]
  );

  return result.rows[0].join_code;
};
const getAllMembers = async (org_id) => {
  const result = await pool.query(
    `
    SELECT id,name,email,role FROM users
    WHERE organization_id = $1`,
    [org_id]
  );
  return result.rows;
};

const getUserById = async (userId) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  return result.rows[0];
};

const updateUserRole = async (userId, role) => {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, name, email, role
    `,
    [role, userId]
  );
  return result.rows[0];
};

module.exports = {
  getOrgByName,
  getOrgByNameAndJoinCode,
  updateUserRole,
  getUserById,
  createOrg,
  changeCode,
  getAllMembers,
  getCode,
};
