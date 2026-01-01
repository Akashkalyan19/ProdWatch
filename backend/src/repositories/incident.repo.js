const pool = require("../db/pool");

const getAllInc = async (organization_id) => {
  const result = await pool.query(
    `
    SELECT id, title, status
    FROM incidents
    WHERE organization_id = $1
    ORDER BY created_at DESC
    `,
    [organization_id]
  );

  return result.rows;
};

const getIncById = async (organization_id, id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM incidents
    WHERE id = $1 AND organization_id = $2
    `,
    [id, organization_id]
  );

  return result.rows[0];
};

const createInc = async ({
  organization_id,
  created_by,
  title,
  description,
}) => {
  const result = await pool.query(
    `
    INSERT INTO incidents (
      organization_id,
      created_by,
      title,
      description,
      status
    )
    VALUES ($1, $2, $3, $4, 'open')
    RETURNING *
    `,
    [organization_id, created_by, title, description]
  );

  return result.rows[0];
};

/**
 * AUDITED UPDATE
 */
const updateIncStatus = async (organization_id, id, status, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("SELECT set_config('app.current_user_id', $1, true)", [
      userId,
    ]);

    const result = await client.query(
      `
      UPDATE incidents
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND organization_id = $3
      RETURNING *
      `,
      [status, id, organization_id]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllInc,
  getIncById,
  createInc,
  updateIncStatus,
};
