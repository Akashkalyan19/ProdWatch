const pool = require("../db/pool");

const getByName = async (org_name) => {
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

const getByNameAndJoinCode = async (org_name, join_code) => {
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

module.exports = {
  getByName,
  getByNameAndJoinCode,
  createOrg,
};
