const pool = require("../db/pool");

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );
  return result.rows[0];
};
const createUser = async ({
  name,
  email,
  password_hash,
  role,
  organization_id,
}) => {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password_hash, role, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role, organization_id
    `,
    [name, email, password_hash, role, organization_id]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  createUser,
};
